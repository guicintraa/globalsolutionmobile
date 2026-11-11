import type { Papel, TipoPerfil } from '@/types/api';

export type PapelDeCadastro = Exclude<Papel, 'ADMIN'>;

export const rotulosDoPapel: Record<Papel, string> = {
  DOADOR: 'Doador',
  RECEPTOR: 'Receptor',
  ADMIN: 'Administrador',
};

export const rotulosDoTipoPerfil: Record<TipoPerfil, string> = {
  PADARIA: 'Padaria',
  FEIRA: 'Feira',
  MERCADO: 'Mercado',
  ONG: 'ONG',
  FAMILIA: 'Família',
};

export const tiposDePerfilPorPapel: Record<PapelDeCadastro, TipoPerfil[]> = {
  DOADOR: ['PADARIA', 'FEIRA', 'MERCADO'],
  RECEPTOR: ['ONG', 'FAMILIA'],
};
