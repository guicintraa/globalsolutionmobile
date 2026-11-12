import { Alert, Linking } from 'react-native';

import { formatarTelefone } from './formatos';

function abrirLink(url: string, alternativa: string) {
  Linking.openURL(url).catch(() =>
    Alert.alert('Não foi possível abrir', alternativa)
  );
}

export function abrirNoMapa(endereco: string) {
  abrirLink(
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`,
    endereco
  );
}

export function ligarPara(telefone: string) {
  abrirLink(`tel:${telefone}`, formatarTelefone(telefone));
}
