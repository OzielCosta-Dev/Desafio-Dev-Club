# 🕒 Barbearia DevClub — Sistema de Agendamento de Serviços

Projeto fullstack desenvolvido como solução para o **desafio técnico do DevClub**. A aplicação é um sistema de agendamento estilizado como "Barbearia DevClub", contendo uma área dedicada ao cliente para realizar marcações e um painel administrativo para gerenciar os agendamentos em tempo real.

🔗 **Repositório:** `<cole aqui o link público do GitHub>`
🔗 **Aplicação em produção:** `<cole aqui o link do deploy>`

---

## 🚀 Funcionalidades

### 👤 Área do Cliente
- **Formulário de agendamento:** coleta nome, telefone, serviço, data e horário.
- **Consulta de horários dinâmica:** a API retorna apenas os horários disponíveis para a data selecionada, impedindo a escolha de horários já ocupados.
- **Confirmação visual:** feedback claro de sucesso ou erro ao agendar.

### 👨‍💼 Área do Administrador (Dashboard)
- **Visualização centralizada:** tabela responsiva com todos os agendamentos e dados dos clientes.
- **Status coloridos:** badges para os quatro estados do desafio — *Agendado*, *Confirmado*, *Concluído* e *Cancelado*.
- **Ações em tempo real:** botões para confirmar, concluir ou cancelar um agendamento, refletindo a mudança no banco instantaneamente via `PUT`.
- **Alternância simples:** toggle no topo para trocar entre a visão do cliente e a do administrador sem recarregar a página.

---

## 🛠️ Tecnologias Utilizadas

**Backend**
- Node.js + Express
- Prisma ORM
- PostgreSQL
- JavaScript (ES6+)

**Frontend**
- React (Vite)
- Tailwind CSS v4
- Axios (comunicação com a API)
- ESLint

---

## 🤖 Ferramentas de IA Utilizadas

- **Google Gemini** — apoio na estruturação inicial do projeto (backend com Prisma/Express e lógica de agendamento no frontend).
- **Claude (Anthropic)** — apoio na estilização da interface (identidade visual "Barbearia DevClub" em Tailwind CSS), na divisão da área Cliente/Admin dentro do mesmo componente, e na depuração de erros de sintaxe JSX e de um aviso do ESLint sobre `setState` dentro de `useEffect`.

A IA foi usada como apoio de produtividade e revisão — toda a lógica foi compreendida, testada e ajustada manualmente antes da entrega.

---

## 📦 Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- [PostgreSQL](https://www.postgresql.org/) (ou outra instância de banco ativa)
- `npm` (já vem com o Node)

---

## 🔧 Como Executar o Projeto Localmente

### 1. Clonar o repositório
```bash
git clone <link-do-repositorio>
cd desafio-devclub
```

### 2. Configurar e rodar o Backend
```bash
cd backend
npm install
```

Crie um arquivo `.env` na pasta `backend/` com a variável:
```
DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/NOME_DO_BANCO?schema=public"
```

Rode as migrações do Prisma:
```bash
npx prisma migrate dev
```

Inicie o servidor:
```bash
npm run dev
```
O backend sobe por padrão em `http://localhost:5000`.

### 3. Configurar e rodar o Frontend
Em outro terminal:
```bash
cd frontend
npm install
npm run dev
```
O frontend sobe por padrão em `http://localhost:5173`.

### 4. Acessar
Abra `http://localhost:5173` no navegador. A área do cliente e a área administrativa estão na mesma aplicação, acessíveis pelo botão de alternância no topo.

---

## 🔑 Credenciais de Acesso

No momento, **não há autenticação implementada** — tanto a área do cliente quanto a área administrativa têm acesso livre, sem login. A implementação de uma tela de login para restringir o acesso ao painel administrativo está listada como melhoria futura (veja abaixo).

---

## 🧠 Decisões Técnicas

- **Um único componente `App.jsx` com abas (Cliente/Admin):** optei por controlar a visão ativa com um estado (`activeTab`) em vez de usar rotas, já que o desafio pede uma aplicação simples e direta, sem necessidade de navegação por URL.
- **Prisma + PostgreSQL:** escolhido pela tipagem e migrações versionadas, facilitando manter a consistência do schema de agendamentos (cliente, serviço, data, horário e status).
- **Validação de horários no backend:** a disponibilidade de horários é calculada no servidor (não apenas no frontend), evitando que dois clientes agendem o mesmo horário por uma condição de corrida.
- **Tailwind CSS v4:** a estilização usa a nova sintaxe `@theme` no CSS para declarar a paleta de cores customizada (preto + verde neon), inspirada na identidade visual do DevClub, sem depender apenas do `tailwind.config.js` tradicional.
- **Sem biblioteca de gerenciamento de estado externo:** por ser uma aplicação de porte pequeno/médio, os hooks nativos do React (`useState`, `useEffect`, `useCallback`) foram suficientes, evitando complexidade desnecessária.

---

## 📁 Estrutura do Projeto

```
desafio-devclub/
├── backend/                  # Servidor Node/Express
│   ├── prisma/               # Schema e migrações do Prisma
│   ├── src/                  # Rotas e controllers
│   ├── .env                  # Variáveis de ambiente (não versionado)
│   └── package.json
│
└── frontend/                 # Interface React
    ├── src/
    │   ├── App.jsx            # Componente principal (Cliente + Admin)
    │   ├── index.css          # Importações e tema do Tailwind CSS
    │   └── main.jsx           # Ponto de entrada do React
    ├── postcss.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## 🔮 Melhorias Futuras

- [ ] Tela de login para restringir o acesso à área administrativa
- [ ] Filtro de agendamentos por data no painel admin
- [ ] Paginação da tabela de agendamentos
- [ ] Notificação por e-mail/WhatsApp ao cliente na confirmação do agendamento

---

## 👨‍💻 Autor

**Oziel Costa**
Desenvolvedor Full Stack Júnior
[LinkedIn](http://linkedin.com/in/ozielcosta) · [GitHub](http://github.com/OzielCosta-Dev)