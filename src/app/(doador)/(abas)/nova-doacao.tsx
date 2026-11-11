import { ListaVazia, Tela } from '@/components';

export default function NovaDoacao() {
  return (
    <Tela bordas={['left', 'right']}>
      <ListaVazia
        titulo="Publique uma doação"
        mensagem="Informe o alimento, a quantidade e até que horas ele pode ser retirado."
      />
    </Tela>
  );
}
