import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { cores, espacos, fontes, raios, tamanhos } from '@/theme';
import { formatarDataRelativa } from '@/utils/datas';
import { capitalizar } from '@/utils/formatos';

import { Botao } from './Botao';
import { JanelaInferior } from './JanelaInferior';

const MINUTO = 60 * 1000;
const QUINZE_MINUTOS = 15 * MINUTO;

type CampoDeDataHoraProps = {
  rotulo: string;
  valor: Date | null;
  aoAlterar: (valor: Date) => void;
  minutosMinimos?: number;
  horasMaximas?: number;
  dica?: string;
  erro?: string;
};

type Selecao = {
  data: Date;
  minimo: Date;
  maximo?: Date;
};

function semSegundos(data: Date) {
  return new Date(
    data.getFullYear(),
    data.getMonth(),
    data.getDate(),
    data.getHours(),
    data.getMinutes()
  );
}

export function CampoDeDataHora({
  rotulo,
  valor,
  aoAlterar,
  minutosMinimos = 0,
  horasMaximas,
  dica,
  erro,
}: CampoDeDataHoraProps) {
  const [selecaoNoIos, setSelecaoNoIos] = useState<Selecao | null>(null);

  const texto = valor
    ? capitalizar(formatarDataRelativa(valor.toISOString()))
    : 'Escolher data e hora';

  function abrir() {
    const agora = Date.now();
    const minimo = new Date(agora + minutosMinimos * MINUTO);
    const maximo = horasMaximas
      ? new Date(agora + horasMaximas * 60 * MINUTO)
      : undefined;
    const inicial =
      valor ??
      new Date(
        Math.ceil((agora + 60 * MINUTO) / QUINZE_MINUTOS) * QUINZE_MINUTOS
      );

    if (Platform.OS === 'ios') {
      setSelecaoNoIos({ data: inicial, minimo, maximo });
      return;
    }

    DateTimePickerAndroid.open({
      value: inicial,
      mode: 'date',
      minimumDate: minimo,
      maximumDate: maximo,
      onValueChange: (_, dia) => {
        DateTimePickerAndroid.open({
          value: dia,
          mode: 'time',
          is24Hour: true,
          onValueChange: (__, horario) => aoAlterar(semSegundos(horario)),
        });
      },
    });
  }

  function confirmarNoIos() {
    if (selecaoNoIos) {
      aoAlterar(semSegundos(selecaoNoIos.data));
    }
    setSelecaoNoIos(null);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.rotulo}>{rotulo}</Text>
      <Pressable
        onPress={abrir}
        accessibilityRole="button"
        accessibilityLabel={`${rotulo}: ${texto}`}
        accessibilityHint={dica}
        style={({ pressed }) => [
          styles.caixa,
          pressed && styles.caixaPressionada,
          !!erro && styles.caixaComErro,
        ]}
      >
        <Ionicons name="calendar-outline" size={20} color={cores.primaria} />
        <Text style={[styles.valor, !valor && styles.semValor]}>{texto}</Text>
        <Ionicons name="chevron-down" size={18} color={cores.textoSecundario} />
      </Pressable>
      {erro ? (
        <Text style={styles.erro} accessibilityLiveRegion="polite">
          {erro}
        </Text>
      ) : dica ? (
        <Text style={styles.dica}>{dica}</Text>
      ) : null}

      <JanelaInferior
        visivel={selecaoNoIos !== null}
        titulo={rotulo}
        aoFechar={() => setSelecaoNoIos(null)}
      >
        {selecaoNoIos ? (
          <DateTimePicker
            value={selecaoNoIos.data}
            mode="datetime"
            display="spinner"
            locale="pt-BR"
            themeVariant="light"
            minuteInterval={5}
            minimumDate={selecaoNoIos.minimo}
            maximumDate={selecaoNoIos.maximo}
            onValueChange={(_, data) =>
              setSelecaoNoIos((atual) => atual && { ...atual, data })
            }
          />
        ) : null}
        <Botao titulo="Confirmar" onPress={confirmarNoIos} />
        <Botao
          titulo="Cancelar"
          variante="secundario"
          onPress={() => setSelecaoNoIos(null)}
        />
      </JanelaInferior>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: espacos.md,
  },
  rotulo: {
    marginBottom: espacos.xs,
    fontFamily: fontes.semibold,
    fontSize: tamanhos.legenda + 1,
    color: cores.texto,
  },
  caixa: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacos.sm,
    minHeight: 52,
    paddingHorizontal: espacos.md,
    borderRadius: raios.md,
    borderWidth: 1.5,
    borderColor: cores.borda,
    backgroundColor: cores.superficie,
  },
  caixaPressionada: {
    borderColor: cores.primaria,
  },
  caixaComErro: {
    borderColor: cores.erro,
  },
  valor: {
    flex: 1,
    fontFamily: fontes.semibold,
    fontSize: tamanhos.corpo,
    color: cores.texto,
  },
  semValor: {
    fontFamily: fontes.regular,
    color: cores.textoSecundario,
  },
  dica: {
    marginTop: espacos.xs,
    fontFamily: fontes.regular,
    fontSize: tamanhos.legenda,
    color: cores.textoSecundario,
  },
  erro: {
    marginTop: espacos.xs,
    fontFamily: fontes.semibold,
    fontSize: tamanhos.legenda,
    color: cores.erro,
  },
});
