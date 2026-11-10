import type {
  LoginRequest,
  LoginResponse,
  RegistroRequest,
  UsuarioResponse,
} from '@/types/api';

import { api } from './api';

export const authService = {
  registrar: (dados: RegistroRequest) =>
    api<UsuarioResponse>('/api/auth/registro', {
      metodo: 'POST',
      corpo: dados,
    }),
  entrar: (dados: LoginRequest) =>
    api<LoginResponse>('/api/auth/login', { metodo: 'POST', corpo: dados }),
  buscarMeuUsuario: () => api<UsuarioResponse>('/api/usuarios/me'),
};
