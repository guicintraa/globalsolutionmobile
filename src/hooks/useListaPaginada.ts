import { useEffect, useState } from 'react';

import type { Page } from '@/types/api';

type ItemComId = { id: number };

type BuscarPagina<T> = (pagina: number) => Promise<Page<T>>;

type Pedido<T> = {
  buscarPagina: BuscarPagina<T>;
  pagina: number;
  versao: number;
};

export type EstadoDaLista<T> = {
  itens: T[];
  erro: unknown;
  carregando: boolean;
  atualizando: boolean;
  carregandoMais: boolean;
  temMais: boolean;
  recarregar: () => void;
  tentarNovamente: () => void;
  carregarMais: () => void;
  substituirItem: (item: T) => void;
};

type Resultado<T> = Pedido<T> & {
  itens: T[];
  paginaCarregada: number;
  totalPaginas: number;
  erro: unknown;
};

function juntarSemRepetir<T extends ItemComId>(atuais: T[], novos: T[]) {
  const ids = new Set(atuais.map((item) => item.id));
  return [...atuais, ...novos.filter((item) => !ids.has(item.id))];
}

export function useListaPaginada<T extends ItemComId>(
  buscarPagina: BuscarPagina<T>
): EstadoDaLista<T> {
  const [pedido, setPedido] = useState<Pedido<T>>({
    buscarPagina,
    pagina: 0,
    versao: 0,
  });
  const [resultado, setResultado] = useState<Resultado<T> | null>(null);

  const pedidoValido = pedido.buscarPagina === buscarPagina;
  const pagina = pedidoValido ? pedido.pagina : 0;
  const versao = pedidoValido ? pedido.versao : 0;

  useEffect(() => {
    let ativo = true;

    buscarPagina(pagina).then(
      (resposta) => {
        if (!ativo) {
          return;
        }
        setResultado((anterior) => {
          const continuacao =
            pagina > 0 && anterior?.buscarPagina === buscarPagina;
          return {
            buscarPagina,
            pagina,
            versao,
            itens: continuacao
              ? juntarSemRepetir(anterior.itens, resposta.content)
              : resposta.content,
            paginaCarregada: pagina,
            totalPaginas: resposta.page.totalPages,
            erro: null,
          };
        });
      },
      (erro: unknown) => {
        if (!ativo) {
          return;
        }
        setResultado((anterior) => {
          const continuacao =
            pagina > 0 && anterior?.buscarPagina === buscarPagina;
          return {
            buscarPagina,
            pagina,
            versao,
            itens: continuacao ? anterior.itens : [],
            paginaCarregada: continuacao ? anterior.paginaCarregada : -1,
            totalPaginas: continuacao ? anterior.totalPaginas : 0,
            erro,
          };
        });
      }
    );

    return () => {
      ativo = false;
    };
  }, [buscarPagina, pagina, versao]);

  const daMesmaBusca =
    resultado !== null && resultado.buscarPagina === buscarPagina;
  const respondido =
    daMesmaBusca && resultado.pagina === pagina && resultado.versao === versao;

  const itens = daMesmaBusca ? resultado.itens : [];
  const erro = respondido ? resultado.erro : null;
  const temMais =
    daMesmaBusca && resultado.paginaCarregada + 1 < resultado.totalPaginas;

  function pedir(novaPagina: number, novaVersao: number) {
    setPedido({ buscarPagina, pagina: novaPagina, versao: novaVersao });
  }

  return {
    itens,
    erro,
    carregando: !respondido && pagina === 0 && itens.length === 0,
    atualizando: !respondido && pagina === 0 && itens.length > 0,
    carregandoMais: !respondido && pagina > 0,
    temMais,
    recarregar: () => pedir(0, versao + 1),
    tentarNovamente: () => pedir(pagina, versao + 1),
    carregarMais: () => {
      if (respondido && !erro && temMais) {
        pedir(resultado.paginaCarregada + 1, versao);
      }
    },
    substituirItem: (item) =>
      setResultado(
        (anterior) =>
          anterior && {
            ...anterior,
            itens: anterior.itens.map((atual) =>
              atual.id === item.id ? item : atual
            ),
          }
      ),
  };
}
