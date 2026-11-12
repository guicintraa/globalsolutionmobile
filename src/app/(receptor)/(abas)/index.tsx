import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  CardDoacao,
  FiltroDeOpcoes,
  ListaPaginada,
  ListaVazia,
  Tela,
} from '@/components';
import { useAuth } from '@/contexts/AuthContext';
import { useAtualizarAoVoltar } from '@/hooks/useAtualizarAoVoltar';
import { useListaPaginada } from '@/hooks/useListaPaginada';
import { useRequisicao } from '@/hooks/useRequisicao';
import { categoriaService } from '@/services/categoriaService';
import { doacaoService } from '@/services/doacaoService';
import { cores, espacos, fontes, tamanhos } from '@/theme';

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

      <ListaPaginada
        lista={lista}
        renderizarItem={(doacao) => (
          <CardDoacao doacao={doacao} onPress={() => abrirDoacao(doacao.id)} />
        )}
        vazio={
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
        }
        mensagemDeCarregamento="Buscando doações..."
        aoAtualizar={atualizar}
        aoTentarNovamente={tentarNovamente}
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
});
