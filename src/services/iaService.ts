import type { OrientacaoRequest, OrientacaoResponse } from '@/types/api';

import { api } from './api';

export const iaService = {
  gerarOrientacao: (dados: OrientacaoRequest) =>
    api<OrientacaoResponse>('/api/ia/orientacoes', {
      metodo: 'POST',
      corpo: dados,
    }),
};
