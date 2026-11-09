import { StyleSheet, Text, View } from 'react-native';

export default function Inicio() {
  return (
    <View style={styles.container}>
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
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  titulo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2A30',
  },
  subtitulo: {
    marginTop: 8,
    fontSize: 16,
    textAlign: 'center',
    color: '#5B6B73',
  },
});
