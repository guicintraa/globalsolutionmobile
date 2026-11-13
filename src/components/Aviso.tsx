import { StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { cores, espacos, fontes, raios, tamanhos } from '@/theme';

type AvisoProps = {
  mensagem: string;
  tom?: 'erro' | 'sucesso' | 'aviso';
  estilo?: StyleProp<ViewStyle>;
};

const paletas = {
  erro: { fundo: cores.erroClaro, texto: cores.erro },
  sucesso: { fundo: cores.primariaClara, texto: cores.primaria },
  aviso: { fundo: cores.avisoClaro, texto: cores.aviso },
} as const;

export function Aviso({ mensagem, tom = 'erro', estilo }: AvisoProps) {
  const paleta = paletas[tom];

  return (
    <View
      style={[styles.aviso, { backgroundColor: paleta.fundo }, estilo]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Text style={[styles.texto, { color: paleta.texto }]}>{mensagem}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  aviso: {
    marginBottom: espacos.md,
    padding: espacos.md,
    borderRadius: raios.md,
  },
  texto: {
    fontFamily: fontes.semibold,
    fontSize: tamanhos.legenda + 1,
  },
});
