import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { cores, espacos, fontes, raios, tamanhos } from '@/theme';

type Variante = 'primario' | 'secundario' | 'perigo';

type BotaoProps = {
  titulo: string;
  onPress: () => void;
  variante?: Variante;
  carregando?: boolean;
  desabilitado?: boolean;
  estilo?: StyleProp<ViewStyle>;
};

const aparencias = {
  primario: {
    fundo: cores.primaria,
    fundoPressionado: cores.primariaEscura,
    texto: cores.textoInverso,
    borda: cores.primaria,
  },
  secundario: {
    fundo: cores.superficie,
    fundoPressionado: cores.primariaClara,
    texto: cores.primaria,
    borda: cores.primaria,
  },
  perigo: {
    fundo: cores.superficie,
    fundoPressionado: cores.erroClaro,
    texto: cores.erro,
    borda: cores.erro,
  },
} as const;

export function Botao({
  titulo,
  onPress,
  variante = 'primario',
  carregando = false,
  desabilitado = false,
  estilo,
}: BotaoProps) {
  const aparencia = aparencias[variante];
  const inativo = desabilitado || carregando;

  return (
    <Pressable
      onPress={onPress}
      disabled={inativo}
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityState={{ disabled: inativo, busy: carregando }}
      style={({ pressed }) => [
        styles.botao,
        {
          backgroundColor: pressed
            ? aparencia.fundoPressionado
            : aparencia.fundo,
          borderColor: aparencia.borda,
        },
        inativo && styles.inativo,
        estilo,
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={aparencia.texto} />
      ) : (
        <Text style={[styles.titulo, { color: aparencia.texto }]}>
          {titulo}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    minHeight: 52,
    paddingHorizontal: espacos.lg,
    borderRadius: raios.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inativo: {
    opacity: 0.6,
  },
  titulo: {
    fontFamily: fontes.negrito,
    fontSize: tamanhos.corpo,
  },
});
