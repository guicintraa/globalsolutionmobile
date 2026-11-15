import { ApiError } from '@/services/api';
import type { CodigoDoErro } from '@/services/api';

const mensagens: Record<CodigoDoErro, string> = {
  VALIDACAO: 'Confira os campos destacados.',
  PRAZO_INVALIDO: 'Escolha um prazo entre 30 minutos e o limite da categoria.',
  CODIGO_RETIRADA_INVALIDO: 'Código incorreto. Confira com o receptor.',
  NAO_AUTENTICADO: 'Sua sessão expirou. Entre de novo.',
  CREDENCIAIS_INVALIDAS: 'E-mail ou senha incorretos.',
  ACESSO_NEGADO: 'Você não tem permissão para isso.',
  NAO_ENCONTRADO: 'Não encontramos esse registro.',
  EMAIL_EM_USO: 'Já existe uma conta com este e-mail.',
  CATEGORIA_DUPLICADA: 'Já existe uma categoria com esse nome.',
  REGISTRO_EM_USO: 'Esta doação já tem reservas. Deseja cancelá-la?',
  SALDO_INSUFICIENTE:
    'Não há essa quantidade disponível. Atualize e tente de novo.',
  DOACAO_INDISPONIVEL: 'Esta doação não está mais disponível.',
  RESERVA_DUPLICADA: 'Você já tem uma reserva ativa nesta doação.',
  ESTADO_INVALIDO: 'Não é possível fazer isso no status atual.',
  ERRO_INTERNO: 'Algo deu errado no servidor. Tente de novo.',
  IA_INDISPONIVEL: 'A IA está indisponível agora. Escreva a orientação.',
  FALHA_DE_REDE: 'Sem conexão com o servidor. Tente de novo.',
  TEMPO_ESGOTADO:
    'O servidor demorou para responder. Aguarde alguns segundos e tente de novo.',
};

export function mensagemDoCodigo(codigo: CodigoDoErro) {
  return mensagens[codigo];
}

export function mensagemDoErro(erro: unknown) {
  if (erro instanceof ApiError) {
    return mensagens[erro.codigo] ?? mensagens.ERRO_INTERNO;
  }
  return mensagens.ERRO_INTERNO;
}

export function errosPorCampo(erro: unknown): Record<string, string> {
  if (!(erro instanceof ApiError) || erro.codigo !== 'VALIDACAO') {
    return {};
  }
  return Object.fromEntries(
    erro.erros.map(({ campo, mensagem }) => [campo, mensagem])
  );
}
