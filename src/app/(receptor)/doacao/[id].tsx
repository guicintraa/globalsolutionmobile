import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { Alert, Linking, StyleSheet, Text, View } from 'react-native';

import {
  Aviso,
  Botao,
  Carregando,
  Cartao,
  Informacao,
  MensagemErro,
  Selo,
  Tela,
} from '@/components';
import { useRequisicao } from '@/hooks/useRequisicao';
import { doacaoService } from '@/services/doacaoService';
import { cores, espacos, fontes, raios, tamanhos } from '@/theme';
import { formatarDataRelativa, prazoVencido } from '@/utils/datas';
import {
  capitalizar,
  formatarEndereco,
  formatarTelefone,
} from '@/utils/formatos';
import { mensagemDoErro } from '@/utils/mensagensErro';
import {
  descreverQuantidade,
  rotulosDoStatusDaDoacao,
  tonsDoStatusDaDoacao,
} from '@/utils/rotulos';

function abrirLink(url: string, alternativa: string) {
  Linking.openURL(url).catch(() =>
    Alert.alert('Não foi possível abrir', alternativa)
  );
}

export default function DetalheDaDoacao() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const buscar = useCallback(() => doacaoService.buscar(Number(id)), [id]);
  const { dados: doacao, erro, carregando, recarregar } = useRequisicao(buscar);

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

      {disponivel ? null : (
        <Aviso mensagem="Esta doação não está mais disponível para reserva." />
      )}

      <Cartao estilo={styles.cartao}>
        <Informacao
          icone="cube-outline"
          rotulo="Disponível agora"
          valor={descreverQuantidade(
            doacao.quantidadeDisponivel,
            doacao.unidade
          )}
        />
        <Informacao
          icone="layers-outline"
          rotulo="Total doado"
          valor={descreverQuantidade(doacao.quantidadeTotal, doacao.unidade)}
        />
        <Informacao
          icone="time-outline"
          rotulo="Retirar até"
          valor={capitalizar(formatarDataRelativa(doacao.prazoRetirada))}
        />
      </Cartao>

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
                onPress={() =>
                  abrirLink(
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`,
                    endereco
                  )
                }
                estilo={styles.acao}
              />
            ) : null}
            {telefone ? (
              <Botao
                titulo="Ligar"
                variante="secundario"
                onPress={() =>
                  abrirLink(`tel:${telefone}`, formatarTelefone(telefone))
                }
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
            {doacao.geradaPorIa ? (
              <View style={styles.notaDaIa}>
                <Ionicons
                  name="sparkles-outline"
                  size={16}
                  color={cores.secundariaEscura}
                />
                <Text style={styles.textoDaIa}>
                  Orientação gerada por IA. Na dúvida, não consuma.
                </Text>
              </View>
            ) : null}
          </Cartao>
        </>
      ) : null}
    </Tela>
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
  notaDaIa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacos.xs + 2,
    padding: espacos.sm,
    borderRadius: raios.sm,
    backgroundColor: cores.secundariaClara,
  },
  textoDaIa: {
    flex: 1,
    fontFamily: fontes.semibold,
    fontSize: tamanhos.legenda,
    color: cores.secundariaEscura,
  },
});
