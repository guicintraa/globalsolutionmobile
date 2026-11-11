import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';

import { definirAoExpirarSessao, definirToken } from '@/services/api';
import { armazenamentoDaSessao } from '@/services/armazenamentoDaSessao';
import { authService } from '@/services/authService';
import type {
  LoginRequest,
  RegistroRequest,
  UsuarioResponse,
} from '@/types/api';
import { prazoVencido } from '@/utils/datas';

const AVISO_DE_SESSAO_EXPIRADA = 'Sua sessão expirou. Entre de novo.';
const AVISO_DE_ADMINISTRADOR =
  'O perfil de administrador é usado pelo Swagger, não pelo app.';

type ValorDaAutenticacao = {
  usuario: UsuarioResponse | null;
  restaurando: boolean;
  aviso: string | null;
  entrar: (dados: LoginRequest) => Promise<void>;
  registrar: (dados: RegistroRequest) => Promise<void>;
  sair: () => Promise<void>;
};

const AuthContext = createContext<ValorDaAutenticacao | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioResponse | null>(null);
  const [restaurando, setRestaurando] = useState(true);
  const [aviso, setAviso] = useState<string | null>(null);

  const encerrar = useCallback(async (motivo: string | null) => {
    definirToken(null);
    setUsuario(null);
    setAviso(motivo);
    await armazenamentoDaSessao.apagar();
  }, []);

  useEffect(() => {
    definirAoExpirarSessao(() => {
      encerrar(AVISO_DE_SESSAO_EXPIRADA);
    });
    return () => definirAoExpirarSessao(null);
  }, [encerrar]);

  useEffect(() => {
    let ativo = true;

    armazenamentoDaSessao
      .ler()
      .then((salva) => {
        if (!ativo || !salva) {
          return;
        }
        if (prazoVencido(salva.expiraEm) || salva.usuario.papel === 'ADMIN') {
          armazenamentoDaSessao.apagar();
          return;
        }
        definirToken(salva.token);
        setUsuario(salva.usuario);
      })
      .catch(() => undefined)
      .finally(() => {
        if (ativo) {
          setRestaurando(false);
        }
      });

    return () => {
      ativo = false;
    };
  }, []);

  const entrar = useCallback(async (dados: LoginRequest) => {
    setAviso(null);
    const resposta = await authService.entrar(dados);

    if (resposta.usuario.papel === 'ADMIN') {
      setAviso(AVISO_DE_ADMINISTRADOR);
      return;
    }

    definirToken(resposta.token);
    try {
      const perfil = await authService.buscarMeuUsuario();
      await armazenamentoDaSessao.salvar({
        token: resposta.token,
        expiraEm: resposta.expiraEm,
        usuario: perfil,
      });
      setUsuario(perfil);
    } catch (erro) {
      definirToken(null);
      throw erro;
    }
  }, []);

  const registrar = useCallback(async (dados: RegistroRequest) => {
    await authService.registrar(dados);
  }, []);

  const sair = useCallback(() => encerrar(null), [encerrar]);

  const valor = useMemo(
    () => ({ usuario, restaurando, aviso, entrar, registrar, sair }),
    [usuario, restaurando, aviso, entrar, registrar, sair]
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
