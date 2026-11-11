import type { TomDoSelo } from '@/components';
import type { Papel, StatusDoacao, Unidade } from '@/types/api';

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

const nomesDaUnidade: Record<Unidade, { singular: string; plural: string }> = {
  UNIDADE: { singular: 'unidade', plural: 'unidades' },
  KG: { singular: 'kg', plural: 'kg' },
  PACOTE: { singular: 'pacote', plural: 'pacotes' },
};

export function descreverQuantidade(quantidade: number, unidade: Unidade) {
  const nomes = nomesDaUnidade[unidade];
  return `${quantidade} ${quantidade === 1 ? nomes.singular : nomes.plural}`;
}
