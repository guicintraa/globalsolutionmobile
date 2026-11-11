import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Botao,
  CardDoacao,
  Carregando,
  FiltroDeOpcoes,
  ListaVazia,
  MensagemErro,
  Tela,
} from '@/components';
import { useAuth } from '@/contexts/AuthContext';
import { useAtualizarAoVoltar } from '@/hooks/useAtualizarAoVoltar';
import { useListaPaginada } from '@/hooks/useListaPaginada';
import { useRequisicao } from '@/hooks/useRequisicao';
import { categoriaService } from '@/services/categoriaService';
import { doacaoService } from '@/services/doacaoService';
import { cores, espacos, fontes, tamanhos } from '@/theme';
import { mensagemDoErro } from '@/utils/mensagensErro';

const TAMANHO_DA_PAGINA = 10;

export default function DoacoesDisponiveis() {
  const { usuario } = useAuth();
  const cidadeDoUsuario = usuario?.cidade ?? null;

  const [todasAsCidades, setTodasAsCidades] = useState(false);
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const cidade = todasAsCidades ? null : cidadeDoUsuario;

  const categorias = useRequisicao(categoriaService.listar);
  const opcoesDeCategoria = (categorias.dados ?? []).map((categoria) => ({
    valor: categoria.id,
    rotulo: categoria.nome,
  }));

  const buscarPagina = useCallback(
    (pagina: number) =>
      doacaoService.listarDisponiveis({
        cidade: cidade ?? undefined,
        categoriaId: categoriaId ?? undefined,
        page: pagina,
        size: TAMANHO_DA_PAGINA,
      }),
    [cidade, categoriaId]
  );
  const lista = useListaPaginada(buscarPagina);
  useAtualizarAoVoltar(lista.recarregar);

  const filtrando = cidade !== null || categoriaId !== null;

  function recarregarCategoriasComErro() {
    if (categorias.erro) {
      categorias.recarregar();
    }
  }

  function atualizar() {
    recarregarCategoriasComErro();
    lista.recarregar();
  }

  function tentarNovamente() {
    recarregarCategoriasComErro();
    lista.tentarNovamente();
  }

  function limparFiltros() {
    setTodasAsCidades(true);
    setCategoriaId(null);
  }

  function abrirDoacao(id: number) {
    router.push({ pathname: '/doacao/[id]', params: { id: String(id) } });
  }

  function renderizarVazio() {
    if (lista.carregando) {
      return <Carregando mensagem="Buscando doações..." />;
    }
    if (lista.erro) {
      return (
        <MensagemErro
          mensagem={mensagemDoErro(lista.erro)}
          aoTentarNovamente={tentarNovamente}
        />
      );
    }
    return (
      <ListaVazia
        titulo="Nenhuma doação disponível agora"
        mensagem={
          filtrando
            ? 'Tente ver todas as cidades e categorias, ou puxe a lista para atualizar.'
            : 'Padarias, feiras e mercados publicam o que sobrou do dia. Puxe a lista para atualizar.'
        }
        textoDaAcao={filtrando ? 'Limpar filtros' : undefined}
        aoAcionar={filtrando ? limparFiltros : undefined}
      />
    );
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
    <Tela bordas={['left', 'right']} estilo={styles.tela}>
      <View style={styles.filtros}>
        <View style={styles.local}>
          <Ionicons name="location-outline" size={18} color={cores.primaria} />
          <Text style={styles.cidade} numberOfLines={1}>
            {cidade ?? 'Todas as cidades'}
          </Text>
          {cidadeDoUsuario ? (
            <Pressable
              onPress={() => setTodasAsCidades((atual) => !atual)}
              accessibilityRole="button"
              hitSlop={8}
            >
              <Text style={styles.link}>
                {todasAsCidades
                  ? `Só em ${cidadeDoUsuario}`
                  : 'Ver todas as cidades'}
              </Text>
            </Pressable>
          ) : null}
        </View>

        {opcoesDeCategoria.length > 0 ? (
          <FiltroDeOpcoes
            rotulo="Filtrar por categoria"
            opcoes={opcoesDeCategoria}
            valor={categoriaId}
            aoSelecionar={setCategoriaId}
          />
        ) : null}
      </View>

      <FlatList
        data={lista.itens}
        keyExtractor={(doacao) => String(doacao.id)}
        renderItem={({ item }) => (
          <CardDoacao doacao={item} onPress={() => abrirDoacao(item.id)} />
        )}
        contentContainerStyle={styles.lista}
        onEndReached={lista.carregarMais}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={lista.atualizando}
            onRefresh={atualizar}
            colors={[cores.primaria]}
            tintColor={cores.primaria}
          />
        }
        ListEmptyComponent={renderizarVazio()}
        ListFooterComponent={renderizarRodape()}
      />
    </Tela>
  );
}

const styles = StyleSheet.create({
  tela: {
    padding: 0,
  },
  filtros: {
    gap: espacos.sm + 4,
    paddingTop: espacos.md,
    paddingBottom: espacos.sm,
  },
  local: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacos.xs,
    paddingHorizontal: espacos.lg,
  },
  cidade: {
    flex: 1,
    fontFamily: fontes.negrito,
    fontSize: tamanhos.corpo,
    color: cores.texto,
  },
  link: {
    fontFamily: fontes.negrito,
    fontSize: tamanhos.legenda + 1,
    color: cores.primaria,
  },
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
