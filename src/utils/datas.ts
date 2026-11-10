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
