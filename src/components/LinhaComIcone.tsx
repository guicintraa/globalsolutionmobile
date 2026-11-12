import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { cores, espacos, fontes, tamanhos } from '@/theme';

import type { NomeDoIcone } from './BotaoDeIcone';

type LinhaComIconeProps = {
  icone: NomeDoIcone;
  texto: string;
  linhas?: number;
};

export function LinhaComIcone({
  icone,
  texto,
  linhas = 1,
}: LinhaComIconeProps) {
  const variasLinhas = linhas > 1;

  return (
    <View style={[styles.linha, variasLinhas && styles.linhaAlta]}>
      <Ionicons
        name={icone}
        size={16}
        color={cores.textoSecundario}
        style={variasLinhas ? styles.iconeNoTopo : undefined}
      />
      <Text style={styles.texto} numberOfLines={linhas}>
        {texto}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacos.xs + 2,
  },
  linhaAlta: {
    alignItems: 'flex-start',
  },
  iconeNoTopo: {
    marginTop: 2,
  },
  texto: {
    flex: 1,
    fontFamily: fontes.regular,
    fontSize: tamanhos.legenda + 1,
    color: cores.textoSecundario,
  },
});
