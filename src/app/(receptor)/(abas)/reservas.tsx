import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import {
  Botao,
  Cartao,
  CodigoDeRetirada,
  FiltroDeOpcoes,
  LinhaComIcone,
  ListaPaginada,
  ListaVazia,
  Selo,
  Tela,
} from '@/components';
import { useAtualizarAoVoltar } from '@/hooks/useAtualizarAoVoltar';
import { useListaPaginada } from '@/hooks/useListaPaginada';
import { ApiError } from '@/services/api';
import type { CodigoDoErro } from '@/services/api';
import { reservaService } from '@/services/reservaService';
import { cores, espacos, fontes, tamanhos } from '@/theme';
import type { ReservaResponse, StatusReserva } from '@/types/api';
import { formatarDataRelativa, prazoVencido } from '@/utils/datas';
import { formatarEndereco } from '@/utils/formatos';
import { abrirNoMapa } from '@/utils/links';
import { mensagemDoErro } from '@/utils/mensagensErro';
import {
  descreverQuantidade,
  opcoesDeSituacaoDaReserva,
  rotulosDoStatusDaReserva,
  tonsDoStatusDaReserva,
} from '@/utils/rotulos';

const TAMANHO_DA_PAGINA = 10;

const ERROS_QUE_MUDAM_A_RESERVA: CodigoDoErro[] = [
  'ESTADO_INVALIDO',
  'NAO_ENCONTRADO',
];

export default function MinhasReservas() {
  const [situacao, setSituacao] = useState<StatusReserva | null>(null);
  const [cancelandoId, setCancelandoId] = useState<number | null>(null);

  const buscarPagina = useCallback(
    (pagina: number) =>
      reservaService.listarMinhas({
        status: situacao ?? undefined,
        page: pagina,
        size: TAMANHO_DA_PAGINA,
      }),
    [situacao]
  );
  const lista = useListaPaginada(buscarPagina);
  useAtualizarAoVoltar(lista.recarregar);

  async function cancelar(reserva: ReservaResponse) {
    setCancelandoId(reserva.id);
    try {
      const cancelada = await reservaService.cancelar(reserva.id);
      lista.substituirItem(cancelada);
    } catch (erro) {
      Alert.alert('Não foi possível cancelar', mensagemDoErro(erro));
      if (
        erro instanceof ApiError &&
        ERROS_QUE_MUDAM_A_RESERVA.includes(erro.codigo)
      ) {
        lista.recarregar();
      }
    } finally {
      setCancelandoId(null);
    }
  }

  function confirmarCancelamento(reserva: ReservaResponse) {
    const quantidade = descreverQuantidade(
      reserva.quantidade,
      reserva.doacao.unidade
    );
    Alert.alert(
      'Cancelar reserva',
      `Deseja cancelar a reserva de ${quantidade} de ${reserva.doacao.titulo}?`,
      [
        { text: 'Voltar', style: 'cancel' },
        {
          text: 'Cancelar reserva',
          style: 'destructive',
          onPress: () => cancelar(reserva),
        },
      ]
    );
  }

  return (
    <Tela bordas={['left', 'right']} estilo={styles.tela}>
      <View style={styles.filtros}>
        <FiltroDeOpcoes
          rotulo="Filtrar por situação"
          opcoes={opcoesDeSituacaoDaReserva}
          valor={situacao}
          aoSelecionar={setSituacao}
        />
      </View>

      <ListaPaginada
        lista={lista}
        renderizarItem={(reserva) => (
          <CartaoDaReserva
            reserva={reserva}
            cancelando={cancelandoId === reserva.id}
            aoCancelar={() => confirmarCancelamento(reserva)}
          />
        )}
        vazio={
          situacao ? (
            <ListaVazia
              titulo="Nenhuma reserva com essa situação"
              textoDaAcao="Ver todas"
              aoAcionar={() => setSituacao(null)}
            />
          ) : (
            <ListaVazia
              titulo="Você ainda não tem reservas"
              mensagem="Escolha uma doação em Disponíveis. O código de retirada aparece aqui."
              textoDaAcao="Ver doações disponíveis"
              aoAcionar={() => router.navigate('/')}
            />
          )
        }
        mensagemDeCarregamento="Buscando suas reservas..."
      />
    </Tela>
  );
}

