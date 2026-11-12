import { StyleSheet, Text, View } from 'react-native';

import { cores, espacos, fontes, raios, tamanhos } from '@/theme';

type CodigoDeRetiradaProps = {
  codigo: string;
};

export function CodigoDeRetirada({ codigo }: CodigoDeRetiradaProps) {
  return (
    <View
      style={styles.caixa}
      accessible
      accessibilityLabel={`Código de retirada: ${codigo.split('').join(' ')}`}
    >
      <Text style={styles.rotulo}>Código de retirada</Text>
      <Text style={styles.codigo} selectable>
        {codigo}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: {
    alignItems: 'center',
    paddingVertical: espacos.md,
    paddingHorizontal: espacos.lg,
    borderRadius: raios.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: cores.primaria,
    backgroundColor: cores.superficie,
  },
  rotulo: {
    fontFamily: fontes.semibold,
    fontSize: tamanhos.legenda,
    color: cores.textoSecundario,
  },
  codigo: {
    marginTop: espacos.xs,
    fontFamily: fontes.extraNegrito,
    fontSize: tamanhos.destaque,
    letterSpacing: 6,
    color: cores.primariaEscura,
  },
});
