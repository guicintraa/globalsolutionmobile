import { Stack } from 'expo-router';

import { cabecalho, cores } from '@/theme';

export default function LayoutDoReceptor() {
  return (
    <Stack
      screenOptions={{
        ...cabecalho,
        headerBackButtonDisplayMode: 'minimal',
        contentStyle: { backgroundColor: cores.fundo },
      }}
    >
      <Stack.Screen name="(abas)" options={{ headerShown: false }} />
      <Stack.Screen
        name="doacao/[id]"
        options={{ title: 'Detalhes da doação' }}
      />
    </Stack>
  );
}
