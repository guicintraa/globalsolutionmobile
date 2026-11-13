import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  Aviso,
  Botao,
  CampoDeQuantidade,
  Carregando,
  Cartao,
  CodigoDeRetirada,
  Informacao,
  MensagemErro,
  NotaDaIa,
  Selo,
  Tela,
} from '@/components';
import { useRequisicao } from '@/hooks/useRequisicao';
import { ApiError } from '@/services/api';
import type { CodigoDoErro } from '@/services/api';
import { doacaoService } from '@/services/doacaoService';
import { reservaService } from '@/services/reservaService';
import { cores, espacos, fontes, tamanhos } from '@/theme';
import type { DoacaoResponse, ReservaResponse } from '@/types/api';
import { formatarDataRelativa, prazoVencido } from '@/utils/datas';
import {
  capitalizar,
  formatarEndereco,
  formatarTelefone,
} from '@/utils/formatos';
import { abrirNoMapa, ligarPara } from '@/utils/links';
import { errosPorCampo, mensagemDoErro } from '@/utils/mensagensErro';
import {
  descreverQuantidade,
  nomeDaUnidade,
  rotulosDoStatusDaDoacao,
  tonsDoStatusDaDoacao,
} from '@/utils/rotulos';
import { temErros, validarReserva } from '@/utils/validacoes';

const ERROS_QUE_MUDAM_A_DOACAO: CodigoDoErro[] = [
  'SALDO_INSUFICIENTE',
  'DOACAO_INDISPONIVEL',
];

function irParaMinhasReservas() {
  router.dismissTo('/reservas');
}

export default function DetalheDaDoacao() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const buscar = useCallback(() => doacaoService.buscar(Number(id)), [id]);
  const { dados: doacao, erro, carregando, recarregar } = useRequisicao(buscar);
  const [reserva, setReserva] = useState<ReservaResponse | null>(null);

  if (!doacao) {
    return (
      <Tela bordas={['bottom', 'left', 'right']}>
        {erro ? (
          <MensagemErro
            mensagem={mensagemDoErro(erro)}
            aoTentarNovamente={recarregar}
          />
        ) : (
          <Carregando mensagem="Carregando doação..." />
        )}
      </Tela>
    );
  }

  const { doador } = doacao;
  const disponivel =
    doacao.status === 'ATIVA' && !prazoVencido(doacao.prazoRetirada);
  const endereco = formatarEndereco(doador.endereco, doador.cidade, doador.uf);
  const telefone = doador.telefone;

  function concluirReserva(nova: ReservaResponse) {
    setReserva(nova);
    recarregar();
  }

  return (
    <Tela
      rolavel
      bordas={['bottom', 'left', 'right']}
      atualizando={carregando}
      aoAtualizar={recarregar}
    >
      {erro ? <Aviso mensagem={mensagemDoErro(erro)} /> : null}

      <View style={styles.selos}>
        <Selo texto={doacao.categoria.nome} tom="destaque" />
        <Selo
          texto={rotulosDoStatusDaDoacao[doacao.status]}
          tom={tonsDoStatusDaDoacao[doacao.status]}
        />
      </View>
      <Text style={styles.titulo} accessibilityRole="header">
        {doacao.titulo}
      </Text>
      {doacao.descricao ? (
        <Text style={styles.descricao}>{doacao.descricao}</Text>
      ) : null}
      <Text style={styles.publicada}>
        Publicada {formatarDataRelativa(doacao.criadoEm)}
      </Text>

      <Cartao estilo={styles.cartao}>
        <Informacao
          icone="cube-outline"
          rotulo="Disponível agora"
          valor={`${doacao.quantidadeDisponivel} de ${descreverQuantidade(doacao.quantidadeTotal, doacao.unidade)}`}
        />
        <Informacao
          icone="time-outline"
          rotulo="Retirar até"
          valor={capitalizar(formatarDataRelativa(doacao.prazoRetirada))}
        />
        {disponivel && !reserva ? (
          <FormularioDeReserva
            doacao={doacao}
            aoReservar={concluirReserva}
            aoMudarADoacao={recarregar}
          />
        ) : null}
      </Cartao>

      {reserva ? <ReservaFeita reserva={reserva} /> : null}
      {!disponivel && !reserva ? (
        <Aviso
          mensagem="Esta doação não está mais disponível para reserva."
          estilo={styles.indisponivel}
        />
      ) : null}

      <Text style={styles.secao} accessibilityRole="header">
        Onde retirar
      </Text>
      <Cartao estilo={styles.cartao}>
        <Informacao
          icone="storefront-outline"
          rotulo="Doador"
          valor={doador.nome}
        />
        {endereco ? (
          <Informacao
            icone="location-outline"
            rotulo="Endereço"
            valor={endereco}
          />
        ) : null}
        {telefone ? (
          <Informacao
            icone="call-outline"
            rotulo="Telefone"
            valor={formatarTelefone(telefone)}
          />
        ) : null}
        {endereco || telefone ? (
          <View style={styles.acoes}>
            {endereco ? (
              <Botao
                titulo="Ver no mapa"
                variante="secundario"
                onPress={() => abrirNoMapa(endereco)}
                estilo={styles.acao}
              />
            ) : null}
            {telefone ? (
              <Botao
                titulo="Ligar"
                variante="secundario"
                onPress={() => ligarPara(telefone)}
                estilo={styles.acao}
              />
            ) : null}
          </View>
        ) : null}
      </Cartao>

      {doacao.orientacoesConservacao ? (
        <>
          <Text style={styles.secao} accessibilityRole="header">
            Como conservar
          </Text>
          <Cartao estilo={styles.cartao}>
            <Text style={styles.orientacao}>
              {doacao.orientacoesConservacao}
            </Text>
            {doacao.geradaPorIa ? <NotaDaIa /> : null}
          </Cartao>
        </>
      ) : null}
    </Tela>
  );
}

