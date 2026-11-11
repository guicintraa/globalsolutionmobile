import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { cores, espacos, raios } from '@/theme';

export type NomeDoIcone = ComponentProps<typeof Ionicons>['name'];

type BotaoDeIconeProps = {
  icone: NomeDoIcone;
  rotulo: string;
  onPress: () => void;
  cor?: string;
};

export function BotaoDeIcone({
  icone,
  rotulo,
  onPress,
  cor = cores.primaria,
}: BotaoDeIconeProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      hitSlop={8}
      style={({ pressed }) => [styles.botao, pressed && styles.pressionado]}
    >
      <Ionicons name={icone} size={24} color={cor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    padding: espacos.sm,
    marginHorizontal: espacos.xs,
    borderRadius: raios.total,
  },
  pressionado: {
    backgroundColor: cores.primariaClara,
  },
});
