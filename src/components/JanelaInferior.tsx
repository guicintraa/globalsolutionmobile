import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cores, espacos, fontes, raios, tamanhos } from '@/theme';

type JanelaInferiorProps = {
  visivel: boolean;
  titulo: string;
  aoFechar: () => void;
  children: ReactNode;
};

export function JanelaInferior({
  visivel,
  titulo,
  aoFechar,
  children,
}: JanelaInferiorProps) {
  const { bottom } = useSafeAreaInsets();

  return (
    <Modal
      visible={visivel}
      transparent
      animationType="fade"
      onRequestClose={aoFechar}
    >
      <KeyboardAvoidingView behavior="padding" style={styles.fundo}>
        <Pressable
          style={styles.areaDeFechar}
          onPress={aoFechar}
          accessibilityRole="button"
          accessibilityLabel="Fechar"
        />
        <View style={[styles.janela, { paddingBottom: espacos.lg + bottom }]}>
          <Text style={styles.titulo} accessibilityRole="header">
            {titulo}
          </Text>
          {children}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  areaDeFechar: {
    flex: 1,
  },
  janela: {
    gap: espacos.sm,
    padding: espacos.lg,
    borderTopLeftRadius: raios.lg,
    borderTopRightRadius: raios.lg,
    backgroundColor: cores.superficie,
  },
  titulo: {
    marginBottom: espacos.xs,
    fontFamily: fontes.extraNegrito,
    fontSize: tamanhos.subtitulo,
    color: cores.texto,
  },
});
