import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { cores, espacos, fontes as tipos, raios, tamanhos } from '@/theme';

type NotaDaIaProps = {
  fontes?: string[];
};

export function NotaDaIa({ fontes = [] }: NotaDaIaProps) {
  const texto =
    fontes.length > 0
      ? `Orientação gerada por IA com base em: ${fontes.join(', ')}. Na dúvida, não consuma.`
      : 'Orientação gerada por IA. Na dúvida, não consuma.';

  return (
    <View style={styles.nota}>
      <Ionicons
        name="sparkles-outline"
        size={16}
        color={cores.secundariaEscura}
        style={styles.icone}
      />
      <Text style={styles.texto}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  nota: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: espacos.xs + 2,
    padding: espacos.sm,
    borderRadius: raios.sm,
    backgroundColor: cores.secundariaClara,
  },
  icone: {
    marginTop: 1,
  },
  texto: {
    flex: 1,
    fontFamily: tipos.semibold,
    fontSize: tamanhos.legenda,
    color: cores.secundariaEscura,
  },
});
