import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

import { FormularioDeDoacao, Tela } from '@/components';
import { doacaoService } from '@/services/doacaoService';
import type { DoacaoRequest } from '@/types/api';

export default function NovaDoacao() {
  const [versaoDoFormulario, setVersaoDoFormulario] = useState(0);

  async function publicar(dados: DoacaoRequest) {
    await doacaoService.criar(dados);
    setVersaoDoFormulario((atual) => atual + 1);
    router.navigate('/');
    Alert.alert(
      'Doação publicada',
      'Os receptores da sua cidade já podem reservar.'
    );
  }

  return (
    <Tela rolavel bordas={['left', 'right']}>
      <FormularioDeDoacao
        key={versaoDoFormulario}
        textoDoBotao="Publicar doação"
        aoEnviar={publicar}
      />
    </Tela>
  );
}
