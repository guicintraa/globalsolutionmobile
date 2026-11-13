import type { StatusDoacao } from '@/types/api';

export const MINUTOS_MINIMOS_DE_PRAZO = 30;

export function podeAlterarDoacao(status: StatusDoacao) {
  return status === 'ATIVA' || status === 'ESGOTADA';
}
