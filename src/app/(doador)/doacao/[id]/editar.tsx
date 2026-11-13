import { router, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';

import {
  Aviso,
  Carregando,
  FormularioDeDoacao,
  MensagemErro,
  Tela,
} from '@/components';
import { useRequisicao } from '@/hooks/useRequisicao';
import { doacaoService } from '@/services/doacaoService';
import type { DoacaoRequest } from '@/types/api';
import { mensagemDoErro } from '@/utils/mensagensErro';
import { podeAlterarDoacao } from '@/utils/regras';

export default function EditarDoacao() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const buscar = useCallback(() => doacaoService.buscar(Number(id)), [id]);
  const { dados: doacao, erro, recarregar } = useRequisicao(buscar);

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

  const doacaoId = doacao.id;

  async function salvar(dados: DoacaoRequest) {
    await doacaoService.editar(doacaoId, dados);
    router.back();
  }

  return (
    <Tela rolavel bordas={['bottom', 'left', 'right']}>
      {podeAlterarDoacao(doacao.status) ? null : (
        <Aviso mensagem="Esta doação foi encerrada e não pode mais ser editada." />
      )}
      <FormularioDeDoacao
        inicial={doacao}
        textoDoBotao="Salvar alterações"
        aoEnviar={salvar}
      />
    </Tela>
  );
}
