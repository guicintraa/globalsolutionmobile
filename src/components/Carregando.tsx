import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { cores, espacos, fontes, tamanhos } from '@/theme';

type CarregandoProps = {
  mensagem?: string;
};

export function Carregando({ mensagem = 'Carregando...' }: CarregandoProps) {
  return (
    <View
      style={styles.container}
      accessibilityRole="progressbar"
      accessibilityLabel={mensagem}
    >
      <ActivityIndicator size="large" color={cores.primaria} />
      <Text style={styles.mensagem}>{mensagem}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: espacos.lg,
  },
  mensagem: {
    marginTop: espacos.md,
    fontFamily: fontes.semibold,
    fontSize: tamanhos.corpo,
    color: cores.textoSecundario,
  },
});
