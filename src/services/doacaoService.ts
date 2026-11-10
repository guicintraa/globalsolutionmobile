import type {
  DoacaoRequest,
  DoacaoResponse,
  Page,
  ReservaResponse,
  StatusDoacao,
  StatusReserva,
} from '@/types/api';

import { api } from './api';

type Paginacao = {
  page?: number;
  size?: number;
};

type FiltrosDisponiveis = Paginacao & {
  categoriaId?: number;
  cidade?: string;
  sort?: string;
};

type FiltrosMinhas = Paginacao & {
  status?: StatusDoacao;
  sort?: string;
};

type FiltrosDasReservas = Paginacao & {
  status?: StatusReserva;
};

export const doacaoService = {
  listarDisponiveis: (filtros: FiltrosDisponiveis = {}) =>
    api<Page<DoacaoResponse>>('/api/doacoes', { parametros: filtros }),
  listarMinhas: (filtros: FiltrosMinhas = {}) =>
    api<Page<DoacaoResponse>>('/api/doacoes/minhas', { parametros: filtros }),
  buscar: (id: number) => api<DoacaoResponse>(`/api/doacoes/${id}`),
  criar: (dados: DoacaoRequest) =>
    api<DoacaoResponse>('/api/doacoes', {
      metodo: 'POST',
      corpo: dados,
      idempotente: true,
    }),
  editar: (id: number, dados: DoacaoRequest) =>
    api<DoacaoResponse>(`/api/doacoes/${id}`, { metodo: 'PUT', corpo: dados }),
  cancelar: (id: number) =>
    api<DoacaoResponse>(`/api/doacoes/${id}/cancelamento`, {
      metodo: 'PATCH',
    }),
  excluir: (id: number) =>
    api<void>(`/api/doacoes/${id}`, { metodo: 'DELETE' }),
  listarReservas: (id: number, filtros: FiltrosDasReservas = {}) =>
    api<Page<ReservaResponse>>(`/api/doacoes/${id}/reservas`, {
      parametros: filtros,
    }),
};
