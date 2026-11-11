import { Tabs } from 'expo-router';
import type { ReactNode } from 'react';
import { Alert } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import { cabecalho, cores, fontes } from '@/theme';

import { BotaoDeIcone } from './BotaoDeIcone';

export function Abas({ children }: { children: ReactNode }) {
  const { sair } = useAuth();

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
          <BotaoDeIcone
            icone="log-out-outline"
            rotulo="Sair da conta"
            onPress={confirmarSaida}
          />
        ),
        tabBarActiveTintColor: cores.primaria,
        tabBarInactiveTintColor: cores.textoSecundario,
        tabBarStyle: {
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
