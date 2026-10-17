# Conteúdo do FinHer

Tudo nesta pasta é texto simples. Dá para editar pelo site do GitHub (abra o arquivo, clique no lápis, salve). Não precisa programar. O site usa as mudanças na próxima publicação.

Cada arquivo tem duas partes:

1. **O cabeçalho**, entre as duas linhas `---`. Guarda configurações curtas, como título e ordem. Mantenha o mesmo formato dos exemplos: `nome: valor`, e listas com dois espaços de recuo.
2. **O corpo**, abaixo, em Markdown (`## Título`, `- item`, `**negrito**`, `[texto do link](https://...)`).

Arquivos que começam com `_` são modelos e não aparecem no site.

> **Atenção no cabeçalho:** se um texto tiver dois-pontos seguidos de espaço (`: `), coloque o texto entre aspas. Exemplo: `summary: "Cuida das finanças: orçamento e caixa."`. Se o cabeçalho tiver um erro, aquele arquivo não aparece no site até ser corrigido.

| Pasta | O que tem |
|---|---|
| `areas/` | Guias das áreas do mercado (Visão geral e Educação) |
| `institutions/` | Empresas e iniciativas, só com informações públicas e fontes (Visão geral) |
| `navigator/` | Situações do Navegador de desafios (Trajetórias) |
| `family/` | Fases do guia Carreira e família (Trajetórias) |
| `stories/` | Histórias reais de entrevistas e histórias ilustrativas (Trajetórias) |
| `legal/` | Onde buscar ajuda, um arquivo por país |

## Regras para todos os arquivos

- **Tom:** empoderador, direto e acolhedor. Reconheça o desafio e vá para a ação. Sem vitimização, sem estereótipos, sem tom condescendente.
- **Inteligência emocional** é uma habilidade que qualquer pessoa desenvolve. Nunca diga que mulheres são naturalmente mais emocionais ou intuitivas.
- **Nunca suponha** que a leitora é ou quer ser mãe.
- **Fatos com fonte.** Informações sobre empresas, leis e certificações precisam de link para a fonte oficial. Atualize a data `reviewed:` sempre que conferir.
- **Informações jurídicas** só dentro das seções `## País: BR` ou `## País: US`, sempre gerais (nada de orientação para um caso específico).
- **Pessoas reais** só com consentimento por escrito (veja `docs/kit-entrevistas.md`). Nunca invente ou adapte falas.

## Situação do Navegador (`navigator/*.md`)

```
---
id: id-curto-com-hifens   # nunca mude depois de publicado (situações salvas apontam para ele)
order: 1
area: voice               # voice, pay, credit, advancement ou network
title: Ser interrompida em reuniões
summary: Uma frase para o card.
legal: false              # true mostra o aviso jurídico e a ajuda por país
questions:
  - id: who
    text: Quem costuma te interromper?
    options:
      - value: peer
        label: Um colega
      - value: senior
        label: Alguém mais sênior
---

## Diagnóstico
Texto que todas veem.

### Se: senior
Parágrafo que só aparece quando a resposta "senior" foi escolhida. Dá para listar várias: `### Se: senior, pattern`.

## Opção: Nome da estratégia
O que fazer.

Melhor quando: peer, once
Prós e contras: O que custa e o que arrisca.

## Frases prontas
- "Uma frase que ela pode usar."

## Transforme em vantagem
Como isso vira um ponto forte.
```

As opções aparecem em ordem: primeiro a que mais combina com as respostas (`Melhor quando`).

## Fase de Carreira e família (`family/*.md`)

Cabeçalho: `id`, `order`, `title`, `summary`, `reviewed` (data da última conferência das partes jurídicas, `AAAA-MM-DD`).

Corpo: quaisquer `## Seções`, mais:

- `## Checklist` com linhas `- item`. Mudar o texto de um item zera a marcação dele, então evite mexer.
- `## País: BR` / `## País: US` com as informações jurídicas e as fontes.

## Guia de área (`areas/*.md`)

Cabeçalho: `id` (um destes: research, assetManagement, investmentBanking, trading, privateEquity, wealthManagement, corporateFinance, riskCompliance, fintech), `order`, `title`, `summary`. Corpo com `## Seções`.

## Empresa ou iniciativa (`institutions/*.md`)

Cabeçalho: `id`, `name`, `reviewed` e `sources` (lista com `label` e `url`). Só informações públicas, sempre com fonte. O site mostra automaticamente o aviso de que o FinHer não tem vínculo com a empresa.

## História (`stories/*.md`)

- **Entrevistas reais:** copie `stories/_modelo-entrevista.md`. Só aparecem no site com `consent: true`.
- **Histórias ilustrativas:** `kind: composite` ou `kind: illustrative`. O site mostra que não são pessoas reais.
