import { Tabs } from 'expo-router';

import { Abas, IconeDaAba } from '@/components';

export default function AbasDoDoador() {
  return (
    <Abas>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Minhas doações',
          tabBarIcon: ({ color, size }) => (
            <IconeDaAba nome="basket-outline" cor={color} tamanho={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="nova-doacao"
        options={{
          title: 'Nova doação',
          tabBarIcon: ({ color, size }) => (
            <IconeDaAba nome="add-circle-outline" cor={color} tamanho={size} />
          ),
        }}
      />
    </Abas>
  );
}
