import { router } from 'expo-router';

import { ListaVazia, Tela } from '@/components';

export default function MinhasDoacoes() {
  return (
    <Tela bordas={['left', 'right']}>
      <ListaVazia
        titulo="Suas doações aparecem aqui"
        mensagem="Publique o que sobrou do dia na aba Nova doação."
        textoDaAcao="Publicar doação"
        aoAcionar={() => router.navigate('/nova-doacao')}
      />
    </Tela>
  );
}
