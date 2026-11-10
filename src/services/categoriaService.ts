import type { CategoriaResponse } from '@/types/api';

import { api } from './api';

export const categoriaService = {
  listar: () => api<CategoriaResponse[]>('/api/categorias'),
};
