import { useEffect, useState } from 'react';

type Resposta<T> = {
  buscar: () => Promise<T>;
  versao: number;
  dados: T | null;
  erro: unknown;
};

export function useRequisicao<T>(buscar: () => Promise<T>) {
  const [versao, setVersao] = useState(0);
  const [resposta, setResposta] = useState<Resposta<T> | null>(null);

  useEffect(() => {
    let ativa = true;

    buscar().then(
      (dados) => {
        if (ativa) {
          setResposta({ buscar, versao, dados, erro: null });
        }
      },
      (erro: unknown) => {
        if (ativa) {
          setResposta((anterior) => ({
            buscar,
            versao,
            dados: anterior?.buscar === buscar ? anterior.dados : null,
            erro,
          }));
        }
      }
    );

    return () => {
      ativa = false;
    };
  }, [buscar, versao]);

  const daMesmaBusca = resposta !== null && resposta.buscar === buscar;
  const carregando = !daMesmaBusca || resposta.versao !== versao;

  return {
    dados: daMesmaBusca ? resposta.dados : null,
    erro: carregando ? null : resposta.erro,
    carregando,
    recarregar: () => setVersao((atual) => atual + 1),
  };
}
