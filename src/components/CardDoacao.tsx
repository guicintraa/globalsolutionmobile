import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { cores, espacos, fontes, tamanhos } from '@/theme';
import type { DoacaoResponse } from '@/types/api';
import { formatarDataRelativa, prazoVencido } from '@/utils/datas';
import {
  descreverQuantidade,
  rotulosDoStatusDaDoacao,
  tonsDoStatusDaDoacao,
} from '@/utils/rotulos';

import type { NomeDoIcone } from './BotaoDeIcone';
import { Cartao } from './Cartao';
import { Selo } from './Selo';

type CardDoacaoProps = {
  doacao: DoacaoResponse;
  onPress?: () => void;
  mostrarStatus?: boolean;
  mostrarDoador?: boolean;
};

export function CardDoacao({
  doacao,
  onPress,
  mostrarStatus = false,
  mostrarDoador = true,
}: CardDoacaoProps) {
  const { doador } = doacao;
  const local = [doador.cidade, doador.endereco].filter(Boolean).join(' · ');
  const saldo = `${doacao.quantidadeDisponivel} de ${descreverQuantidade(doacao.quantidadeTotal, doacao.unidade)}`;
  const prazo = prazoVencido(doacao.prazoRetirada)
    ? 'Prazo de retirada encerrado'
    : `Retirar até ${formatarDataRelativa(doacao.prazoRetirada)}`;

  return (
    <Cartao
      onPress={onPress}
      rotuloAcessivel={`${doacao.titulo}, ${doacao.categoria.nome}. Disponível: ${saldo}. ${prazo}.`}
    >
      <View style={styles.selos}>
        <Selo texto={doacao.categoria.nome} tom="destaque" />
        {mostrarStatus ? (
          <Selo
            texto={rotulosDoStatusDaDoacao[doacao.status]}
            tom={tonsDoStatusDaDoacao[doacao.status]}
          />
        ) : null}
      </View>

      <Text style={styles.titulo} numberOfLines={2}>
        {doacao.titulo}
      </Text>

      <View style={styles.linhas}>
        {mostrarDoador ? (
          <Linha icone="storefront-outline" texto={doador.nome} />
        ) : null}
        {mostrarDoador && local ? (
          <Linha icone="location-outline" texto={local} />
        ) : null}
        <Linha icone="cube-outline" texto={`Disponível: ${saldo}`} />
        <Linha icone="time-outline" texto={prazo} />
      </View>
    </Cartao>
  );
}

function Linha({ icone, texto }: { icone: NomeDoIcone; texto: string }) {
  return (
    <View style={styles.linha}>
      <Ionicons name={icone} size={16} color={cores.textoSecundario} />
      <Text style={styles.texto} numberOfLines={1}>
        {texto}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  selos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: espacos.xs + 2,
  },
  titulo: {
    marginTop: espacos.sm,
    fontFamily: fontes.extraNegrito,
    fontSize: tamanhos.subtitulo,
    color: cores.texto,
  },
  linhas: {
    marginTop: espacos.sm,
    gap: espacos.xs,
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacos.xs + 2,
  },
  texto: {
    flex: 1,
    fontFamily: fontes.regular,
    fontSize: tamanhos.legenda + 1,
    color: cores.textoSecundario,
  },
});
