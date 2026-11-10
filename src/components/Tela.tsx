import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Edge } from 'react-native-safe-area-context';

import { cores, espacos } from '@/theme';

type TelaProps = {
  children: ReactNode;
  rolavel?: boolean;
  bordas?: Edge[];
  estilo?: StyleProp<ViewStyle>;
};

export function Tela({
  children,
  rolavel = false,
  bordas = ['top', 'right', 'bottom', 'left'],
  estilo,
}: TelaProps) {
  return (
    <SafeAreaView style={styles.area} edges={bordas}>
      <KeyboardAvoidingView style={styles.area} behavior="padding">
        {rolavel ? (
          <ScrollView
            contentContainerStyle={[styles.conteudo, estilo]}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.area, styles.conteudo, estilo]}>{children}</View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  conteudo: {
    flexGrow: 1,
    padding: espacos.lg,
  },
});
