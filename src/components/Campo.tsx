import { useState } from 'react';
import type { Ref } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { TextInputInstance, TextInputProps } from 'react-native';

import { cores, espacos, fontes, raios, tamanhos } from '@/theme';

type CampoProps = TextInputProps & {
  rotulo: string;
  erro?: string;
  ref?: Ref<TextInputInstance>;
};

export function Campo({
  rotulo,
  erro,
  ref,
  secureTextEntry = false,
  multiline = false,
  onFocus,
  onBlur,
  style,
  ...props
}: CampoProps) {
  const [focado, setFocado] = useState(false);
  const [oculto, setOculto] = useState(secureTextEntry);

  return (
    <View style={styles.container}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <View
        style={[
          styles.caixa,
          multiline && styles.caixaMultilinha,
          focado && styles.caixaFocada,
          !!erro && styles.caixaComErro,
        ]}
      >
        <TextInput
          {...props}
          ref={ref}
          multiline={multiline}
          secureTextEntry={oculto}
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
          style={[styles.entrada, multiline && styles.entradaMultilinha, style]}
        />
        {secureTextEntry ? (
          <Pressable
            onPress={() => setOculto((atual) => !atual)}
            accessibilityRole="button"
            accessibilityLabel={oculto ? 'Mostrar senha' : 'Ocultar senha'}
            hitSlop={8}
            style={styles.alternar}
          >
            <Text style={styles.textoAlternar}>
              {oculto ? 'Mostrar' : 'Ocultar'}
            </Text>
          </Pressable>
        ) : null}
      </View>
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
  caixa: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    borderRadius: raios.md,
    borderWidth: 1.5,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
  },
  caixaMultilinha: {
    alignItems: 'flex-start',
  },
  caixaFocada: {
    borderColor: cores.primaria,
  },
  caixaComErro: {
    borderColor: cores.erro,
  },
  entrada: {
    flex: 1,
    minHeight: 50,
    paddingHorizontal: espacos.md,
    fontFamily: fontes.regular,
    fontSize: tamanhos.corpo,
    color: cores.texto,
  },
  entradaMultilinha: {
    minHeight: 110,
    paddingTop: espacos.md,
    paddingBottom: espacos.md,
    textAlignVertical: 'top',
  },
  alternar: {
    paddingHorizontal: espacos.md,
    paddingVertical: espacos.sm,
  },
  textoAlternar: {
    fontFamily: fontes.negrito,
    fontSize: tamanhos.legenda,
    color: cores.primaria,
  },
  erro: {
    marginTop: espacos.xs,
    fontFamily: fontes.semibold,
    fontSize: tamanhos.legenda,
    color: cores.erro,
  },
});
