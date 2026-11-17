# SobraBem · App Mobile

App para reduzir o desperdício de alimentos. Padarias, mercados e feiras publicam o que sobrou do dia. ONGs e famílias reservam e retiram dentro do prazo, apresentando um código de 6 caracteres no balcão.

Global Solution 2026/2 · CitizenTech · FIAP

## Integrantes

| Nome                        | RM     |
| --------------------------- | ------ |
| Guilherme Cintra            | 562850 |
| Erick de Faria Gama         | 561951 |
| Matheus Nascimento Corregio | 563765 |
| Pedro Fonseca de Almeida    | 563466 |
| Daniel Fonseca de Almeida   | 563045 |

## Versão publicada

| Item            | Valor                                                                          |
| --------------- | ------------------------------------------------------------------------------ |
| Distribuição    | Firebase App Distribution (o professor foi convidado como testador)            |
| Commit da build | `092eeb9`, o mesmo hash que aparece no app em **Sobre o App**                  |
| API             | https://gs-sobrabem-java.onrender.com (API Java do grupo, hospedada no Render) |

A API está no plano gratuito do Render: depois de 15 minutos sem uso ela desliga, e a primeira chamada pode levar cerca de 1 minuto. O app espera até 60 segundos e, se passar disso, avisa e deixa tentar de novo.

## Funcionalidades

**Doador** (padaria, mercado, feira)

- Minhas doações: lista com status e saldo; editar, excluir (sem reservas) ou cancelar (com reservas).
- Nova doação, com o botão "Gerar orientação", que sugere por IA como conservar o alimento.
- Ver reservas de cada doação e confirmar a retirada digitando o código que o receptor apresenta.

**Receptor** (ONG ou família)

- Doações disponíveis na sua cidade, com filtro por categoria.
- Detalhe da doação, com endereço, prazo e orientação de conservação, e reserva da quantidade.
- Minhas reservas, com o código de retirada e a opção de cancelar.

**Todos**: cadastro, login, logout, rotas protegidas por papel e a tela Sobre o App, com a versão, o commit e o servidor da API.

## Telas

| #   | Tela                                         | Papel    | Arquivo                                                                               |
| --- | -------------------------------------------- | -------- | ------------------------------------------------------------------------------------- |
| 1   | Login                                        | público  | `src/app/login.tsx`                                                                   |
| 2   | Cadastro                                     | público  | `src/app/cadastro.tsx`                                                                |
| 3   | Minhas doações                               | doador   | `src/app/(doador)/(abas)/index.tsx`                                                   |
| 4   | Formulário de doação (criar e editar)        | doador   | `src/app/(doador)/(abas)/nova-doacao.tsx` e `src/app/(doador)/doacao/[id]/editar.tsx` |
| 5   | Doações disponíveis                          | receptor | `src/app/(receptor)/(abas)/index.tsx`                                                 |
| 6   | Detalhe e reserva                            | receptor | `src/app/(receptor)/doacao/[id].tsx`                                                  |
| 7   | Minhas reservas                              | receptor | `src/app/(receptor)/(abas)/reservas.tsx`                                              |
| 8   | Reservas da doação e confirmação de retirada | doador   | `src/app/(doador)/doacao/[id]/reservas.tsx`                                           |

A tela Sobre o App fica em `src/app/sobre.tsx` e abre pelo login ou pelo ícone de informação no topo das abas.

## Requisitos atendidos

