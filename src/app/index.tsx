import { Image, StyleSheet, Text } from 'react-native';

import { Botao, Tela } from '@/components';
import { useAuth } from '@/contexts/AuthContext';
import { cores, espacos, fontes, tamanhos } from '@/theme';
import { rotulosDoPapel } from '@/utils/rotulos';

export default function Inicio() {
  const { usuario, sair } = useAuth();

  if (!usuario) {
    return null;
  }

  return (
    <Tela estilo={styles.conteudo}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={styles.logo}
      />
      <Text style={styles.titulo} accessibilityRole="header">
        Olá, {usuario.nome}!
      </Text>
      <Text style={styles.subtitulo}>
        Você entrou como {rotulosDoPapel[usuario.papel].toLowerCase()}.
      </Text>
      <Botao
        titulo="Sair"
        variante="secundario"
        onPress={sair}
        estilo={styles.botao}
      />
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
    textAlign: 'center',
    color: cores.texto,
  },
  subtitulo: {
    marginTop: espacos.sm,
    fontFamily: fontes.regular,
    fontSize: tamanhos.corpo,
    textAlign: 'center',
    color: cores.textoSecundario,
  },
  botao: {
    marginTop: espacos.xl,
    alignSelf: 'stretch',
  },
});
