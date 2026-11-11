import { Ionicons } from '@expo/vector-icons';
import type { ColorValue } from 'react-native';

import type { NomeDoIcone } from './BotaoDeIcone';

type IconeDaAbaProps = {
  nome: NomeDoIcone;
  cor: ColorValue;
  tamanho: number;
};

export function IconeDaAba({ nome, cor, tamanho }: IconeDaAbaProps) {
  return (
    <Ionicons
      name={nome}
      size={tamanho}
      color={typeof cor === 'string' ? cor : undefined}
    />
  );
}
