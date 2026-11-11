import { ListaVazia, Tela } from '@/components';

export default function DoacoesDisponiveis() {
  return (
    <Tela bordas={['left', 'right']}>
      <ListaVazia
        titulo="Doações disponíveis aparecem aqui"
        mensagem="Padarias, feiras e mercados publicam o que sobrou do dia."
      />
    </Tela>
  );
}