| Requisito            | Como o app atende                                                                                                                |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 01 Telas e navegação | 8 telas com Expo Router, abas diferentes para doador e receptor e grupos de rotas protegidos com `Stack.Protected`               |
| 02 CRUD com a API    | doações do doador com POST, GET, PUT e DELETE em `/api/doacoes` via `fetch`, com carregamento e mensagens de erro                |
| 03 Autenticação      | cadastro e login na API Java, token JWT guardado no expo-secure-store, logout que limpa o token e volta ao login em qualquer 401 |
| 04 Estilização       | tema próprio em `src/theme` (cores, fonte Nunito, espaçamentos) e ícone, splash e logo em `assets/`                              |
| 05 Arquitetura       | pastas por responsabilidade, TypeScript, ESLint + Prettier e poucas bibliotecas                                                  |
| 06 Vídeo             | link no arquivo de entrega                                                                                                       |
| 07 Publicação        | APK gerado com EAS Build e distribuído pelo Firebase App Distribution, com o hash do commit em Sobre o App                       |

## Tecnologias

- Expo SDK 58, React Native 0.88, React 19 e TypeScript
- Expo Router: rotas por arquivo, abas e rotas protegidas
- `fetch` nativo para falar com a API e expo-secure-store para guardar o token
- @react-native-community/datetimepicker, @expo/vector-icons e expo-font
- ESLint e Prettier

## Estrutura

```
src/
├── app/          telas e rotas do Expo Router
│   ├── (doador)/     abas e telas do doador
│   └── (receptor)/   abas e telas do receptor
├── components/   componentes reutilizáveis (Botao, Campo, Cartao, ListaPaginada...)
├── contexts/     AuthContext: sessão, login e logout
├── hooks/        carregamento de dados e listas paginadas
├── services/     cliente da API (api.ts) e um serviço por recurso
├── theme/        cores, tipografia e espaçamentos
├── types/        tipos do contrato da API
└── utils/        datas, formatos, validações e mensagens de erro
```

## Como rodar

Pré-requisitos: Node.js 22 ou mais recente e o app Expo Go no celular.

```bash
git clone https://github.com/guicintraa/globalsolutionmobile.git
cd globalsolutionmobile
npm install
cp .env.example .env
npx expo start
```

Leia o QR code com o Expo Go (Android) ou com a câmera (iPhone). O `.env` aponta o app para a API publicada:

```
EXPO_PUBLIC_API_URL=https://gs-sobrabem-java.onrender.com
```

Outros comandos: `npm run lint` (ESLint) e `npm run format` (Prettier).

## Como testar o fluxo completo

1. Cadastre um doador e entre. Crie uma doação usando "Gerar orientação".
2. Saia, cadastre um receptor na mesma cidade do doador e entre.
3. Abra a doação na vitrine, reserve e veja o código em Minhas reservas.
4. Entre de novo como doador, abra "Ver reservas" na doação e confirme a retirada com o código.

## Gerar o APK

```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

O perfil `preview` do `eas.json` gera um APK que já aponta para a API publicada. O `app.config.js` grava o hash do commit no build, e ele aparece em Sobre o App.

## Integração com a API

| Recurso      | Rotas                                                                                                                                                                                   |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Autenticação | `POST /api/auth/registro`, `POST /api/auth/login`, `GET /api/usuarios/me`                                                                                                               |
| Categorias   | `GET /api/categorias`                                                                                                                                                                   |
| Doações      | `GET /api/doacoes`, `GET /api/doacoes/minhas`, `GET`, `PUT` e `DELETE /api/doacoes/{id}`, `POST /api/doacoes`, `PATCH /api/doacoes/{id}/cancelamento`, `GET /api/doacoes/{id}/reservas` |
| Reservas     | `POST /api/reservas`, `GET /api/reservas/minhas`, `PATCH /api/reservas/{id}/cancelamento`, `PATCH /api/reservas/{id}/retirada`                                                          |
| IA           | `POST /api/ia/orientacoes`                                                                                                                                                              |

- Datas: o app envia em ISO com o fuso do aparelho, recebe em UTC e mostra tudo no horário local.
- Erros: cada resposta de erro traz um `codigo` (por exemplo, `SALDO_INSUFICIENTE`), que o app traduz em mensagem; erros de validação aparecem embaixo do campo.
- Os POST de doações e reservas enviam o cabeçalho `Idempotency-Key`, como pede o contrato.
