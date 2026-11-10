# PÂMELA BOCCALETTI | Imóveis em Alphaville/SP · Atendimento Exclusivo

Site institucional imobiliário de alto padrão desenvolvido para **Pâmela Boccaletti**, com foco em imóveis residenciais nos principais condomínios de Alphaville (Alpha Vita, Jardins de Tamboré, etc.).

Totalmente integrado ao **Firebase Firestore** para persistência e reatividade em tempo real, **Firebase Authentication** com controle de acesso baseado em papéis (RBAC), e formulários inteligentes de solicitação de visitas.

---

## 1. Arquitetura e Tecnologias
- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Motion (Framer Motion v12), Lucide Icons.
- **Banco de Dados em Tempo Real**: Google Cloud Firestore (Enterprise Edition provisionado via Firebase Applet).
- **Autenticação**: Firebase Authentication com Google Identity Provider.
- **Segurança**: Firestore Security Rules v2 com regras ABAC, validações de schema estritas, proteção anti-injeção de IDs e isolamento de PII.
- **Design System**: Tipografia editorial (*Cormorant Garamond* e *Plus Jakarta Sans*), paleta em verde floresta/oliva, areia e ouro envelhecido, disciplina anti-AI slop (sem cápsulas de metadata estáticas).

---

## 2. Estrutura do Banco de Dados Firestore

| Coleção | Documentos | Permissões de Leitura | Permissões de Escrita |
|---|---|---|---|
| `properties` | Dados dos imóveis (`id`, `title`, `price`, `condominiumName`, `areaM2`, etc.) | Público (`status == 'published'`) / Admin (todos) | Somente Administrador |
| `leads` | Solicitações de visita e contatos de clientes | Somente Administrador | Público (criação com schema validado) |
| `siteSettings` | Configurações globais (`siteSettings/global`), contatos oficiais e bio | Público | Somente Administrador |
| `landingPages` | Campanhas específicas (`/oportunidade/alpha-vita`, etc.) | Público (`status == 'published'`) | Somente Administrador |
| `admins` | Registro de UIDs autorizados como administradores | Somente Administrador | Somente Administrador |

---

## 3. Segurança e Regras do Firestore (`firestore.rules`)
As regras foram construídas seguindo os 8 pilares de segurança de regras endurecidas:
1. **Default Deny Global**: Todas as rotas não mapeadas são negadas por padrão (`allow read, write: if false;`).
2. **Isolamento de PII**: A coleção de `leads` só permite leitura por administradores autenticados com verificação de e-mail.
3. **Validação Estrita de Schemas**: Helpers dedicados (`isValidProperty`, `isValidLead`, `isValidSiteSettings`, `isValidLandingPage`) verificam tipos, comprimentos máximos e listas de valores permitidos.
4. **Proteção de ID de Documento**: Função `isValidId(id)` garante conformidade com regex e impede IDs maliciosos.
5. **Bootstrapped Admin**: A conta inicial de administrador é vinculada com segurança ao e-mail de desenvolvimento verificado (`juniorwebcode@gmail.com`).

---

## 4. Como Executar Localmente

### Pré-requisitos
- Node.js 20+ ou 22+
- npm ou bun

### Instalação e Execução
```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento (Porta 3000)
npm run dev

# 3. Compilar para produção
npm run build
```

---

## 5. Como Acessar o Painel Administrativo
1. No rodapé do site público (ou no ícone discreto de cadeado no menu superior), clique em **"Painel Admin"**.
2. Faça login com a conta Google de administrador (`juniorwebcode@gmail.com`).
3. Uma vez conectado, você poderá:
   - Cadastrar, editar ou excluir imóveis.
   - Sincronizar os imóveis de referência iniciais com 1 clique.
   - Gerenciar solicitações de visitas e leads em tempo real.
   - Configurar WhatsApp oficial, telefone comercial e número de CRECI.