type FormularioDeReservaProps = {
  doacao: DoacaoResponse;
  aoReservar: (reserva: ReservaResponse) => void;
  aoMudarADoacao: () => void;
};

function FormularioDeReserva({
  doacao,
  aoReservar,
  aoMudarADoacao,
}: FormularioDeReservaProps) {
  const [quantidade, setQuantidade] = useState('1');
  const [erroDaQuantidade, setErroDaQuantidade] = useState<string>();
  const [erroDaReserva, setErroDaReserva] = useState<unknown>(null);
  const [reservando, setReservando] = useState(false);

  const numero = Number(quantidade);
  const quantidadeValida =
    Number.isInteger(numero) &&
    numero >= 1 &&
    numero <= doacao.quantidadeDisponivel;
  const reservaDuplicada =
    erroDaReserva instanceof ApiError &&
    erroDaReserva.codigo === 'RESERVA_DUPLICADA';

  function alterarQuantidade(valor: string) {
    setQuantidade(valor);
    setErroDaQuantidade(undefined);
    setErroDaReserva(null);
  }

  async function reservar() {
    const erros = validarReserva(
      { quantidade },
      doacao.quantidadeDisponivel,
      doacao.unidade
    );
    setErroDaQuantidade(erros.quantidade);
    setErroDaReserva(null);
    if (temErros(erros)) {
      return;
    }

    setReservando(true);
    try {
      const nova = await reservaService.reservar({
        doacaoId: doacao.id,
        quantidade: numero,
      });
      aoReservar(nova);
    } catch (erro) {
      const erroDoCampo = errosPorCampo(erro).quantidade;
      if (erroDoCampo) {
        setErroDaQuantidade(erroDoCampo);
      } else {
        setErroDaReserva(erro);
      }
      if (
        erro instanceof ApiError &&
        ERROS_QUE_MUDAM_A_DOACAO.includes(erro.codigo)
      ) {
        aoMudarADoacao();
      }
      setReservando(false);
    }
  }

  return (
    <View style={styles.formulario}>
      <CampoDeQuantidade
        rotulo="Quantidade"
        valor={quantidade}
        aoAlterar={alterarQuantidade}
        maximo={doacao.quantidadeDisponivel}
        unidade={nomeDaUnidade(numero, doacao.unidade)}
        dica={`Até ${descreverQuantidade(doacao.quantidadeDisponivel, doacao.unidade)}.`}
        erro={erroDaQuantidade}
      />
      {erroDaReserva ? (
        <Aviso
          mensagem={mensagemDoErro(erroDaReserva)}
          estilo={styles.semMargem}
        />
      ) : null}
      {reservaDuplicada ? (
        <Botao
          titulo="Ver minhas reservas"
          variante="secundario"
          onPress={irParaMinhasReservas}
        />
      ) : null}
      <Botao
        titulo={
          quantidadeValida
            ? `Reservar ${descreverQuantidade(numero, doacao.unidade)}`
            : 'Reservar'
        }
        onPress={reservar}
        carregando={reservando}
      />
    </View>
  );
}

