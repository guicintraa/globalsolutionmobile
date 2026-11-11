function doisDigitos(numero: number) {
  return String(numero).padStart(2, '0');
}

export function lerData(iso: string) {
  return new Date(iso.replace(/(\.\d{3})\d+/, '$1'));
}

export function formatarData(iso: string) {
  const data = lerData(iso);
  return `${doisDigitos(data.getDate())}/${doisDigitos(data.getMonth() + 1)}/${data.getFullYear()}`;
}

export function formatarHora(iso: string) {
  const data = lerData(iso);
  return `${doisDigitos(data.getHours())}:${doisDigitos(data.getMinutes())}`;
}

export function formatarDataHora(iso: string) {
  return `${formatarData(iso)} às ${formatarHora(iso)}`;
}

export function paraIsoComFuso(data: Date) {
  const diferenca = -data.getTimezoneOffset();
  const sinal = diferenca >= 0 ? '+' : '-';
  const minutos = Math.abs(diferenca);
  const fuso = `${sinal}${doisDigitos(Math.floor(minutos / 60))}:${doisDigitos(minutos % 60)}`;

  return (
    `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}` +
    `T${doisDigitos(data.getHours())}:${doisDigitos(data.getMinutes())}:${doisDigitos(data.getSeconds())}` +
    fuso
  );
}

export function prazoVencido(iso: string, agora = new Date()) {
  return lerData(iso).getTime() <= agora.getTime();
}

function mesmoDia(primeira: Date, segunda: Date) {
  return (
    primeira.getFullYear() === segunda.getFullYear() &&
    primeira.getMonth() === segunda.getMonth() &&
    primeira.getDate() === segunda.getDate()
  );
}

export function formatarDataRelativa(iso: string, agora = new Date()) {
  const data = lerData(iso);
  const hora = formatarHora(iso);
  const dia = (deslocamento: number) =>
    new Date(
      agora.getFullYear(),
      agora.getMonth(),
      agora.getDate() + deslocamento
    );

  if (mesmoDia(data, agora)) {
    return `hoje às ${hora}`;
  }
  if (mesmoDia(data, dia(1))) {
    return `amanhã às ${hora}`;
  }
  if (mesmoDia(data, dia(-1))) {
    return `ontem às ${hora}`;
  }
  return `${doisDigitos(data.getDate())}/${doisDigitos(data.getMonth() + 1)} às ${hora}`;
}
