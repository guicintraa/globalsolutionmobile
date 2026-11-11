import { Link, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Aviso, Botao, Campo, SeletorDeOpcoes, Tela } from '@/components';
import type { Opcao } from '@/components';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError } from '@/services/api';
import { cores, espacos, fontes, tamanhos } from '@/theme';
import { errosPorCampo, mensagemDoErro } from '@/utils/mensagensErro';
import type { PapelDeCadastro } from '@/utils/rotulos';
import { temErros, validarCadastro } from '@/utils/validacoes';
import type {
  ErrosDoFormulario,
  FormularioDeCadastro,
} from '@/utils/validacoes';

const opcoesDePapel: Opcao<PapelDeCadastro>[] = [
  {
    valor: 'DOADOR',
    rotulo: 'Doador',
    descricao: 'Padaria, feira ou mercado',
  },
  { valor: 'RECEPTOR', rotulo: 'Receptor', descricao: 'ONG ou família' },
];

const formularioVazio: FormularioDeCadastro = {
  papel: null,
  nome: '',
  email: '',
  senha: '',
  telefone: '',
  endereco: '',
  cidade: '',
  uf: '',
};

export default function Cadastro() {
  const { registrar } = useAuth();

  const [formulario, setFormulario] = useState(formularioVazio);
  const [erros, setErros] = useState<ErrosDoFormulario<FormularioDeCadastro>>(
    {}
  );
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  function alterar<Chave extends keyof FormularioDeCadastro>(
    chave: Chave,
    valor: FormularioDeCadastro[Chave]
  ) {
    setFormulario((atual) => ({ ...atual, [chave]: valor }));
  }

  async function enviar() {
    const encontrados = validarCadastro(formulario);
    setErros(encontrados);
    setErroGeral(null);

    const { papel } = formulario;
    if (temErros(encontrados) || !papel) {
      return;
    }

    setEnviando(true);
    try {
      await registrar({
        nome: formulario.nome.trim(),
        email: formulario.email.trim(),
        senha: formulario.senha,
        telefone: formulario.telefone || null,
        papel,
        endereco: papel === 'DOADOR' ? formulario.endereco.trim() : null,
        cidade: formulario.cidade.trim(),
        uf: formulario.uf,
      });
      router.replace({
        pathname: '/login',
        params: { email: formulario.email.trim(), cadastro: 'ok' },
      });
    } catch (erro) {
      if (erro instanceof ApiError && erro.codigo === 'EMAIL_EM_USO') {
        setErros({ email: mensagemDoErro(erro) });
      } else {
        setErros(errosPorCampo(erro));
        setErroGeral(mensagemDoErro(erro));
      }
      setEnviando(false);
    }
  }

  return (
    <Tela rolavel>
      <Text style={styles.titulo} accessibilityRole="header">
        Criar conta
      </Text>
      <Text style={styles.subtitulo}>
        Doadores publicam o que sobrou do dia. Receptores reservam e retiram.
      </Text>

      {erroGeral ? <Aviso mensagem={erroGeral} /> : null}

      <SeletorDeOpcoes
        rotulo="Você é"
        opcoes={opcoesDePapel}
        valor={formulario.papel}
        aoSelecionar={(papel) => alterar('papel', papel)}
        erro={erros.papel}
      />

      <Campo
        rotulo={
          formulario.papel === 'DOADOR' ? 'Nome do estabelecimento' : 'Nome'
        }
        value={formulario.nome}
        onChangeText={(valor) => alterar('nome', valor)}
        erro={erros.nome}
        autoComplete="name"
      />
      <Campo
        rotulo="E-mail"
        value={formulario.email}
        onChangeText={(valor) => alterar('email', valor)}
        erro={erros.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      <Campo
        rotulo="Senha"
        value={formulario.senha}
        onChangeText={(valor) => alterar('senha', valor)}
        erro={erros.senha}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password-new"
      />
      <Campo
        rotulo="Telefone (opcional)"
        value={formulario.telefone}
        onChangeText={(valor) => alterar('telefone', valor.replace(/\D/g, ''))}
        erro={erros.telefone}
        keyboardType="phone-pad"
        maxLength={11}
        placeholder="DDD e número, só dígitos"
      />
      {formulario.papel === 'DOADOR' ? (
        <Campo
          rotulo="Endereço de retirada"
          value={formulario.endereco}
          onChangeText={(valor) => alterar('endereco', valor)}
          erro={erros.endereco}
          autoComplete="street-address"
          placeholder="Rua, número e bairro"
        />
      ) : null}
      <View style={styles.linha}>
        <View style={styles.cidade}>
          <Campo
            rotulo="Cidade"
            value={formulario.cidade}
            onChangeText={(valor) => alterar('cidade', valor)}
            erro={erros.cidade}
          />
        </View>
        <View style={styles.uf}>
          <Campo
            rotulo="UF"
            value={formulario.uf}
            onChangeText={(valor) =>
              alterar('uf', valor.replace(/[^a-zA-Z]/g, '').toUpperCase())
            }
            erro={erros.uf}
            autoCapitalize="characters"
            maxLength={2}
          />
        </View>
      </View>

      <Botao titulo="Criar conta" onPress={enviar} carregando={enviando} />

      <View style={styles.rodape}>
        <Text style={styles.textoRodape}>Já tem conta?</Text>
        <Link href="/login" replace style={styles.link}>
          Entrar
        </Link>
      </View>
    </Tela>
  );
}

const styles = StyleSheet.create({
  titulo: {
    fontFamily: fontes.extraNegrito,
    fontSize: tamanhos.titulo,
    color: cores.texto,
  },
  subtitulo: {
    marginTop: espacos.xs,
    marginBottom: espacos.lg,
    fontFamily: fontes.regular,
    fontSize: tamanhos.corpo,
    color: cores.textoSecundario,
  },
  linha: {
    flexDirection: 'row',
    gap: espacos.sm,
  },
  cidade: {
    flex: 3,
  },
  uf: {
    flex: 1,
  },
  rodape: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: espacos.xs,
    marginTop: espacos.lg,
  },
  textoRodape: {
    fontFamily: fontes.regular,
    fontSize: tamanhos.corpo,
    color: cores.textoSecundario,
  },
  link: {
    paddingVertical: espacos.sm,
    fontFamily: fontes.negrito,
    fontSize: tamanhos.corpo,
    color: cores.primaria,
  },
});
