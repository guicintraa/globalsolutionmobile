import { Link, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import type { TextInputInstance } from 'react-native';

import { Aviso, Botao, Campo, Tela } from '@/components';
import { useAuth } from '@/contexts/AuthContext';
import { cores, espacos, fontes, tamanhos } from '@/theme';
import type { LoginRequest } from '@/types/api';
import { errosPorCampo, mensagemDoErro } from '@/utils/mensagensErro';
import { temErros, validarLogin } from '@/utils/validacoes';
import type { ErrosDoFormulario } from '@/utils/validacoes';

export default function Login() {
  const { entrar, aviso } = useAuth();
  const parametros = useLocalSearchParams<{
    email?: string;
    cadastro?: string;
  }>();
  const campoDaSenha = useRef<TextInputInstance>(null);

  const [email, setEmail] = useState(parametros.email ?? '');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState<ErrosDoFormulario<LoginRequest>>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar() {
    const dados = { email: email.trim(), senha };
    const encontrados = validarLogin(dados);
    setErros(encontrados);
    setErroGeral(null);
    if (temErros(encontrados)) {
      return;
    }

    setEnviando(true);
    try {
      await entrar(dados);
    } catch (erro) {
      setErros(errosPorCampo(erro));
      setErroGeral(mensagemDoErro(erro));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Tela rolavel estilo={styles.conteudo}>
      <View style={styles.cabecalho}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.titulo} accessibilityRole="header">
          SobraBem
        </Text>
        <Text style={styles.subtitulo}>
          Entre para doar ou reservar alimentos
        </Text>
      </View>

      {parametros.cadastro === 'ok' && !erroGeral && !aviso ? (
        <Aviso
          tom="sucesso"
          mensagem="Conta criada. Entre com seu e-mail e senha."
        />
      ) : null}
      {aviso && !erroGeral ? <Aviso mensagem={aviso} /> : null}
      {erroGeral ? <Aviso mensagem={erroGeral} /> : null}

      <Campo
        rotulo="E-mail"
        value={email}
        onChangeText={setEmail}
        erro={erros.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        onSubmitEditing={() => campoDaSenha.current?.focus()}
      />
      <Campo
        ref={campoDaSenha}
        rotulo="Senha"
        value={senha}
        onChangeText={setSenha}
        erro={erros.senha}
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password"
        textContentType="password"
        returnKeyType="go"
        onSubmitEditing={enviar}
      />

      <Botao
        titulo="Entrar"
        onPress={enviar}
        carregando={enviando}
        estilo={styles.botao}
      />

      <View style={styles.rodape}>
        <Text style={styles.textoRodape}>Ainda não tem conta?</Text>
        <Link href="/cadastro" replace style={styles.link}>
          Criar conta
        </Link>
      </View>
      <Link href="/sobre" style={styles.sobre}>
        Sobre o App
      </Link>
    </Tela>
  );
}

const styles = StyleSheet.create({
  conteudo: {
    justifyContent: 'center',
  },
  cabecalho: {
    alignItems: 'center',
    marginBottom: espacos.xl,
  },
  logo: {
    width: 96,
    height: 96,
    marginBottom: espacos.md,
  },
  titulo: {
    fontFamily: fontes.extraNegrito,
    fontSize: tamanhos.destaque,
    color: cores.texto,
  },
  subtitulo: {
    marginTop: espacos.xs,
    fontFamily: fontes.regular,
    fontSize: tamanhos.corpo,
    textAlign: 'center',
    color: cores.textoSecundario,
  },
  botao: {
    marginTop: espacos.sm,
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
  sobre: {
    alignSelf: 'center',
    marginTop: espacos.sm,
    paddingVertical: espacos.sm,
    fontFamily: fontes.semibold,
    fontSize: tamanhos.legenda + 1,
    color: cores.textoSecundario,
  },
});
