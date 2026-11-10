import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { cores, espacos, raios } from '@/theme';

type CartaoProps = {
  children: ReactNode;
  onPress?: () => void;
  rotuloAcessivel?: string;
  estilo?: StyleProp<ViewStyle>;
};

export function Cartao({
  children,
  onPress,
  rotuloAcessivel,
  estilo,
}: CartaoProps) {
  if (!onPress) {
    return <View style={[styles.cartao, estilo]}>{children}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={rotuloAcessivel}
      style={({ pressed }) => [
        styles.cartao,
        pressed && styles.pressionado,
        estilo,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cartao: {
    padding: espacos.md,
    borderRadius: raios.lg,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
  },
  pressionado: {
    backgroundColor: cores.primariaClara,
  },
});