type CartaoDaReservaProps = {
  reserva: ReservaResponse;
  cancelando: boolean;
  aoCancelar: () => void;
};

function CartaoDaReserva({
  reserva,
  cancelando,
  aoCancelar,
}: CartaoDaReservaProps) {
  const { doacao } = reserva;
  const { doador } = doacao;
  const ativa = reserva.status === 'ATIVA';
  const endereco = formatarEndereco(doador.endereco, doador.cidade, doador.uf);

  return (
    <Cartao estilo={styles.cartao}>
      <View style={styles.topo}>
        <Selo
          texto={rotulosDoStatusDaReserva[reserva.status]}
          tom={tonsDoStatusDaReserva[reserva.status]}
        />
        <Text style={styles.data}>
          Reservada {formatarDataRelativa(reserva.criadoEm)}
        </Text>
      </View>

      <Text style={styles.titulo} numberOfLines={2}>
        {doacao.titulo}
      </Text>

      <View style={styles.linhas}>
        <LinhaComIcone
          icone="cube-outline"
          texto={descreverQuantidade(reserva.quantidade, doacao.unidade)}
        />
        <LinhaComIcone icone="storefront-outline" texto={doador.nome} />
        {endereco ? (
          <LinhaComIcone icone="location-outline" texto={endereco} linhas={2} />
        ) : null}
        <LinhaComIcone icone="time-outline" texto={descreverPrazo(reserva)} />
      </View>

      {ativa && reserva.codigoRetirada ? (
        <CodigoDeRetirada codigo={reserva.codigoRetirada} />
      ) : null}

      {ativa ? (
        <View style={styles.acoes}>
          {endereco ? (
            <Botao
              titulo="Ver no mapa"
              variante="secundario"
              onPress={() => abrirNoMapa(endereco)}
              estilo={styles.acao}
            />
          ) : null}
          <Botao
            titulo="Cancelar"
            variante="perigo"
            onPress={aoCancelar}
            carregando={cancelando}
            estilo={styles.acao}
          />
        </View>
      ) : null}
    </Cartao>
  );
}

function descreverPrazo(reserva: ReservaResponse) {
  const { prazoRetirada } = reserva.doacao;

  if (reserva.status === 'RETIRADA' && reserva.retiradoEm) {
    return `Retirada ${formatarDataRelativa(reserva.retiradoEm)}`;
  }
  if (reserva.status === 'ATIVA') {
    return prazoVencido(prazoRetirada)
      ? 'Prazo de retirada encerrado'
      : `Retirar até ${formatarDataRelativa(prazoRetirada)}`;
  }
  return `Prazo de retirada: ${formatarDataRelativa(prazoRetirada)}`;
}

const styles = StyleSheet.create({
  tela: {
    padding: 0,
  },
  filtros: {
    paddingTop: espacos.md,
    paddingBottom: espacos.sm,
  },
  cartao: {
    gap: espacos.sm + 4,
  },
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: espacos.sm,
  },
  data: {
    flexShrink: 1,
    fontFamily: fontes.regular,
    fontSize: tamanhos.legenda,
    color: cores.textoSecundario,
  },
  titulo: {
    fontFamily: fontes.extraNegrito,
    fontSize: tamanhos.subtitulo,
    color: cores.texto,
  },
  linhas: {
    gap: espacos.xs,
  },
  acoes: {
    flexDirection: 'row',
    gap: espacos.sm,
  },
  acao: {
    flex: 1,
    minHeight: 44,
    paddingHorizontal: espacos.sm,
  },
});
