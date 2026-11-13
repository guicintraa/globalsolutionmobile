import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useRequisicao } from '@/hooks/useRequisicao';
import { ApiError } from '@/services/api';
import { categoriaService } from '@/services/categoriaService';
import { cores, espacos, fontes, tamanhos } from '@/theme';
import type { DoacaoRequest, DoacaoResponse, Unidade } from '@/types/api';
import { lerData, paraIsoComFuso } from '@/utils/datas';
import { errosPorCampo, mensagemDoErro } from '@/utils/mensagensErro';
import { MINUTOS_MINIMOS_DE_PRAZO } from '@/utils/regras';
import { temErros, validarDoacao } from '@/utils/validacoes';
import type {
  ErrosDoFormulario,
  FormularioDeDoacao as Formulario,
} from '@/utils/validacoes';

import { Aviso } from './Aviso';
import { Botao } from './Botao';
import { Campo } from './Campo';
import { CampoDeDataHora } from './CampoDeDataHora';
import { SeletorDeOpcoes } from './SeletorDeOpcoes';
import type { Opcao } from './SeletorDeOpcoes';

const opcoesDeUnidade: Opcao<Unidade>[] = [
  { valor: 'UNIDADE', rotulo: 'Unidades' },
  { valor: 'KG', rotulo: 'Quilos (kg)' },
  { valor: 'PACOTE', rotulo: 'Pacotes' },
];

function formularioInicial(doacao?: DoacaoResponse): Formulario {
  return {
    titulo: doacao?.titulo ?? '',
    descricao: doacao?.descricao ?? '',
    categoriaId: doacao?.categoria.id ?? null,
    quantidadeTotal: doacao ? String(doacao.quantidadeTotal) : '',
    unidade: doacao?.unidade ?? null,
    prazoRetirada: doacao ? lerData(doacao.prazoRetirada) : null,
    orientacoesConservacao: doacao?.orientacoesConservacao ?? '',
    geradaPorIa: doacao?.geradaPorIa ?? false,
  };
}

type FormularioDeDoacaoProps = {
  inicial?: DoacaoResponse;
  textoDoBotao: string;
  aoEnviar: (dados: DoacaoRequest) => Promise<void>;
};

