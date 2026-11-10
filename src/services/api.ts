import type { CodigoErro, ErroDeCampo, ErroResponse } from '@/types/api';

const URL_BASE = process.env.EXPO_PUBLIC_API_URL ?? '';
const TEMPO_LIMITE_MS = 30000;

export type CodigoDoErro = CodigoErro | 'FALHA_DE_REDE';

export class ApiError extends Error {
  status: number;
  codigo: CodigoDoErro;
  erros: ErroDeCampo[];

  constructor(status: number, codigo: CodigoDoErro, erros: ErroDeCampo[] = []) {
    super(codigo);
    this.name = 'ApiError';
    this.status = status;
    this.codigo = codigo;
    this.erros = erros;
  }
}

type Metodo = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type Parametros = Record<string, string | number | undefined>;

type Opcoes = {
  metodo?: Metodo;
  corpo?: unknown;
  parametros?: Parametros;
  idempotente?: boolean;
};

const sessao: { token: string | null; aoExpirar: (() => void) | null } = {
  token: null,
  aoExpirar: null,
};

export function definirToken(token: string | null) {
  sessao.token = token;
}

export function definirAoExpirarSessao(aoExpirar: (() => void) | null) {
  sessao.aoExpirar = aoExpirar;
}

function montarUrl(caminho: string, parametros: Parametros = {}) {
  const busca = Object.entries(parametros)
    .filter(([, valor]) => valor !== undefined && valor !== '')
    .map(
      ([chave, valor]) =>
        `${encodeURIComponent(chave)}=${encodeURIComponent(String(valor))}`
    )
    .join('&');

  return `${URL_BASE}${caminho}${busca ? `?${busca}` : ''}`;
}

function gerarChaveDeIdempotencia() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (letra) => {
    const aleatorio = Math.floor(Math.random() * 16);
    const valor = letra === 'x' ? aleatorio : (aleatorio % 4) + 8;
    return valor.toString(16);
  });
}

async function lerErro(resposta: Response) {
  try {
    const corpo = (await resposta.json()) as Partial<ErroResponse>;
    return new ApiError(
      resposta.status,
      corpo.codigo ?? 'ERRO_INTERNO',
      corpo.erros ?? []
    );
  } catch {
    return new ApiError(resposta.status, 'ERRO_INTERNO');
  }
}

export async function api<T>(caminho: string, opcoes: Opcoes = {}) {
  const { metodo = 'GET', corpo, parametros, idempotente = false } = opcoes;

  const cabecalhos: Record<string, string> = { Accept: 'application/json' };
  if (corpo !== undefined) {
    cabecalhos['Content-Type'] = 'application/json';
  }
  if (sessao.token) {
    cabecalhos.Authorization = `Bearer ${sessao.token}`;
  }
  if (idempotente) {
    cabecalhos['Idempotency-Key'] = gerarChaveDeIdempotencia();
  }

  const controle = new AbortController();
  const temporizador = setTimeout(() => controle.abort(), TEMPO_LIMITE_MS);

  let resposta: Response;
  try {
    resposta = await fetch(montarUrl(caminho, parametros), {
      method: metodo,
      headers: cabecalhos,
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
      signal: controle.signal,
    });
  } catch {
    throw new ApiError(0, 'FALHA_DE_REDE');
  } finally {
    clearTimeout(temporizador);
  }

  if (!resposta.ok) {
    const erro = await lerErro(resposta);
    if (erro.status === 401 && sessao.token) {
      sessao.aoExpirar?.();
    }
    throw erro;
  }

  if (resposta.status === 204) {
    return undefined as T;
  }

  return (await resposta.json()) as T;
}
