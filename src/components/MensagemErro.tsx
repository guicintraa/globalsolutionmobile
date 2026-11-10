import { StyleSheet, Text, View } from 'react-native';

import { cores, espacos, fontes, tamanhos } from '@/theme';

import { Botao } from './Botao';

type MensagemErroProps = {
  mensagem: string;
  aoTentarNovamente?: () => void;
};

export function MensagemErro({
  mensagem,
  aoTentarNovamente,
}: MensagemErroProps) {
  return (
    <View style={styles.container} accessibilityRole="alert">
      <Text style={styles.titulo}>Algo deu errado</Text>
      <Text style={styles.mensagem}>{mensagem}</Text>
      {aoTentarNovamente ? (
        <Botao
          titulo="Tentar novamente"
          variante="secundario"
          onPress={aoTentarNovamente}
          estilo={styles.botao}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: espacos.lg,
  },
  titulo: {
    fontFamily: fontes.extraNegrito,
    fontSize: tamanhos.subtitulo,
    color: cores.erro,
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
