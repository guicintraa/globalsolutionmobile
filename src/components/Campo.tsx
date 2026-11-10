import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import type { TextInputProps } from 'react-native';

import { cores, espacos, fontes, raios, tamanhos } from '@/theme';

type CampoProps = TextInputProps & {
  rotulo: string;
  erro?: string;
};

export function Campo({
  rotulo,
  erro,
  onFocus,
  onBlur,
  style,
  ...props
}: CampoProps) {
  const [focado, setFocado] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <TextInput
        {...props}
        accessibilityLabel={rotulo}
        placeholderTextColor={cores.textoSecundario}
        onFocus={(evento) => {
          setFocado(true);
          onFocus?.(evento);
        }}
        onBlur={(evento) => {
          setFocado(false);
          onBlur?.(evento);
        }}
        style={[
          styles.entrada,
          focado && styles.entradaFocada,
          !!erro && styles.entradaComErro,
          style,
        ]}
      />
      {erro ? (
        <Text style={styles.erro} accessibilityLiveRegion="polite">
          {erro}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: espacos.md,
  },
  rotulo: {
    marginBottom: espacos.xs,
    fontFamily: fontes.semibold,
    fontSize: tamanhos.legenda + 1,
    color: cores.texto,
  },
  entrada: {
    minHeight: 52,
    paddingHorizontal: espacos.md,
    borderRadius: raios.md,
    borderWidth: 1.5,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
    fontFamily: fontes.regular,
    fontSize: tamanhos.corpo,
    color: cores.texto,
  },
  entradaFocada: {
    borderColor: cores.primaria,
  },
  entradaComErro: {
    borderColor: cores.erro,
  },
  erro: {
    marginTop: espacos.xs,
    fontFamily: fontes.semibold,
    fontSize: tamanhos.legenda,
    color: cores.erro,
  },
});