export function FormularioDeDoacao({
  inicial,
  textoDoBotao,
  aoEnviar,
}: FormularioDeDoacaoProps) {
  const categorias = useRequisicao(categoriaService.listar);
  const [formulario, setFormulario] = useState(() =>
    formularioInicial(inicial)
  );
  const [erros, setErros] = useState<ErrosDoFormulario<Formulario>>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const reservado = inicial
    ? inicial.quantidadeTotal - inicial.quantidadeDisponivel
    : 0;
  const categoria = categorias.dados?.find(
    (item) => item.id === formulario.categoriaId
  );
  const opcoesDeCategoria = (categorias.dados ?? []).map((item) => ({
    valor: item.id,
    rotulo: item.nome,
    descricao: `até ${item.prazoMaxHoras} h`,
  }));

  function alterar<Chave extends keyof Formulario>(
    chave: Chave,
    valor: Formulario[Chave]
  ) {
    setFormulario((atual) => ({ ...atual, [chave]: valor }));
    setErros((atuais) => {
      const restantes = { ...atuais };
      delete restantes[chave];
      return restantes;
    });
  }

  function alterarOrientacoes(texto: string) {
    alterar('orientacoesConservacao', texto);
    alterar('geradaPorIa', false);
  }

  async function enviar() {
    const encontrados = validarDoacao(formulario, { categoria, reservado });
    setErros(encontrados);
    setErroGeral(null);

    const { categoriaId, unidade, prazoRetirada } = formulario;
    if (
      temErros(encontrados) ||
      categoriaId === null ||
      unidade === null ||
      prazoRetirada === null
    ) {
      return;
    }

    setEnviando(true);
    try {
      await aoEnviar({
        titulo: formulario.titulo.trim(),
        descricao: formulario.descricao.trim() || null,
        categoriaId,
        quantidadeTotal: Number(formulario.quantidadeTotal),
        unidade,
        prazoRetirada: paraIsoComFuso(prazoRetirada),
        orientacoesConservacao:
          formulario.orientacoesConservacao.trim() || null,
        geradaPorIa:
          formulario.geradaPorIa &&
          formulario.orientacoesConservacao.trim() !== '',
      });
    } catch (erro) {
      if (erro instanceof ApiError && erro.codigo === 'PRAZO_INVALIDO') {
        setErros({ prazoRetirada: mensagemDoErro(erro) });
      } else {
        setErros(errosPorCampo(erro));
        setErroGeral(mensagemDoErro(erro));
      }
      setEnviando(false);
    }
  }

  return (
    <View>
      {erroGeral ? <Aviso mensagem={erroGeral} /> : null}

      <Campo
        rotulo="Título"
        value={formulario.titulo}
        onChangeText={(valor) => alterar('titulo', valor)}
        erro={erros.titulo}
        maxLength={100}
        placeholder="Ex.: Pão francês do dia"
      />
      <Campo
        rotulo="Descrição (opcional)"
        value={formulario.descricao}
        onChangeText={(valor) => alterar('descricao', valor)}
        erro={erros.descricao}
        multiline
        maxLength={500}
        placeholder="Ex.: Assados às 15h, em sacos com 10 unidades"
      />

      {categorias.dados ? (
        <SeletorDeOpcoes
          rotulo="Categoria"
          opcoes={opcoesDeCategoria}
          valor={formulario.categoriaId}
          aoSelecionar={(id) => alterar('categoriaId', id)}
          erro={erros.categoriaId}
        />
      ) : categorias.erro ? (
        <View style={styles.bloco}>
          <Aviso mensagem="Não foi possível carregar as categorias." />
          <Botao
            titulo="Tentar de novo"
            variante="secundario"
            onPress={categorias.recarregar}
          />
        </View>
      ) : (
        <Text style={styles.carregando}>Carregando categorias...</Text>
      )}

      <Campo
        rotulo="Quantidade total"
        value={formulario.quantidadeTotal}
        onChangeText={(valor) =>
          alterar('quantidadeTotal', valor.replace(/\D/g, ''))
        }
        erro={erros.quantidadeTotal}
        dica={
          reservado > 0
            ? `Já reservado: ${reservado}. A quantidade não pode ficar abaixo disso.`
            : undefined
        }
        keyboardType="number-pad"
        maxLength={4}
      />
      <SeletorDeOpcoes
        rotulo="Unidade"
        opcoes={opcoesDeUnidade}
        valor={formulario.unidade}
        aoSelecionar={(unidade) => alterar('unidade', unidade)}
        erro={erros.unidade}
      />

      <CampoDeDataHora
        rotulo="Retirar até"
        valor={formulario.prazoRetirada}
        aoAlterar={(data) => alterar('prazoRetirada', data)}
        minutosMinimos={MINUTOS_MINIMOS_DE_PRAZO}
        horasMaximas={categoria?.prazoMaxHoras}
        erro={erros.prazoRetirada}
        dica={
          categoria
            ? `Entre ${MINUTOS_MINIMOS_DE_PRAZO} minutos e ${categoria.prazoMaxHoras} h a partir de agora.`
            : 'Escolha a categoria para ver o prazo máximo.'
        }
      />

      <Campo
        rotulo="Orientações de conservação (opcional)"
        value={formulario.orientacoesConservacao}
        onChangeText={alterarOrientacoes}
        erro={erros.orientacoesConservacao}
        multiline
        maxLength={1000}
        placeholder="Ex.: Manter em embalagem fechada, em local seco."
      />

      <Botao titulo={textoDoBotao} onPress={enviar} carregando={enviando} />
    </View>
  );
}

const styles = StyleSheet.create({
  bloco: {
    marginBottom: espacos.md,
  },
  carregando: {
    marginBottom: espacos.md,
    fontFamily: fontes.regular,
    fontSize: tamanhos.corpo,
    color: cores.textoSecundario,
  },
});
