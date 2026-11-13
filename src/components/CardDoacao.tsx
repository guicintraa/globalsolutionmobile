import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { cores, espacos, fontes, tamanhos } from '@/theme';
import type { DoacaoResponse } from '@/types/api';
import { formatarDataRelativa, prazoVencido } from '@/utils/datas';
import {
  descreverQuantidade,
  rotulosDoStatusDaDoacao,
  tonsDoStatusDaDoacao,
} from '@/utils/rotulos';

import { Cartao } from './Cartao';
import { LinhaComIcone } from './LinhaComIcone';
import { Selo } from './Selo';

type CardDoacaoProps = {
  doacao: DoacaoResponse;
  onPress?: () => void;
  mostrarStatus?: boolean;
  mostrarDoador?: boolean;
  acoes?: ReactNode;
};

export function CardDoacao({
  doacao,
  onPress,
  mostrarStatus = false,
  mostrarDoador = true,
  acoes,
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
          <LinhaComIcone icone="storefront-outline" texto={doador.nome} />
        ) : null}
        {mostrarDoador && local ? (
          <LinhaComIcone icone="location-outline" texto={local} />
        ) : null}
        <LinhaComIcone icone="cube-outline" texto={`Disponível: ${saldo}`} />
        <LinhaComIcone icone="time-outline" texto={prazo} />
      </View>

      {acoes ? <View style={styles.acoes}>{acoes}</View> : null}
    </Cartao>
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
  acoes: {
    flexDirection: 'row',
    gap: espacos.sm,
    marginTop: espacos.md,
  },
});
