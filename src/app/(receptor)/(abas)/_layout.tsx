import { Tabs } from 'expo-router';

import { Abas, IconeDaAba } from '@/components';

export default function AbasDoReceptor() {
  return (
    <Abas>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Disponíveis',
          tabBarIcon: ({ color, size }) => (
            <IconeDaAba nome="storefront-outline" cor={color} tamanho={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="reservas"
        options={{
          title: 'Minhas reservas',
          tabBarIcon: ({ color, size }) => (
            <IconeDaAba nome="ticket-outline" cor={color} tamanho={size} />
          ),
        }}
      />
    </Abas>
  );
}
