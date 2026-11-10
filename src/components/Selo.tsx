import { StyleSheet, Text, View } from 'react-native';

import { cores, espacos, fontes, raios, tamanhos } from '@/theme';

export type TomDoSelo = 'sucesso' | 'aviso' | 'erro' | 'neutro' | 'destaque';

type SeloProps = {
  texto: string;
  tom?: TomDoSelo;
};

const paletas = {
  sucesso: { fundo: cores.primariaClara, texto: cores.primaria },
  aviso: { fundo: cores.avisoClaro, texto: cores.aviso },
  erro: { fundo: cores.erroClaro, texto: cores.erro },
  neutro: { fundo: cores.borda, texto: cores.texto },
  destaque: { fundo: cores.secundariaClara, texto: cores.secundariaEscura },
} as const;

export function Selo({ texto, tom = 'neutro' }: SeloProps) {
  const paleta = paletas[tom];

  return (
    <View style={[styles.selo, { backgroundColor: paleta.fundo }]}>
      <Text style={[styles.texto, { color: paleta.texto }]}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  selo: {
    alignSelf: 'flex-start',
    paddingHorizontal: espacos.sm + 2,
    paddingVertical: espacos.xs,
    borderRadius: raios.total,
  },
  texto: {
    fontFamily: fontes.negrito,
    fontSize: tamanhos.legenda,
  },
});
