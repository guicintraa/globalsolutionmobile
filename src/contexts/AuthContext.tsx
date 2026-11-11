import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';

import { definirToken } from '@/services/api';
import { authService } from '@/services/authService';
import type {
  LoginRequest,
  RegistroRequest,
  UsuarioDaSessao,
} from '@/types/api';

type ValorDaAutenticacao = {
  usuario: UsuarioDaSessao | null;
  entrar: (dados: LoginRequest) => Promise<void>;
  registrar: (dados: RegistroRequest) => Promise<void>;
  sair: () => void;
};

const AuthContext = createContext<ValorDaAutenticacao | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioDaSessao | null>(null);

  const entrar = useCallback(async (dados: LoginRequest) => {
    const resposta = await authService.entrar(dados);
    definirToken(resposta.token);
    setUsuario(resposta.usuario);
  }, []);

  const registrar = useCallback(async (dados: RegistroRequest) => {
    await authService.registrar(dados);
  }, []);

  const sair = useCallback(() => {
    definirToken(null);
    setUsuario(null);
  }, []);

  const valor = useMemo(
    () => ({ usuario, entrar, registrar, sair }),
    [usuario, entrar, registrar, sair]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth precisa ser usado dentro do AuthProvider.');
  }
  return contexto;
}
