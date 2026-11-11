import { Stack } from 'expo-router';

import { cabecalho, cores } from '@/theme';

export default function LayoutDoDoador() {
  return (
    <Stack
      screenOptions={{
        ...cabecalho,
        contentStyle: { backgroundColor: cores.fundo },
      }}
    >
      <Stack.Screen name="(abas)" options={{ headerShown: false }} />
    </Stack>
  );
}
