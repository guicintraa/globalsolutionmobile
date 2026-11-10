import { StyleSheet, Text, View } from 'react-native';

import { cores, espacos, fontes, tamanhos } from '@/theme';

import { Botao } from './Botao';

type ListaVaziaProps = {
  titulo: string;
  mensagem?: string;
  textoDaAcao?: string;
  aoAcionar?: () => void;
};

export function ListaVazia({
  titulo,
  mensagem,
  textoDaAcao,
  aoAcionar,
}: ListaVaziaProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{titulo}</Text>
      {mensagem ? <Text style={styles.mensagem}>{mensagem}</Text> : null}
      {textoDaAcao && aoAcionar ? (
        <Botao titulo={textoDaAcao} onPress={aoAcionar} estilo={styles.botao} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: espacos.xl,
    paddingHorizontal: espacos.lg,
  },
  titulo: {
    fontFamily: fontes.negrito,
    fontSize: tamanhos.subtitulo,
    textAlign: 'center',
    color: cores.texto,
  },
  mensagem: {
    marginTop: espacos.sm,
    fontFamily: fontes.regular,
    fontSize: tamanhos.corpo,
    textAlign: 'center',
    color: cores.textoSecundario,
  },
  botao: {
    marginTop: espacos.lg,
    alignSelf: 'stretch',
  },
});
