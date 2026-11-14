import { router, Tabs } from 'expo-router';
import type { ReactNode } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/contexts/AuthContext';
import { cabecalho, cores, fontes } from '@/theme';

import { BotaoDeIcone } from './BotaoDeIcone';

export function Abas({ children }: { children: ReactNode }) {
  const { sair } = useAuth();
  const { bottom } = useSafeAreaInsets();

  function confirmarSaida() {
    Alert.alert('Sair da conta', 'Deseja mesmo sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: sair },
    ]);
  }

  return (
    <Tabs
      screenOptions={{
        ...cabecalho,
        headerRight: () => (
          <View style={styles.acoes}>
            <BotaoDeIcone
              icone="information-circle-outline"
              rotulo="Sobre o App"
              onPress={() => router.push('/sobre')}
            />
            <BotaoDeIcone
              icone="log-out-outline"
              rotulo="Sair da conta"
              onPress={confirmarSaida}
            />
          </View>
        ),
        tabBarActiveTintColor: cores.primaria,
        tabBarInactiveTintColor: cores.textoSecundario,
        tabBarStyle: {
          height: 60 + bottom,
          backgroundColor: cores.superficie,
          borderTopColor: cores.borda,
        },
        tabBarLabelStyle: { fontFamily: fontes.semibold, fontSize: 12 },
        sceneStyle: { backgroundColor: cores.fundo },
      }}
    >
      {children}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  acoes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
