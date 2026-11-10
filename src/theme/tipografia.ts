export const fontes = {
  regular: 'Nunito-Regular',
  semibold: 'Nunito-SemiBold',
  negrito: 'Nunito-Bold',
  extraNegrito: 'Nunito-ExtraBold',
} as const;

export const arquivosDeFonte = {
  [fontes.regular]: require('../../assets/fonts/Nunito-Regular.ttf'),
  [fontes.semibold]: require('../../assets/fonts/Nunito-SemiBold.ttf'),
  [fontes.negrito]: require('../../assets/fonts/Nunito-Bold.ttf'),
  [fontes.extraNegrito]: require('../../assets/fonts/Nunito-ExtraBold.ttf'),
};

export const tamanhos = {
  legenda: 13,
  corpo: 16,
  subtitulo: 18,
  titulo: 24,
  destaque: 30,
} as const;
