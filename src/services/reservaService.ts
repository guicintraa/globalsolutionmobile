import type {
  Page,
  ReservaRequest,
  ReservaResponse,
  RetiradaRequest,
  StatusReserva,
} from '@/types/api';

import { api } from './api';

type FiltrosMinhas = {
  status?: StatusReserva;
  page?: number;
  size?: number;
};

export const reservaService = {
  reservar: (dados: ReservaRequest) =>
    api<ReservaResponse>('/api/reservas', {
      metodo: 'POST',
      corpo: dados,
      idempotente: true,
    }),
  listarMinhas: (filtros: FiltrosMinhas = {}) =>
    api<Page<ReservaResponse>>('/api/reservas/minhas', {
      parametros: filtros,
    }),
  cancelar: (id: number) =>
    api<ReservaResponse>(`/api/reservas/${id}/cancelamento`, {
      metodo: 'PATCH',
    }),
  confirmarRetirada: (id: number, dados: RetiradaRequest) =>
    api<ReservaResponse>(`/api/reservas/${id}/retirada`, {
      metodo: 'PATCH',
      corpo: dados,
    }),
};
