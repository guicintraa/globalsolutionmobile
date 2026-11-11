import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { arquivosDeFonte, cores } from '@/theme';

SplashScreen.preventAutoHideAsync();

function Navegacao() {
  const { usuario } = useAuth();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: cores.fundo },
      }}
    >
      <Stack.Protected guard={!usuario}>
        <Stack.Screen name="login" />
        <Stack.Screen name="cadastro" />
      </Stack.Protected>
      <Stack.Protected guard={!!usuario}>
        <Stack.Screen name="index" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const [fontesCarregadas, erroNasFontes] = useFonts(arquivosDeFonte);
  const pronto = fontesCarregadas || erroNasFontes !== null;

  useEffect(() => {
    if (pronto) {
      SplashScreen.hideAsync();
    }
  }, [pronto]);

  if (!pronto) {
    return null;
  }

  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Navegacao />
    </AuthProvider>
  );
}
