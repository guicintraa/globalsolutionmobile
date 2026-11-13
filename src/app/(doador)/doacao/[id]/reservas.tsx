import { useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import {
  Aviso,
  Botao,
  Campo,
  Cartao,
  FiltroDeOpcoes,
  JanelaInferior,
  LinhaComIcone,
  ListaPaginada,
  ListaVazia,
  Selo,
  Tela,
} from '@/components';
import { useListaPaginada } from '@/hooks/useListaPaginada';
import { ApiError } from '@/services/api';
import type { CodigoDoErro } from '@/services/api';
import { doacaoService } from '@/services/doacaoService';
import { reservaService } from '@/services/reservaService';
import { cores, espacos, fontes, tamanhos } from '@/theme';
import type { ReservaResponse, StatusReserva } from '@/types/api';
import { formatarDataRelativa } from '@/utils/datas';
import { formatarTelefone } from '@/utils/formatos';
import { errosPorCampo, mensagemDoErro } from '@/utils/mensagensErro';
import {
  descreverQuantidade,
  opcoesDeSituacaoDaReserva,
  rotulosDoStatusDaReserva,
  tonsDoStatusDaReserva,
} from '@/utils/rotulos';
import { temErros, validarRetirada } from '@/utils/validacoes';

const TAMANHO_DA_PAGINA = 10;

const ERROS_QUE_MUDAM_A_RESERVA: CodigoDoErro[] = [
  'ESTADO_INVALIDO',
  'NAO_ENCONTRADO',
];

export default function ReservasDaDoacao() {
  const { id, titulo } = useLocalSearchParams<{
    id: string;
    titulo?: string;
  }>();
  const [situacao, setSituacao] = useState<StatusReserva | null>(null);
  const [emConfirmacao, setEmConfirmacao] = useState<ReservaResponse | null>(
    null
  );
  const [codigo, setCodigo] = useState('');
  const [erroDoCodigo, setErroDoCodigo] = useState<string>();
  const [confirmando, setConfirmando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);

  const buscarPagina = useCallback(
    (pagina: number) =>
      doacaoService.listarReservas(Number(id), {
        status: situacao ?? undefined,
        page: pagina,
        size: TAMANHO_DA_PAGINA,
      }),
    [id, situacao]
  );
  const lista = useListaPaginada(buscarPagina);
  const tituloDaDoacao = titulo ?? lista.itens[0]?.doacao.titulo;

  function filtrar(valor: StatusReserva | null) {
    setSituacao(valor);
    setMensagem(null);
  }

  function abrirConfirmacao(reserva: ReservaResponse) {
    setEmConfirmacao(reserva);
    setCodigo('');
    setErroDoCodigo(undefined);
    setMensagem(null);
  }

  function alterarCodigo(valor: string) {
    setCodigo(valor.toUpperCase().replace(/[^A-Z0-9]/g, ''));
    setErroDoCodigo(undefined);
  }

  async function confirmarRetirada() {
    const reserva = emConfirmacao;
    if (!reserva) {
      return;
    }
    const dados = { codigoRetirada: codigo };
    const erros = validarRetirada(dados);
    setErroDoCodigo(erros.codigoRetirada);
    if (temErros(erros)) {
      return;
    }

    setConfirmando(true);
    try {
      const retirada = await reservaService.confirmarRetirada(
        reserva.id,
        dados
      );
      lista.substituirItem(retirada);
      setEmConfirmacao(null);
      setMensagem(`Retirada confirmada para ${reserva.receptor.nome}.`);
    } catch (erro) {
      const erroDoCampo = errosPorCampo(erro).codigoRetirada;
      if (
        erro instanceof ApiError &&
        erro.codigo === 'CODIGO_RETIRADA_INVALIDO'
      ) {
        setErroDoCodigo(mensagemDoErro(erro));
      } else if (erroDoCampo) {
        setErroDoCodigo(erroDoCampo);
      } else {
        setEmConfirmacao(null);
        Alert.alert('Não foi possível confirmar', mensagemDoErro(erro));
        if (
          erro instanceof ApiError &&
          ERROS_QUE_MUDAM_A_RESERVA.includes(erro.codigo)
        ) {
          lista.recarregar();
        }
      }
    } finally {
      setConfirmando(false);
    }
  }

  return (
    <Tela bordas={['bottom', 'left', 'right']} estilo={styles.tela}>
      <View style={styles.topo}>
        {tituloDaDoacao ? (
          <Text style={styles.titulo} numberOfLines={2}>
            {tituloDaDoacao}
          </Text>
        ) : null}
        {mensagem ? (
          <Aviso mensagem={mensagem} tom="sucesso" estilo={styles.semMargem} />
        ) : null}
      </View>
      <View style={styles.filtros}>
        <FiltroDeOpcoes
          rotulo="Filtrar por situação"
          opcoes={opcoesDeSituacaoDaReserva}
          valor={situacao}
          aoSelecionar={filtrar}
        />
      </View>

      <ListaPaginada
        lista={lista}
        renderizarItem={(reserva) => (
          <CartaoDaReserva
            reserva={reserva}
            aoConfirmar={() => abrirConfirmacao(reserva)}
          />
        )}
        vazio={
          situacao ? (
            <ListaVazia
              titulo="Nenhuma reserva com essa situação"
              textoDaAcao="Ver todas"
              aoAcionar={() => filtrar(null)}
            />
          ) : (
            <ListaVazia
              titulo="Ninguém reservou esta doação ainda"
              mensagem="Quando um receptor reservar, ele aparece aqui. No balcão, peça o código e confirme a retirada."
            />
          )
        }
        mensagemDeCarregamento="Buscando reservas..."
      />

      <JanelaInferior
        visivel={emConfirmacao !== null}
        titulo="Confirmar retirada"
        aoFechar={() => setEmConfirmacao(null)}
      >
        {emConfirmacao ? (
          <Text style={styles.instrucao}>
            {`Peça o código a ${emConfirmacao.receptor.nome} (${descreverQuantidade(emConfirmacao.quantidade, emConfirmacao.doacao.unidade)}) e digite abaixo.`}
          </Text>
        ) : null}
        <Campo
          rotulo="Código de retirada"
          value={codigo}
          onChangeText={alterarCodigo}
          erro={erroDoCodigo}
          autoFocus
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={6}
          placeholder="Ex.: K7P2QX"
          style={styles.codigo}
        />
        <Botao
          titulo="Confirmar retirada"
          onPress={confirmarRetirada}
          carregando={confirmando}
        />
        <Botao
          titulo="Cancelar"
          variante="secundario"
          onPress={() => setEmConfirmacao(null)}
          desabilitado={confirmando}
        />
      </JanelaInferior>
    </Tela>
  );
}

type CartaoDaReservaProps = {
  reserva: ReservaResponse;
  aoConfirmar: () => void;
};

function CartaoDaReserva({ reserva, aoConfirmar }: CartaoDaReservaProps) {
  const { receptor } = reserva;

  return (
    <Cartao estilo={styles.cartao}>
      <View style={styles.linhaDoTopo}>
        <Selo
          texto={rotulosDoStatusDaReserva[reserva.status]}
          tom={tonsDoStatusDaReserva[reserva.status]}
        />
        <Text style={styles.data}>
          Reservada {formatarDataRelativa(reserva.criadoEm)}
        </Text>
      </View>

      <Text style={styles.nome} numberOfLines={2}>
        {receptor.nome}
      </Text>

      <View style={styles.linhas}>
        <LinhaComIcone
          icone="cube-outline"
          texto={descreverQuantidade(
            reserva.quantidade,
            reserva.doacao.unidade
          )}
        />
        {receptor.telefone ? (
          <LinhaComIcone
            icone="call-outline"
            texto={formatarTelefone(receptor.telefone)}
          />
        ) : null}
        {reserva.status === 'RETIRADA' && reserva.retiradoEm ? (
          <LinhaComIcone
            icone="checkmark-done-outline"
            texto={`Retirada ${formatarDataRelativa(reserva.retiradoEm)}`}
          />
        ) : null}
      </View>

      {reserva.status === 'ATIVA' ? (
        <Botao titulo="Confirmar retirada" onPress={aoConfirmar} />
      ) : null}
    </Cartao>
  );
}

const styles = StyleSheet.create({
  tela: {
    padding: 0,
  },
  topo: {
    gap: espacos.sm,
    paddingHorizontal: espacos.lg,
    paddingTop: espacos.md,
  },
  titulo: {
    fontFamily: fontes.extraNegrito,
    fontSize: tamanhos.titulo,
    color: cores.texto,
  },
  semMargem: {
    marginBottom: 0,
  },
  filtros: {
    paddingTop: espacos.md,
    paddingBottom: espacos.sm,
  },
  cartao: {
    gap: espacos.sm + 4,
  },
  linhaDoTopo: {
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
  nome: {
    fontFamily: fontes.extraNegrito,
    fontSize: tamanhos.subtitulo,
    color: cores.texto,
  },
  linhas: {
    gap: espacos.xs,
  },
  instrucao: {
    marginBottom: espacos.sm,
    fontFamily: fontes.regular,
    fontSize: tamanhos.corpo,
    lineHeight: 22,
    color: cores.textoSecundario,
  },
  codigo: {
    fontFamily: fontes.negrito,
    fontSize: tamanhos.subtitulo,
    letterSpacing: 4,
  },
});
