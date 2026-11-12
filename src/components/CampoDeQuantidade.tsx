import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { cores, espacos, fontes, raios, tamanhos } from '@/theme';

import type { NomeDoIcone } from './BotaoDeIcone';

type CampoDeQuantidadeProps = {
  rotulo: string;
  valor: string;
  aoAlterar: (valor: string) => void;
  maximo: number;
  unidade: string;
  dica?: string;
  erro?: string;
};

export function CampoDeQuantidade({
  rotulo,
  valor,
  aoAlterar,
  maximo,
  unidade,
  dica,
  erro,
}: CampoDeQuantidadeProps) {
  const [focado, setFocado] = useState(false);
  const numero = Number(valor) || 0;

  function somar(passo: number) {
    aoAlterar(String(Math.min(maximo, Math.max(1, numero + passo))));
  }

  return (
    <View>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <View style={styles.linha}>
        <BotaoDoPasso
          icone="remove"
          rotulo="Diminuir quantidade"
          desabilitado={numero <= 1}
          onPress={() => somar(-1)}
        />
        <TextInput
          value={valor}
          onChangeText={(texto) => aoAlterar(texto.replace(/\D/g, ''))}
          keyboardType="number-pad"
          maxLength={4}
          selectTextOnFocus
          accessibilityLabel={rotulo}
          accessibilityHint={dica}
          onFocus={() => setFocado(true)}
          onBlur={() => setFocado(false)}
          style={[
            styles.entrada,
            focado && styles.entradaFocada,
            !!erro && styles.entradaComErro,
          ]}
        />
        <BotaoDoPasso
          icone="add"
          rotulo="Aumentar quantidade"
          desabilitado={numero >= maximo}
          onPress={() => somar(1)}
        />
        <Text style={styles.unidade}>{unidade}</Text>
      </View>
      {erro ? (
        <Text style={styles.erro} accessibilityLiveRegion="polite">
          {erro}
        </Text>
      ) : dica ? (
        <Text style={styles.dica}>{dica}</Text>
      ) : null}
    </View>
  );
}

type BotaoDoPassoProps = {
  icone: NomeDoIcone;
  rotulo: string;
  desabilitado: boolean;
  onPress: () => void;
};

function BotaoDoPasso({
  icone,
  rotulo,
  desabilitado,
  onPress,
}: BotaoDoPassoProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={desabilitado}
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      accessibilityState={{ disabled: desabilitado }}
      hitSlop={4}
      style={({ pressed }) => [
        styles.passo,
        pressed && styles.passoPressionado,
        desabilitado && styles.passoDesabilitado,
      ]}
    >
      <Ionicons
        name={icone}
        size={22}
        color={desabilitado ? cores.textoSecundario : cores.primaria}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  rotulo: {
    marginBottom: espacos.xs,
    fontFamily: fontes.semibold,
    fontSize: tamanhos.legenda + 1,
    color: cores.texto,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacos.sm,
  },
  passo: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: raios.total,
    borderWidth: 1.5,
    borderColor: cores.primaria,
    backgroundColor: cores.superficie,
  },
  passoPressionado: {
    backgroundColor: cores.primariaClara,
  },
  passoDesabilitado: {
    borderColor: cores.borda,
    opacity: 0.6,
  },
  entrada: {
    width: 80,
    height: 48,
    borderRadius: raios.md,
    borderWidth: 1.5,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
    textAlign: 'center',
    fontFamily: fontes.negrito,
    fontSize: tamanhos.subtitulo,
    color: cores.texto,
  },
  entradaFocada: {
    borderColor: cores.primaria,
  },
  entradaComErro: {
    borderColor: cores.erro,
  },
  unidade: {
    flexShrink: 1,
    fontFamily: fontes.semibold,
    fontSize: tamanhos.corpo,
    color: cores.texto,
  },
  dica: {
    marginTop: espacos.xs,
    fontFamily: fontes.regular,
    fontSize: tamanhos.legenda,
    color: cores.textoSecundario,
  },
  erro: {
    marginTop: espacos.xs,
    fontFamily: fontes.semibold,
    fontSize: tamanhos.legenda,
    color: cores.erro,
  },
});
