import type { ReactElement } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
} from 'react-native';

import type { EstadoDaLista } from '@/hooks/useListaPaginada';
import { cores, espacos } from '@/theme';
import { mensagemDoErro } from '@/utils/mensagensErro';

import { Botao } from './Botao';
import { Carregando } from './Carregando';
import { MensagemErro } from './MensagemErro';

type ListaPaginadaProps<T> = {
  lista: EstadoDaLista<T>;
  renderizarItem: (item: T) => ReactElement;
  vazio: ReactElement;
  mensagemDeCarregamento?: string;
  aoAtualizar?: () => void;
  aoTentarNovamente?: () => void;
};

export function ListaPaginada<T extends { id: number }>({
  lista,
  renderizarItem,
  vazio,
  mensagemDeCarregamento,
  aoAtualizar = lista.recarregar,
  aoTentarNovamente = lista.tentarNovamente,
}: ListaPaginadaProps<T>) {
  function renderizarVazio() {
    if (lista.carregando) {
      return <Carregando mensagem={mensagemDeCarregamento} />;
    }
    if (lista.erro) {
      return (
        <MensagemErro
          mensagem={mensagemDoErro(lista.erro)}
          aoTentarNovamente={aoTentarNovamente}
        />
      );
    }
    return vazio;
  }

  function renderizarRodape() {
    if (lista.carregandoMais) {
      return <ActivityIndicator color={cores.primaria} style={styles.rodape} />;
    }
    if (lista.erro && lista.itens.length > 0) {
      return (
        <Botao
          titulo="Tentar carregar mais"
          variante="secundario"
          onPress={lista.tentarNovamente}
          estilo={styles.rodape}
        />
      );
    }
    return undefined;
  }

  return (
    <FlatList
      data={lista.itens}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => renderizarItem(item)}
      contentContainerStyle={styles.lista}
      onEndReached={lista.carregarMais}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl
          refreshing={lista.atualizando}
          onRefresh={aoAtualizar}
          colors={[cores.primaria]}
          tintColor={cores.primaria}
        />
      }
      ListEmptyComponent={renderizarVazio()}
      ListFooterComponent={renderizarRodape()}
    />
  );
}

const styles = StyleSheet.create({
  lista: {
    flexGrow: 1,
    gap: espacos.md,
    paddingHorizontal: espacos.lg,
    paddingTop: espacos.sm,
    paddingBottom: espacos.lg,
  },
  rodape: {
    marginVertical: espacos.sm,
  },
});
