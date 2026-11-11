import { Pressable, StyleSheet, Text, View } from 'react-native';

import { cores, espacos, fontes, raios, tamanhos } from '@/theme';

export type Opcao<T extends string | number> = {
  valor: T;
  rotulo: string;
  descricao?: string;
};

type SeletorDeOpcoesProps<T extends string | number> = {
  rotulo: string;
  opcoes: Opcao<T>[];
  valor: T | null;
  aoSelecionar: (valor: T) => void;
  erro?: string;
};

export function SeletorDeOpcoes<T extends string | number>({
  rotulo,
  opcoes,
  valor,
  aoSelecionar,
  erro,
}: SeletorDeOpcoesProps<T>) {
  return (
    <View style={styles.container}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <View style={styles.opcoes} accessibilityRole="radiogroup">
        {opcoes.map((opcao) => {
          const selecionada = opcao.valor === valor;

          return (
            <Pressable
              key={opcao.valor}
              onPress={() => aoSelecionar(opcao.valor)}
              accessibilityRole="radio"
              accessibilityState={{ checked: selecionada }}
              accessibilityLabel={
                opcao.descricao
                  ? `${opcao.rotulo}, ${opcao.descricao}`
                  : opcao.rotulo
              }
              style={[styles.opcao, selecionada && styles.opcaoSelecionada]}
            >
              <Text
                style={[styles.texto, selecionada && styles.textoSelecionado]}
              >
                {opcao.rotulo}
              </Text>
              {opcao.descricao ? (
                <Text
                  style={[
                    styles.descricao,
                    selecionada && styles.descricaoSelecionada,
                  ]}
                >
                  {opcao.descricao}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>
      {erro ? (
        <Text style={styles.erro} accessibilityLiveRegion="polite">
          {erro}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: espacos.md,
  },
  rotulo: {
    marginBottom: espacos.xs,
    fontFamily: fontes.semibold,
    fontSize: tamanhos.legenda + 1,
    color: cores.texto,
  },
  opcoes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espacos.sm,
  },
  opcao: {
    flexGrow: 1,
    minWidth: '30%',
    paddingVertical: espacos.sm + 2,
    paddingHorizontal: espacos.md,
    borderRadius: raios.md,
    borderWidth: 1.5,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
  },
  opcaoSelecionada: {
    borderColor: cores.primaria,
    backgroundColor: cores.primariaClara,
  },
  texto: {
    fontFamily: fontes.negrito,
    fontSize: tamanhos.corpo,
    color: cores.texto,
  },
  textoSelecionado: {
    color: cores.primaria,
  },
  descricao: {
    marginTop: 2,
    fontFamily: fontes.regular,
    fontSize: tamanhos.legenda,
    color: cores.textoSecundario,
  },
  descricaoSelecionada: {
    color: cores.primariaEscura,
  },
  erro: {
    marginTop: espacos.xs,
    fontFamily: fontes.semibold,
    fontSize: tamanhos.legenda,
    color: cores.erro,
  },
});
