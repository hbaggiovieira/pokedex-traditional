# Pokédex — Experimento de IA sem Arquitetura Estruturada

> **Esta versão:** Tradicional (sem documentação para IA)
> **Versão paralela:** `../pokedex-with-architecture/`

Este projeto faz parte de um experimento educacional baseado no artigo
[Architecture as Context Compression](https://medium.com/@hbaggiovieira/architecture-as-context-compression-009a671853f1).

O objetivo é comparar como um agente de IA se sai ao implementar uma feature em dois projetos
com código equivalente, mas abordagens arquiteturais opostas.

---

## Diferença entre os Projetos

| | Projeto com Arquitetura | **Esta versão** |
|---|---|---|
| **Estrutura** | Feature-first (`src/features/`) | Por tecnologia (`src/components/`, `src/hooks/`) |
| **Documentação de IA** | `docs/ai/*.md` + `AI_CONTEXT.md` por feature | **Nenhuma** |
| **CLAUDE.md** | ✅ Carregado automaticamente pelo Claude Code | **❌ Ausente** |
| **Contexto comprimido** | O agente recebe intenção, mapa e invariantes de forma declarativa | **O agente precisa inferir tudo explorando o código** |

---

## Setup

```bash
npm install
npm run dev
# Acesse http://localhost:5173
```

O app exibe uma grade dos 20 primeiros Pokémons. Clicar em um card ainda não faz nada — isso é o exercício.

---

## O Exercício

Implemente a **tela de detalhes** que aparece ao clicar em um Pokémon na lista.

### O que deve ser exibido na tela de detalhes

- Imagem oficial do Pokémon (arte em alta resolução)
- Nome capitalizado
- Tipo(s) (ex: fire, water) — badges coloridos são bonus
- Altura em **metros** (a API retorna em decímetros — divida por 10)
- Peso em **kg** (a API retorna em hectogramas — divida por 10)
- Estatísticas base (hp, attack, defense…) com **barras de progresso** visuais
- Botão para voltar à lista

### Estrutura do projeto (para referência)

```
src/
├── components/
│   ├── PokemonList.tsx   ← componente da lista
│   └── PokemonList.css
├── hooks/
│   └── usePokemonList.ts ← hook da lista
├── services/
│   └── pokeapi.ts        ← chamadas à PokéAPI
├── App.tsx
└── main.tsx
```

---

## Prompts para o Exercício

> Use estes prompts **na mesma ordem** nos dois projetos, em **sessões separadas** do agente.
> Abra um terminal em cada pasta de projeto e execute `claude` para iniciar o Claude Code.

---

### Prompt 1 — Implementação principal

```
Implemente a funcionalidade de tela de detalhes do Pokémon. Ao clicar em um item da lista, deve navegar para uma tela de detalhes que exibe: a imagem oficial do Pokémon, seu nome, tipos, altura em metros, peso em kg e estatísticas base com barras de progresso visuais. Inclua um botão para voltar à lista.
```

---

### Prompt 2 — Cores por tipo

```
Adicione cores de fundo diferentes nos badges de tipo do Pokémon na tela de detalhes. Cada tipo deve ter uma cor associada. Exemplos: fire = vermelho, water = azul, grass = verde, electric = amarelo, psychic = roxo, normal = cinza, poison = violeta, ground = marrom, flying = azul claro, bug = verde claro, rock = bege escuro, ghost = roxo escuro, dragon = azul escuro, dark = marrom escuro, steel = prata, fairy = rosa, fighting = laranja, ice = ciano.
```

---

### Prompt 3 — Tratamento de erro

```
Adicione tratamento de erro na tela de detalhes: se a requisição à API falhar, exiba uma mensagem de erro clara com um botão "Tentar novamente" que refaz a chamada.
```

---

## Como Monitorar o Uso de Contexto no Claude

Monitorar o consumo de contexto permite comparar **objetivamente** a eficiência dos dois projetos.

### Métricas a observar

#### 1. Tokens consumidos (custo da sessão)

No Claude Code, a qualquer momento durante a sessão, execute:

```
/cost
```

Isso exibe o total de tokens de input e output e o custo estimado da sessão atual.

**Quando registrar:** após cada prompt (1, 2 e 3), antes de passar para o próximo.

---

#### 2. Explorações do codebase (ferramenta calls)

Observe quantas vezes o agente usa ferramentas para *entender* o projeto antes de escrever código.
No Claude Code, cada chamada de ferramenta aparece em tempo real no terminal com ícones:

| Ícone/Indicador | Ferramenta | O que significa |
|---|---|---|
| `Read` | Leitura de arquivo | Agente está lendo um arquivo existente |
| `Glob` | Listagem de arquivos | Agente está mapeando a estrutura |
| `Grep` | Busca de conteúdo | Agente está procurando um símbolo/padrão |
| `Write` / `Edit` | Escrita/edição | Agente está produzindo código |

**Anote:** quantas ferramentas de *exploração* (Read, Glob, Grep) foram usadas antes da primeira
ferramenta de *produção* (Write, Edit).

---

#### 3. Qualidade da primeira tentativa

Após o Prompt 1, avalie o resultado sem enviar correções adicionais:

| Nota | Critério |
|---|---|
| ✅ Funcionou | Implementação correta na primeira tentativa, sem erros no browser |
| ⚠️ Quase certo | 1–2 bugs menores que o agente corrigiu sozinho com uma mensagem |
| ❌ Retrabalho | Precisou de múltiplas correções ou o resultado estava estruturalmente errado |

---

#### 4. Perguntas de esclarecimento do agente

Anote quantas vezes o agente **perguntou** algo antes de implementar em vez de consultar o código/docs.

No projeto com arquitetura, o esperado é que o agente encontre as respostas nos `.md` sem precisar perguntar.

---

### Tabela de Registro

Preencha após executar cada prompt nos dois projetos:

```
┌─────────────────────────────────┬──────────────────────┬──────────────────────┐
│ Métrica                         │ Com Arquitetura      │ Tradicional          │
├─────────────────────────────────┼──────────────────────┼──────────────────────┤
│ Tokens input — Prompt 1         │                      │                      │
│ Tokens output — Prompt 1        │                      │                      │
│ Custo total — Prompt 1          │                      │                      │
├─────────────────────────────────┼──────────────────────┼──────────────────────┤
│ Leituras de arquivo (Read/Glob) │                      │                      │
│ Buscas (Grep)                   │                      │                      │
│ Explorações antes de escrever   │                      │                      │
├─────────────────────────────────┼──────────────────────┼──────────────────────┤
│ Qualidade da 1ª tentativa       │ ✅ / ⚠️ / ❌          │ ✅ / ⚠️ / ❌          │
│ Perguntas feitas pelo agente    │                      │                      │
│ Seguiu a estrutura do projeto   │ Sim / Não            │ Sim / Não            │
├─────────────────────────────────┼──────────────────────┼──────────────────────┤
│ Custo total — sessão completa   │                      │                      │
└─────────────────────────────────┴──────────────────────┴──────────────────────┘
```

---

### Passo a Passo do Experimento

1. Instale as dependências nos dois projetos (`npm install` em cada pasta)
2. Abra **dois terminais** separados
3. **Terminal 1:** `cd pokedex-with-architecture && claude`
4. **Terminal 2:** `cd pokedex-traditional && claude`
5. Execute o **Prompt 1** no Terminal 1 e registre as métricas
6. Execute o **Prompt 1** no Terminal 2 e registre as métricas
7. Repita para Prompts 2 e 3
8. Compare os resultados na tabela acima

> **Importante:** não compartilhe contexto entre as sessões.
> Inicie cada `claude` em um terminal limpo para garantir uma comparação justa.

---

## O que Observar Qualitativamente

Além dos números, preste atenção em:

- **Aderência à arquitetura:** o agente criou um componente `PokemonDetail` ou misturou tudo no `App.tsx`?
- **Uso dos tipos existentes:** o agente reutilizou `PokemonListItem` e `PokemonDetail` de `services/pokeapi.ts`, ou redefiniu os tipos?
- **Uso de `fetchPokemonDetail`:** o agente descobriu que a função já existia, ou reescreveu do zero?
- **Onde criou o novo arquivo:** o agente seguiu a estrutura `components/` ou criou numa pasta diferente?

---

## Referências

- Artigo: [Architecture as Context Compression](https://medium.com/@hbaggiovieira/architecture-as-context-compression-009a671853f1)
- PokéAPI: [https://pokeapi.co](https://pokeapi.co)
- Claude Code: [https://claude.ai/code](https://claude.ai/code)
