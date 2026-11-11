import { ListaVazia, Tela } from '@/components';

export default function MinhasReservas() {
  return (
    <Tela bordas={['left', 'right']}>
      <ListaVazia
        titulo="Suas reservas aparecem aqui"
        mensagem="Depois de reservar, o código de retirada fica nesta aba."
      />
    </Tela>
  );
}
