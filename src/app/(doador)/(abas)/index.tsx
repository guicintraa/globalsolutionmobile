import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import {
  Botao,
  CardDoacao,
  FiltroDeOpcoes,
  ListaPaginada,
  ListaVazia,
  Tela,
} from '@/components';
import type { Opcao } from '@/components';
import { useAtualizarAoVoltar } from '@/hooks/useAtualizarAoVoltar';
import { useListaPaginada } from '@/hooks/useListaPaginada';
import { ApiError } from '@/services/api';
import type { CodigoDoErro } from '@/services/api';
import { doacaoService } from '@/services/doacaoService';
import { espacos } from '@/theme';
import type { DoacaoResponse, StatusDoacao } from '@/types/api';
import { mensagemDoErro } from '@/utils/mensagensErro';
import { podeAlterarDoacao } from '@/utils/regras';

const TAMANHO_DA_PAGINA = 10;

const ERROS_QUE_MUDAM_A_DOACAO: CodigoDoErro[] = [
  'ESTADO_INVALIDO',
  'NAO_ENCONTRADO',
];

const opcoesDeSituacao: Opcao<StatusDoacao>[] = [
  { valor: 'ATIVA', rotulo: 'Disponíveis' },
  { valor: 'ESGOTADA', rotulo: 'Esgotadas' },
  { valor: 'EXPIRADA', rotulo: 'Expiradas' },
  { valor: 'CANCELADA', rotulo: 'Canceladas' },
];

export default function MinhasDoacoes() {
  const [situacao, setSituacao] = useState<StatusDoacao | null>(null);
  const [ocupadaId, setOcupadaId] = useState<number | null>(null);

  const buscarPagina = useCallback(
    (pagina: number) =>
      doacaoService.listarMinhas({
        status: situacao ?? undefined,
        sort: 'criadoEm,desc',
        page: pagina,
        size: TAMANHO_DA_PAGINA,
      }),
    [situacao]
  );
  const lista = useListaPaginada(buscarPagina);
  useAtualizarAoVoltar(lista.recarregar);

  function tratarErro(titulo: string, erro: unknown) {
    Alert.alert(titulo, mensagemDoErro(erro));
    if (
      erro instanceof ApiError &&
      ERROS_QUE_MUDAM_A_DOACAO.includes(erro.codigo)
    ) {
      lista.recarregar();
    }
  }

  function editar(doacao: DoacaoResponse) {
    router.push({
      pathname: '/doacao/[id]/editar',
      params: { id: String(doacao.id) },
    });
  }

  async function cancelar(doacao: DoacaoResponse) {
    setOcupadaId(doacao.id);
    try {
      const cancelada = await doacaoService.cancelar(doacao.id);
      lista.substituirItem(cancelada);
    } catch (erro) {
      tratarErro('Não foi possível cancelar', erro);
    } finally {
      setOcupadaId(null);
    }
  }

  function oferecerCancelamento(doacao: DoacaoResponse, erro: unknown) {
    if (!podeAlterarDoacao(doacao.status)) {
      Alert.alert(
        'Não é possível excluir',
        'Esta doação tem reservas registradas, então ela fica no seu histórico.'
      );
      return;
    }
    Alert.alert(
      'Doação com reservas',
      `${mensagemDoErro(erro)} As reservas ativas também serão canceladas.`,
      [
        { text: 'Voltar', style: 'cancel' },
        {
          text: 'Cancelar doação',
          style: 'destructive',
          onPress: () => cancelar(doacao),
        },
      ]
    );
  }

  async function excluir(doacao: DoacaoResponse) {
    setOcupadaId(doacao.id);
    try {
      await doacaoService.excluir(doacao.id);
      lista.removerItem(doacao.id);
    } catch (erro) {
      if (erro instanceof ApiError && erro.codigo === 'REGISTRO_EM_USO') {
        oferecerCancelamento(doacao, erro);
      } else {
        tratarErro('Não foi possível excluir', erro);
      }
    } finally {
      setOcupadaId(null);
    }
  }

  function confirmarExclusao(doacao: DoacaoResponse) {
    Alert.alert(
      'Excluir doação',
      `Deseja excluir "${doacao.titulo}"? Essa ação não pode ser desfeita.`,
      [
        { text: 'Voltar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => excluir(doacao),
        },
      ]
    );
  }

  return (
    <Tela bordas={['left', 'right']} estilo={styles.tela}>
      <View style={styles.filtros}>
        <FiltroDeOpcoes
          rotulo="Filtrar por situação"
          opcoes={opcoesDeSituacao}
          valor={situacao}
          aoSelecionar={setSituacao}
        />
      </View>

      <ListaPaginada
        lista={lista}
        renderizarItem={(doacao) => (
          <CardDoacao
            doacao={doacao}
            mostrarStatus
            mostrarDoador={false}
            acoes={
              <>
                {podeAlterarDoacao(doacao.status) ? (
                  <Botao
                    titulo="Editar"
                    variante="secundario"
                    onPress={() => editar(doacao)}
                    estilo={styles.acao}
                  />
                ) : null}
                <Botao
                  titulo="Excluir"
                  variante="perigo"
                  onPress={() => confirmarExclusao(doacao)}
                  carregando={ocupadaId === doacao.id}
                  estilo={styles.acao}
                />
              </>
            }
          />
        )}
        vazio={
          situacao ? (
            <ListaVazia
              titulo="Nenhuma doação com essa situação"
              textoDaAcao="Ver todas"
              aoAcionar={() => setSituacao(null)}
            />
          ) : (
            <ListaVazia
              titulo="Você ainda não publicou doações"
              mensagem="Publique o que sobrou do dia e os receptores da sua cidade podem reservar."
              textoDaAcao="Publicar doação"
              aoAcionar={() => router.navigate('/nova-doacao')}
            />
          )
        }
        mensagemDeCarregamento="Buscando suas doações..."
      />
    </Tela>
  );
}

const styles = StyleSheet.create({
  tela: {
    padding: 0,
  },
  filtros: {
    paddingTop: espacos.md,
    paddingBottom: espacos.sm,
  },
  acao: {
    flex: 1,
    minHeight: 44,
    paddingHorizontal: espacos.sm,
  },
});
