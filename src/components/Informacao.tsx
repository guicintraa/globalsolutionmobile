import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { cores, espacos, fontes, tamanhos } from '@/theme';

import type { NomeDoIcone } from './BotaoDeIcone';

type InformacaoProps = {
  icone: NomeDoIcone;
  rotulo: string;
  valor: string;
};

export function Informacao({ icone, rotulo, valor }: InformacaoProps) {
  return (
    <View
      style={styles.linha}
      accessible
      accessibilityLabel={`${rotulo}: ${valor}`}
    >
      <Ionicons
        name={icone}
        size={20}
        color={cores.primaria}
        style={styles.icone}
      />
      <View style={styles.textos}>
        <Text style={styles.rotulo}>{rotulo}</Text>
        <Text style={styles.valor}>{valor}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    gap: espacos.sm + 4,
  },
  icone: {
    marginTop: 2,
  },
  textos: {
    flex: 1,
  },
  rotulo: {
    fontFamily: fontes.semibold,
    fontSize: tamanhos.legenda,
    color: cores.textoSecundario,
  },
  valor: {
    marginTop: 2,
    fontFamily: fontes.negrito,
    fontSize: tamanhos.corpo,
    color: cores.texto,
  },
});
