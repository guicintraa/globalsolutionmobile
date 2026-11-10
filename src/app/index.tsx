import { Image, StyleSheet, Text } from 'react-native';

import { Tela } from '@/components';
import { cores, espacos, fontes, tamanhos } from '@/theme';

export default function Inicio() {
  return (
    <Tela estilo={styles.conteudo}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
      />
      <Text style={styles.titulo}>Doação de alimentos</Text>
      <Text style={styles.subtitulo}>
        Sobras do dia de padarias e feiras para ONGs e famílias
      </Text>
    </Tela>
  );
}

const styles = StyleSheet.create({
  conteudo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: espacos.lg,
  },
  titulo: {
    fontFamily: fontes.extraNegrito,
    fontSize: tamanhos.titulo,
    color: cores.texto,
  },
  subtitulo: {
    marginTop: espacos.sm,
    fontFamily: fontes.regular,
    fontSize: tamanhos.corpo,
    textAlign: 'center',
    color: cores.textoSecundario,
  },
});
