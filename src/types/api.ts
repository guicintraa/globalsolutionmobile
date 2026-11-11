export type Papel = 'DOADOR' | 'RECEPTOR' | 'ADMIN';

export type Unidade = 'UNIDADE' | 'KG' | 'PACOTE';

export type StatusDoacao = 'ATIVA' | 'ESGOTADA' | 'EXPIRADA' | 'CANCELADA';

export type StatusReserva = 'ATIVA' | 'RETIRADA' | 'CANCELADA' | 'EXPIRADA';

export type RegistroRequest = {
  nome: string;
  email: string;
  senha: string;
  telefone: string | null;
  papel: Exclude<Papel, 'ADMIN'>;
  endereco: string | null;
  cidade: string;
  uf: string;
};

export type UsuarioResponse = {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  papel: Papel;
  endereco: string | null;
  cidade: string | null;
  uf: string | null;
  ativo: boolean;
  criadoEm: string;
};

export type LoginRequest = {
  email: string;
  senha: string;
};

export type UsuarioDaSessao = Pick<
  UsuarioResponse,
  'id' | 'nome' | 'email' | 'papel'
>;

export type LoginResponse = {
  token: string;
  tipo: string;
  expiraEm: string;
  usuario: UsuarioDaSessao;
};

export type CategoriaResponse = {
  id: number;
  nome: string;
  descricao: string | null;
  prazoMaxHoras: number;
};

export type DoacaoRequest = {
  titulo: string;
  descricao: string | null;
  categoriaId: number;
  quantidadeTotal: number;
  unidade: Unidade;
  prazoRetirada: string;
  orientacoesConservacao: string | null;
  geradaPorIa: boolean;
};

export type DoadorResumo = {
  id: number;
  nome: string;
  telefone: string | null;
  endereco: string | null;
  cidade: string | null;
  uf: string | null;
};

export type DoacaoResponse = {
  id: number;
  titulo: string;
  descricao: string | null;
  categoria: Pick<CategoriaResponse, 'id' | 'nome'>;
  doador: DoadorResumo;
  quantidadeTotal: number;
  quantidadeDisponivel: number;
  unidade: Unidade;
  status: StatusDoacao;
  prazoRetirada: string;
  criadoEm: string;
  orientacoesConservacao: string | null;
  geradaPorIa: boolean;
};

export type ReservaRequest = {
  doacaoId: number;
  quantidade: number;
};

export type ReservaResponse = {
  id: number;
  quantidade: number;
  doacao: Pick<
    DoacaoResponse,
    'id' | 'titulo' | 'unidade' | 'prazoRetirada' | 'status' | 'doador'
  >;
  receptor: Pick<UsuarioResponse, 'id' | 'nome' | 'telefone'>;
  status: StatusReserva;
  codigoRetirada: string | null;
  criadoEm: string;
  retiradoEm: string | null;
};

export type RetiradaRequest = {
  codigoRetirada: string;
};

export type OrientacaoRequest = {
  titulo: string;
  descricao: string | null;
  categoriaId: number;
};

export type OrientacaoResponse = {
  orientacao: string | null;
  fontes: string[];
  aviso: string | null;
};

export type Page<T> = {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};

export type CodigoErro =
  | 'VALIDACAO'
  | 'PRAZO_INVALIDO'
  | 'CODIGO_RETIRADA_INVALIDO'
  | 'NAO_AUTENTICADO'
  | 'CREDENCIAIS_INVALIDAS'
  | 'ACESSO_NEGADO'
  | 'NAO_ENCONTRADO'
  | 'EMAIL_EM_USO'
  | 'CATEGORIA_DUPLICADA'
  | 'REGISTRO_EM_USO'
  | 'SALDO_INSUFICIENTE'
  | 'DOACAO_INDISPONIVEL'
  | 'RESERVA_DUPLICADA'
  | 'ESTADO_INVALIDO'
  | 'ERRO_INTERNO'
  | 'IA_INDISPONIVEL';

export type ErroDeCampo = {
  campo: string;
  mensagem: string;
};

export type ErroResponse = {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  codigo: CodigoErro;
  timestamp: string;
  erros: ErroDeCampo[];
};
