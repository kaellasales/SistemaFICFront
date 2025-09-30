# MatriFIC - Frontend

Sistema de Inscrição em Cursos FIC - Interface do Usuário

## 🚀 Tecnologias

- **React 18** - Biblioteca para interfaces de usuário
- **TypeScript** - Superset tipado do JavaScript
- **Vite** - Build tool moderna e rápida
- **Tailwind CSS** - Framework CSS utilitário
- **React Router** - Roteamento para React
- **Zustand** - Gerenciamento de estado
- **Axios** - Cliente HTTP
- **Lucide React** - Ícones

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn

## 🛠️ Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
cd frontend
npm install
```

## 🚀 Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:5173`

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── layout/         # Layout (Header, Sidebar, etc.)
│   │   └── ui/             # Componentes de UI (Button, Input, etc.)
│   ├── pages/              # Páginas da aplicação
│   │   ├── auth/           # Páginas de autenticação
│   │   ├── admin/          # Páginas administrativas
│   │   ├── courses/        # Páginas de cursos
│   │   └── ...
│   ├── shared/             # Código compartilhado
│   │   ├── components/     # Componentes compartilhados
│   │   ├── hooks/          # Hooks customizados
│   │   ├── services/       # Serviços (API, autenticação)
│   │   ├── stores/         # Estado global (Zustand)
│   │   ├── types/          # Definições TypeScript
│   │   └── utils/          # Utilitários
│   ├── App.tsx             # Componente principal
│   └── main.tsx            # Ponto de entrada
├── public/                 # Arquivos estáticos
├── package.json            # Dependências e scripts
└── vite.config.ts          # Configuração do Vite
```

## 🎯 Funcionalidades Implementadas

### ✅ Autenticação
- Login/Logout
- Registro de alunos e professores
- Proteção de rotas
- Gerenciamento de estado de autenticação

### ✅ Dashboard por Perfil
- **Alunos**: Dashboard com cursos, inscrições e certificados
- **Professores**: Dashboard específico com "Meus Cursos"
- **Administradores**: Dashboard completo com gerenciamento

### ✅ Sistema de Matrícula
- Formulário multi-etapas (5 etapas)
- Validação de campos
- Upload de documentos
- Integração com API

### ✅ Gerenciamento de Cursos (Professores)
- Visualizar cursos próprios
- Criar novos cursos
- Editar cursos existentes
- Gerenciar matrículas

### ✅ Interface Responsiva
- Design moderno com Tailwind CSS
- Layout adaptável
- Componentes reutilizáveis

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview do build
- `npm run lint` - Executa linter
- `npm run lint:fix` - Corrige problemas de lint

## 🌐 Configuração da API

O frontend está configurado para se conectar com a API backend. A URL base é configurada em:

```typescript
// src/shared/services/api.ts
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
```

## 📱 Páginas Disponíveis

### Públicas
- `/` - Landing page
- `/login` - Login
- `/register` - Registro de aluno
- `/register/professor` - Registro de professor

### Protegidas
- `/dashboard` - Dashboard geral
- `/professor-dashboard` - Dashboard do professor
- `/courses` - Lista de cursos
- `/my-courses` - Cursos do professor
- `/enrollments` - Inscrições do aluno
- `/enrollment` - Processo de matrícula
- `/certificates` - Certificados
- `/reports` - Relatórios
- `/users` - Gerenciamento de usuários (admin)

## 🎨 Design System

### Cores
- **Primária**: Verde (#16a34a)
- **Secundária**: Cinza (#6b7280)
- **Sucesso**: Verde (#10b981)
- **Erro**: Vermelho (#ef4444)

### Componentes
- Botões com variantes (primary, secondary, outline)
- Inputs com validação
- Cards responsivos
- Modais
- Navegação lateral

## 🔐 Autenticação

O sistema usa JWT para autenticação. O token é armazenado no localStorage e enviado automaticamente nas requisições.

### Mock de Login
Para desenvolvimento, o sistema inclui mocks de login:
- `joao@ifce.edu.br` - Professor
- `admin@example.com` - Administrador
- Qualquer email com `@ifce.edu.br` - Professor

## 📦 Build de Produção

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/` e podem ser servidos por qualquer servidor web estático.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.