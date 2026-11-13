import { Stack } from 'expo-router';

import { cabecalho, cores } from '@/theme';

export default function LayoutDoDoador() {
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
        name="doacao/[id]/editar"
        options={{ title: 'Editar doação' }}
      />
      <Stack.Screen
        name="doacao/[id]/reservas"
        options={{ title: 'Reservas da doação' }}
      />
    </Stack>
  );
}
