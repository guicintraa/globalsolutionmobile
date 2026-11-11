import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';

export function useAtualizarAoVoltar(atualizar: () => void) {
  const ultimaAtualizacao = useRef(atualizar);
  const jaFocou = useRef(false);

  useEffect(() => {
    ultimaAtualizacao.current = atualizar;
  }, [atualizar]);

  useFocusEffect(
    useCallback(() => {
      if (jaFocou.current) {
        ultimaAtualizacao.current();
      }
      jaFocou.current = true;
    }, [])
  );
}