function ReservaFeita({ reserva }: { reserva: ReservaResponse }) {
  return (
    <>
      <Text style={styles.secao} accessibilityRole="header">
        Sua reserva
      </Text>
      <Cartao estilo={[styles.cartao, styles.cartaoDaReserva]}>
        <View style={styles.confirmacao}>
          <Ionicons name="checkmark-circle" size={26} color={cores.primaria} />
          <Text style={styles.textoDaConfirmacao}>Reserva confirmada</Text>
        </View>
        <Text style={styles.resumo}>
          {descreverQuantidade(reserva.quantidade, reserva.doacao.unidade)} de{' '}
          {reserva.doacao.titulo}
        </Text>
        {reserva.codigoRetirada ? (
          <CodigoDeRetirada codigo={reserva.codigoRetirada} />
        ) : null}
        <Text style={styles.resumo}>
          Mostre o código no balcão até{' '}
          {formatarDataRelativa(reserva.doacao.prazoRetirada)}.
        </Text>
        <Botao
          titulo="Ver minhas reservas"
          variante="secundario"
          onPress={irParaMinhasReservas}
        />
      </Cartao>
    </>
  );
}

const styles = StyleSheet.create({
  selos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espacos.xs + 2,
  },
  titulo: {
    marginTop: espacos.sm + 4,
    fontFamily: fontes.extraNegrito,
    fontSize: tamanhos.titulo,
    color: cores.texto,
  },
  descricao: {
    marginTop: espacos.sm,
    fontFamily: fontes.regular,
    fontSize: tamanhos.corpo,
    lineHeight: 22,
    color: cores.texto,
  },
  publicada: {
    marginTop: espacos.sm,
    marginBottom: espacos.md,
    fontFamily: fontes.regular,
    fontSize: tamanhos.legenda,
    color: cores.textoSecundario,
  },
  cartao: {
    gap: espacos.md,
  },
  formulario: {
    gap: espacos.md,
    paddingTop: espacos.md,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
  },
  semMargem: {
    marginBottom: 0,
  },
  indisponivel: {
    marginTop: espacos.md,
    marginBottom: 0,
  },
  cartaoDaReserva: {
    borderColor: cores.primaria,
    backgroundColor: cores.primariaClara,
  },
  confirmacao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacos.sm,
  },
  textoDaConfirmacao: {
    fontFamily: fontes.extraNegrito,
    fontSize: tamanhos.subtitulo,
    color: cores.primariaEscura,
  },
  resumo: {
    fontFamily: fontes.regular,
    fontSize: tamanhos.corpo,
    lineHeight: 22,
    color: cores.texto,
  },
  secao: {
    marginTop: espacos.lg,
    marginBottom: espacos.sm,
    fontFamily: fontes.extraNegrito,
    fontSize: tamanhos.subtitulo,
    color: cores.texto,
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
  orientacao: {
    fontFamily: fontes.regular,
    fontSize: tamanhos.corpo,
    lineHeight: 22,
    color: cores.texto,
  },
});
