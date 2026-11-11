import { cores } from './cores';
import { fontes, tamanhos } from './tipografia';

export const cabecalho = {
  headerStyle: { backgroundColor: cores.superficie },
  headerTitleStyle: {
    fontFamily: fontes.extraNegrito,
    fontSize: tamanhos.subtitulo,
    color: cores.texto,
  },
  headerTintColor: cores.primaria,
  headerShadowVisible: false,
};
