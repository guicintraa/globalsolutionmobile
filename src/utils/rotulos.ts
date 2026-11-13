import type { Opcao, TomDoSelo } from '@/components';
import type { Papel, StatusDoacao, StatusReserva, Unidade } from '@/types/api';

export type PapelDeCadastro = Exclude<Papel, 'ADMIN'>;

export const rotulosDoPapel: Record<Papel, string> = {
  DOADOR: 'Doador',
  RECEPTOR: 'Receptor',
  ADMIN: 'Administrador',
};

export const rotulosDoStatusDaDoacao: Record<StatusDoacao, string> = {
  ATIVA: 'Disponível',
  ESGOTADA: 'Esgotada',
  EXPIRADA: 'Expirada',
  CANCELADA: 'Cancelada',
};

export const tonsDoStatusDaDoacao: Record<StatusDoacao, TomDoSelo> = {
  ATIVA: 'sucesso',
  ESGOTADA: 'aviso',
  EXPIRADA: 'neutro',
  CANCELADA: 'erro',
};

export const rotulosDoStatusDaReserva: Record<StatusReserva, string> = {
  ATIVA: 'Ativa',
  RETIRADA: 'Retirada',
  CANCELADA: 'Cancelada',
  EXPIRADA: 'Expirada',
};

export const tonsDoStatusDaReserva: Record<StatusReserva, TomDoSelo> = {
  ATIVA: 'sucesso',
  RETIRADA: 'neutro',
  CANCELADA: 'erro',
  EXPIRADA: 'aviso',
};

export const opcoesDeSituacaoDaReserva: Opcao<StatusReserva>[] = [
  { valor: 'ATIVA', rotulo: 'Ativas' },
  { valor: 'RETIRADA', rotulo: 'Retiradas' },
  { valor: 'CANCELADA', rotulo: 'Canceladas' },
  { valor: 'EXPIRADA', rotulo: 'Expiradas' },
];

const nomesDaUnidade: Record<Unidade, { singular: string; plural: string }> = {
  UNIDADE: { singular: 'unidade', plural: 'unidades' },
  KG: { singular: 'kg', plural: 'kg' },
  PACOTE: { singular: 'pacote', plural: 'pacotes' },
};

export function nomeDaUnidade(quantidade: number, unidade: Unidade) {
  const nomes = nomesDaUnidade[unidade];
  return quantidade === 1 ? nomes.singular : nomes.plural;
}

export function descreverQuantidade(quantidade: number, unidade: Unidade) {
  return `${quantidade} ${nomeDaUnidade(quantidade, unidade)}`;
}
