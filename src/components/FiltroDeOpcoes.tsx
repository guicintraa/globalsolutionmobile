import { useEffect, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import type { ScrollViewInstance } from 'react-native';

import { cores, espacos, fontes, raios, tamanhos } from '@/theme';

import type { Opcao } from './SeletorDeOpcoes';

type FiltroDeOpcoesProps<T extends string | number> = {
  rotulo: string;
  opcoes: Opcao<T>[];
  valor: T | null;
  aoSelecionar: (valor: T | null) => void;
  rotuloDeTodas?: string;
};

export function FiltroDeOpcoes<T extends string | number>({
  rotulo,
  opcoes,
  valor,
  aoSelecionar,
  rotuloDeTodas = 'Todas',
}: FiltroDeOpcoesProps<T>) {
  const rolagem = useRef<ScrollViewInstance>(null);
  const itens = [{ valor: null, rotulo: rotuloDeTodas }, ...opcoes];

  useEffect(() => {
    if (valor === null) {
      rolagem.current?.scrollTo({ x: 0, animated: true });
    }
  }, [valor]);

  return (
    <ScrollView
      ref={rolagem}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.rolagem}
      contentContainerStyle={styles.lista}
      accessibilityRole="radiogroup"
      accessibilityLabel={rotulo}
    >
      {itens.map((item) => {
        const selecionada = item.valor === valor;

        return (
          <Pressable
            key={item.valor ?? 'todas'}
            onPress={() => aoSelecionar(item.valor)}
            accessibilityRole="radio"
            accessibilityState={{ checked: selecionada }}
            style={({ pressed }) => [
              styles.opcao,
              pressed && styles.pressionada,
              selecionada && styles.selecionada,
            ]}
          >
            <Text
              style={[styles.texto, selecionada && styles.textoSelecionado]}
            >
              {item.rotulo}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  rolagem: {
    flexGrow: 0,
  },
  lista: {
    gap: espacos.sm,
    paddingHorizontal: espacos.lg,
  },
  opcao: {
    paddingVertical: espacos.sm,
    paddingHorizontal: espacos.md,
    borderRadius: raios.total,
    borderWidth: 1.5,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
  },
  pressionada: {
    backgroundColor: cores.primariaClara,
  },
  selecionada: {
    borderColor: cores.primaria,
    backgroundColor: cores.primaria,
  },
  texto: {
    fontFamily: fontes.semibold,
    fontSize: tamanhos.legenda + 1,
    color: cores.texto,
  },
  textoSelecionado: {
    color: cores.textoInverso,
  },
});
