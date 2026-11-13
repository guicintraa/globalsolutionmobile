import type {
  CategoriaResponse,
  LoginRequest,
  RetiradaRequest,
  Unidade,
} from '@/types/api';

import { MINUTOS_MINIMOS_DE_PRAZO } from './regras';
import { descreverQuantidade } from './rotulos';
import type { PapelDeCadastro } from './rotulos';

export type ErrosDoFormulario<T> = Partial<Record<keyof T, string>>;

export type FormularioDeCadastro = {
  papel: PapelDeCadastro | null;
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  endereco: string;
  cidade: string;
  uf: string;
};

export type FormularioDeReserva = {
  quantidade: string;
};

export type FormularioDeDoacao = {
  titulo: string;
  descricao: string;
  categoriaId: number | null;
  quantidadeTotal: string;
  unidade: Unidade | null;
  prazoRetirada: Date | null;
  orientacoesConservacao: string;
  geradaPorIa: boolean;
};

type ContextoDaDoacao = {
  categoria?: CategoriaResponse;
  reservado?: number;
  agora?: Date;
};

const FORMATO_DE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function temErros(erros: object) {
  return Object.keys(erros).length > 0;
}

function validarEmail(email: string) {
  if (!email) {
    return 'Informe o e-mail.';
  }
  if (email.length > 150 || !FORMATO_DE_EMAIL.test(email)) {
    return 'Informe um e-mail válido.';
  }
  return undefined;
}

export function validarLogin(dados: LoginRequest) {
  const erros: ErrosDoFormulario<LoginRequest> = {};

  const erroDoEmail = validarEmail(dados.email);
  if (erroDoEmail) {
    erros.email = erroDoEmail;
  }
  if (!dados.senha) {
    erros.senha = 'Informe a senha.';
  }

  return erros;
}

export function validarCadastro(dados: FormularioDeCadastro) {
  const erros: ErrosDoFormulario<FormularioDeCadastro> = {};

  if (!dados.papel) {
    erros.papel = 'Escolha se você é doador ou receptor.';
  }

  const nome = dados.nome.trim();
  if (nome.length < 3 || nome.length > 120) {
    erros.nome = 'O nome deve ter de 3 a 120 caracteres.';
  }

  const erroDoEmail = validarEmail(dados.email.trim());
  if (erroDoEmail) {
    erros.email = erroDoEmail;
  }

  const senha = dados.senha;
  if (
    senha.length < 8 ||
    senha.length > 60 ||
    !/[A-Za-zÀ-ÿ]/.test(senha) ||
    !/\d/.test(senha)
  ) {
    erros.senha = 'Use de 8 a 60 caracteres, com letras e números.';
  }

  if (dados.telefone && !/^\d{10,11}$/.test(dados.telefone)) {
    erros.telefone = 'Informe o telefone com DDD, só números.';
  }

  if (dados.papel === 'DOADOR') {
    const endereco = dados.endereco.trim();
    if (!endereco) {
      erros.endereco = 'Informe o endereço de retirada.';
    } else if (endereco.length > 200) {
      erros.endereco = 'O endereço deve ter até 200 caracteres.';
    }
  }

  const cidade = dados.cidade.trim();
  if (!cidade) {
    erros.cidade = 'Informe a cidade.';
  } else if (cidade.length > 80) {
    erros.cidade = 'A cidade deve ter até 80 caracteres.';
  }

  if (!/^[A-Z]{2}$/.test(dados.uf)) {
    erros.uf = 'Informe a UF com 2 letras.';
  }

  return erros;
}

export function validarReserva(
  dados: FormularioDeReserva,
  disponivel: number,
  unidade: Unidade
) {
  const erros: ErrosDoFormulario<FormularioDeReserva> = {};
  const quantidade = Number(dados.quantidade);

  if (!dados.quantidade) {
    erros.quantidade = 'Informe a quantidade.';
  } else if (!Number.isInteger(quantidade) || quantidade < 1) {
    erros.quantidade = 'A quantidade mínima é 1.';
  } else if (quantidade > disponivel) {
    erros.quantidade = `Máximo disponível: ${descreverQuantidade(disponivel, unidade)}.`;
  }

  return erros;
}

export function validarDoacao(
  dados: FormularioDeDoacao,
  { categoria, reservado = 0, agora = new Date() }: ContextoDaDoacao = {}
) {
  const erros: ErrosDoFormulario<FormularioDeDoacao> = {};

  const titulo = dados.titulo.trim();
  if (titulo.length < 3 || titulo.length > 100) {
    erros.titulo = 'O título deve ter de 3 a 100 caracteres.';
  }

  if (dados.descricao.trim().length > 500) {
    erros.descricao = 'A descrição deve ter até 500 caracteres.';
  }

  if (dados.categoriaId === null) {
    erros.categoriaId = 'Escolha a categoria.';
  }

  const quantidade = Number(dados.quantidadeTotal);
  if (
    !dados.quantidadeTotal ||
    !Number.isInteger(quantidade) ||
    quantidade < 1 ||
    quantidade > 9999
  ) {
    erros.quantidadeTotal = 'Informe uma quantidade de 1 a 9999.';
  } else if (quantidade < reservado) {
    erros.quantidadeTotal = `A quantidade não pode ser menor que o já reservado (${reservado}).`;
  }

  if (!dados.unidade) {
    erros.unidade = 'Escolha a unidade.';
  }

  const prazo = dados.prazoRetirada;
  const minimo = agora.getTime() + MINUTOS_MINIMOS_DE_PRAZO * 60 * 1000;
  if (!prazo) {
    erros.prazoRetirada = 'Escolha até quando a doação pode ser retirada.';
  } else if (prazo.getTime() < minimo) {
    erros.prazoRetirada = `Escolha um horário daqui a pelo menos ${MINUTOS_MINIMOS_DE_PRAZO} minutos.`;
  } else if (
    categoria &&
    prazo.getTime() > agora.getTime() + categoria.prazoMaxHoras * 3600 * 1000
  ) {
    erros.prazoRetirada = `${categoria.nome} pode ficar no máximo ${categoria.prazoMaxHoras} h. Escolha um horário mais cedo.`;
  }

  if (dados.orientacoesConservacao.trim().length > 1000) {
    erros.orientacoesConservacao =
      'As orientações devem ter até 1000 caracteres.';
  }

  return erros;
}

export function validarPedidoDeOrientacao(
  dados: Pick<FormularioDeDoacao, 'titulo' | 'descricao' | 'categoriaId'>
) {
  const erros: ErrosDoFormulario<FormularioDeDoacao> = {};

  const titulo = dados.titulo.trim();
  if (titulo.length < 3 || titulo.length > 100) {
    erros.titulo = 'O título deve ter de 3 a 100 caracteres.';
  }
  if (dados.descricao.trim().length > 500) {
    erros.descricao = 'A descrição deve ter até 500 caracteres.';
  }
  if (dados.categoriaId === null) {
    erros.categoriaId = 'Escolha a categoria.';
  }

  return erros;
}

export function validarRetirada(dados: RetiradaRequest) {
  const erros: ErrosDoFormulario<RetiradaRequest> = {};

  if (!/^[A-Z0-9]{6}$/.test(dados.codigoRetirada)) {
    erros.codigoRetirada = 'Digite os 6 caracteres do código.';
  }

  return erros;
}
