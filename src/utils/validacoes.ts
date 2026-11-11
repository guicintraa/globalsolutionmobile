import type { LoginRequest } from '@/types/api';

import type { PapelDeCadastro } from './rotulos';

export type ErrosDoFormulario<T> = Partial<Record<keyof T, string>>;

export type FormularioDeCadastro = {
  papel: PapelDeCadastro | null;
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  endereco: string;
  cidade: string;
  uf: string;
};

const FORMATO_DE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function temErros(erros: object) {
  return Object.keys(erros).length > 0;
}

function validarEmail(email: string) {
  if (!email) {
    return 'Informe o e-mail.';
  }
  if (email.length > 150 || !FORMATO_DE_EMAIL.test(email)) {
    return 'Informe um e-mail válido.';
  }
  return undefined;
}

export function validarLogin(dados: LoginRequest) {
  const erros: ErrosDoFormulario<LoginRequest> = {};

  const erroDoEmail = validarEmail(dados.email);
  if (erroDoEmail) {
    erros.email = erroDoEmail;
  }
  if (!dados.senha) {
    erros.senha = 'Informe a senha.';
  }

  return erros;
}

export function validarCadastro(dados: FormularioDeCadastro) {
  const erros: ErrosDoFormulario<FormularioDeCadastro> = {};

  if (!dados.papel) {
    erros.papel = 'Escolha se você é doador ou receptor.';
  }

  const nome = dados.nome.trim();
  if (nome.length < 3 || nome.length > 120) {
    erros.nome = 'O nome deve ter de 3 a 120 caracteres.';
  }

  const erroDoEmail = validarEmail(dados.email.trim());
  if (erroDoEmail) {
    erros.email = erroDoEmail;
  }

  const senha = dados.senha;
  if (
    senha.length < 8 ||
    senha.length > 60 ||
    !/[A-Za-zÀ-ÿ]/.test(senha) ||
    !/\d/.test(senha)
  ) {
    erros.senha = 'Use de 8 a 60 caracteres, com letras e números.';
  }

  if (dados.telefone && !/^\d{10,11}$/.test(dados.telefone)) {
    erros.telefone = 'Informe o telefone com DDD, só números.';
  }

  if (dados.papel === 'DOADOR') {
    const endereco = dados.endereco.trim();
    if (!endereco) {
      erros.endereco = 'Informe o endereço de retirada.';
    } else if (endereco.length > 200) {
      erros.endereco = 'O endereço deve ter até 200 caracteres.';
    }
  }

  const cidade = dados.cidade.trim();
  if (!cidade) {
    erros.cidade = 'Informe a cidade.';
  } else if (cidade.length > 80) {
    erros.cidade = 'A cidade deve ter até 80 caracteres.';
  }

  if (!/^[A-Z]{2}$/.test(dados.uf)) {
    erros.uf = 'Informe a UF com 2 letras.';
  }

  return erros;
}
