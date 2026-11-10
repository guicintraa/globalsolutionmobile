import { Image, StyleSheet, Text, View } from 'react-native';

import { cores, espacos, fontes, tamanhos } from '@/theme';

export default function Inicio() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
      />
      <Text style={styles.titulo}>Doação de alimentos</Text>
      <Text style={styles.subtitulo}>
        Sobras do dia de padarias e feiras para ONGs e famílias
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: espacos.lg,
    backgroundColor: cores.fundo,
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
