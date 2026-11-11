import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { arquivosDeFonte, cores } from '@/theme';

SplashScreen.preventAutoHideAsync();

function Navegacao() {
  const { usuario, restaurando } = useAuth();
  const papel = usuario?.papel;

  useEffect(() => {
    if (!restaurando) {
      SplashScreen.hideAsync();
    }
  }, [restaurando]);

  if (restaurando) {
    return null;
  }

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
      <Stack.Protected guard={papel === 'DOADOR'}>
        <Stack.Screen name="(doador)" />
      </Stack.Protected>
      <Stack.Protected guard={papel === 'RECEPTOR'}>
        <Stack.Screen name="(receptor)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const [fontesCarregadas, erroNasFontes] = useFonts(arquivosDeFonte);

  if (!fontesCarregadas && !erroNasFontes) {
    return null;
  }

  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Navegacao />
    </AuthProvider>
  );
}
