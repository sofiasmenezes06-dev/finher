# FinHer

Plataforma educativa para apoiar, informar e conectar mulheres que querem entrar, permanecer ou crescer no mercado financeiro. Projeto acadêmico independente. Não faz operações, não guarda dinheiro e não recomenda investimentos.

**Seções:** Visão geral, Educação, Comunidade (em breve) e Trajetórias. O idioma padrão é português do Brasil.

## Rodar

```bash
npm install
npm run dev
```

Sem as chaves do Supabase, o app roda em **modo de demonstração**: contas e respostas ficam só no navegador (localStorage).

## Conectar o Supabase

1. Crie um projeto e rode os arquivos de `supabase/migrations/` em ordem (editor SQL ou `supabase db push`).
2. Copie `.env.example` para `.env.local` e preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.

## Estrutura

| Caminho | O que é |
|---|---|
| `content/` | Conteúdo editável sem programar: guias de áreas, empresas, Navegador de desafios, Carreira e família, histórias, ajuda por país. Veja `content/README.md` |
| `docs/kit-entrevistas.md` | Roteiro, termo de consentimento (modelo) e checklist para as histórias reais |
| `src/i18n/pt-BR.ts` | Todo o texto da interface |
| `src/index.css` | Cores, fontes e estilos base (claro e escuro) |
| `src/lib/path-engine.ts` | Respostas do cadastro → próximos passos, trilhas, guias e conexões |
| `src/content/loader.ts` | Lê `content/` na hora da publicação |
| `src/content/catalog.ts` | Trilhas e perfis/grupos de exemplo (fictícios) |
| `src/lib/backend` | Supabase e modo de demonstração |
| `supabase/migrations` | Banco de dados e regras de acesso (cada usuária só vê os próprios dados) |
| `npm run build:artifact` | Versão de arquivo único para compartilhar como página hospedada |
