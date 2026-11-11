import type { Papel } from '@/types/api';

export type PapelDeCadastro = Exclude<Papel, 'ADMIN'>;

export const rotulosDoPapel: Record<Papel, string> = {
  DOADOR: 'Doador',
  RECEPTOR: 'Receptor',
  ADMIN: 'Administrador',
};
