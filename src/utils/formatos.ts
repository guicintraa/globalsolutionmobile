export function formatarTelefone(telefone: string) {
  const partes = telefone.match(/^(\d{2})(\d{4,5})(\d{4})$/);
  return partes ? `(${partes[1]}) ${partes[2]}-${partes[3]}` : telefone;
}

export function formatarEndereco(
  endereco: string | null,
  cidade: string | null,
  uf: string | null
) {
  const local = [cidade, uf].filter(Boolean).join(' - ');
  return [endereco, local].filter(Boolean).join(', ');
}

export function capitalizar(texto: string) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
