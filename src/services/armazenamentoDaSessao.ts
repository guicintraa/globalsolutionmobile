import * as SecureStore from 'expo-secure-store';

import type { LoginResponse, UsuarioResponse } from '@/types/api';

const CHAVE = 'sobrabem.sessao';

export type SessaoSalva = Pick<LoginResponse, 'token' | 'expiraEm'> & {
  usuario: UsuarioResponse;
};

export const armazenamentoDaSessao = {
  salvar: (sessao: SessaoSalva) =>
    SecureStore.setItemAsync(CHAVE, JSON.stringify(sessao)),
  async ler(): Promise<SessaoSalva | null> {
    const valor = await SecureStore.getItemAsync(CHAVE);
    if (!valor) {
      return null;
    }
    try {
      return JSON.parse(valor) as SessaoSalva;
    } catch {
      return null;
    }
  },
  apagar: () => SecureStore.deleteItemAsync(CHAVE),
};
