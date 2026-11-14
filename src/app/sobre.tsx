import Constants from 'expo-constants';
import { Image, StyleSheet, Text, View } from 'react-native';

import { Cartao, Informacao, Tela } from '@/components';
import { cores, espacos, fontes, tamanhos } from '@/theme';

const passos = [
  'O comércio publica o que sobrou, quanto e até que horas pode ser retirado.',
  'ONGs e famílias veem as doações da cidade, reservam e recebem um código.',
  'Na retirada, o comércio confere o código e a doação fica registrada.',
];

function servidorDaApi() {
  const endereco = process.env.EXPO_PUBLIC_API_URL;
  if (!endereco) {
    return 'não configurado';
  }
  return endereco.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
}

export default function Sobre() {
  const versao = Constants.expoConfig?.version ?? 'indisponível';
  const commit = String(Constants.expoConfig?.extra?.commit ?? 'indisponível');

  return (
    <Tela rolavel bordas={['bottom', 'left', 'right']}>
      <View style={styles.cabecalho}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          accessibilityIgnoresInvertColors
        />
        <Text style={styles.titulo} accessibilityRole="header">
          SobraBem
        </Text>
        <Text style={styles.subtitulo}>
          Comida boa que sobrou no fim do dia vai para quem precisa, e não para
          o lixo.
        </Text>
      </View>

      <Text style={styles.secao} accessibilityRole="header">
        Como funciona
      </Text>
      <Cartao estilo={styles.cartao}>
        {passos.map((passo, indice) => (
          <View key={passo} style={styles.passo}>
            <Text style={styles.numero}>{indice + 1}</Text>
            <Text style={styles.textoDoPasso}>{passo}</Text>
          </View>
        ))}
      </Cartao>

      <Text style={styles.secao} accessibilityRole="header">
        Versão
      </Text>
      <Cartao estilo={styles.cartao}>
        <Informacao
          icone="pricetag-outline"
          rotulo="Versão do app"
          valor={versao}
        />
        <Informacao icone="git-commit-outline" rotulo="Commit" valor={commit} />
        <Informacao
          icone="server-outline"
          rotulo="Servidor da API"
          valor={servidorDaApi()}
        />
      </Cartao>

      <Text style={styles.rodape}>
        Global Solution 2026 · CitizenTech · FIAP
      </Text>
    </Tela>
  );
}

const styles = StyleSheet.create({
  cabecalho: {
    alignItems: 'center',
    marginBottom: espacos.sm,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: espacos.sm,
  },
  titulo: {
    fontFamily: fontes.extraNegrito,
    fontSize: tamanhos.destaque,
    color: cores.texto,
  },
  subtitulo: {
    marginTop: espacos.xs,
    fontFamily: fontes.regular,
    fontSize: tamanhos.corpo,
    lineHeight: 22,
    textAlign: 'center',
    color: cores.textoSecundario,
  },
  secao: {
    marginTop: espacos.lg,
    marginBottom: espacos.sm,
    fontFamily: fontes.extraNegrito,
    fontSize: tamanhos.subtitulo,
    color: cores.texto,
  },
  cartao: {
    gap: espacos.md,
  },
  passo: {
    flexDirection: 'row',
    gap: espacos.sm + 4,
  },
  numero: {
    width: 26,
    height: 26,
    borderRadius: 13,
    overflow: 'hidden',
    textAlign: 'center',
    lineHeight: 26,
    fontFamily: fontes.negrito,
    fontSize: tamanhos.legenda + 1,
    color: cores.primaria,
    backgroundColor: cores.primariaClara,
  },
  textoDoPasso: {
    flex: 1,
    fontFamily: fontes.regular,
    fontSize: tamanhos.corpo,
    lineHeight: 22,
    color: cores.texto,
  },
  rodape: {
    marginTop: espacos.xl,
    fontFamily: fontes.semibold,
    fontSize: tamanhos.legenda,
    textAlign: 'center',
    color: cores.textoSecundario,
  },
});
