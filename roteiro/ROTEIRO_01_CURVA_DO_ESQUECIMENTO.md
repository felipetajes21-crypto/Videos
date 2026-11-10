# Roteiro 01: "Amanhã você vai esquecer este vídeo"

**Formato:** vertical 1080×1920, 30 fps, **~35 s**, português do Brasil
**Tema:** a curva do esquecimento (Ebbinghaus, 1885) e a revisão espaçada
**Estilo:** motion design 2.5D baseado nos 3 vídeos de referência (ver [`../analise/`](../analise/)). Pegamos:
- **do V3:** fundo branco-gelo, objeto 3D dentro de medalhão, estrobo, íris e o meta-gancho;
- **do V2:** montagem de época com imagens sépia e a legenda de uma palavra por vez no clímax;
- **do V1:** palavra-chave amarela com brilho que ilumina a cena, e lista com losangos.

---

## 1. Por que esse tema funciona no formato

- **Gancho que provoca o próprio espectador** (como "Tu cerebro va a odiarme"): diz o que vai acontecer com *ele* amanhã.
- **Tem uma história com data** (1885), o que permite a montagem sépia do V2.
- **Tem uma lista de 3 para eliminar** ("não é inteligência, foco, esforço"), igual a "Disciplina / Motivación / Trabajo duro".
- **Tem uma frase final de contraste** ("Não é X, é Y").
- **O fim fecha o loop do começo:** quem salva e revê o vídeo no dia seguinte está aplicando a técnica. Isso favorece salvamentos e replays.

---

## 2. Narração (texto corrido para gravar)

> Amanhã você vai esquecer quase tudo deste vídeo.
> E não é culpa sua.
> Em 1885, um psicólogo alemão decorou listas de sílabas sem sentido… e mediu quanto esquecia.
> O resultado?
> Em um dia, ele já tinha perdido cerca de dois terços.
> E não era falta de inteligência. Nem de foco. Nem de esforço.
> O cérebro apaga o que não se repete.
> Mas existe um atalho: revisar bem na hora em que você está quase esquecendo.
> Um dia depois. Três dias. Uma semana.
> A cada revisão, a memória dura mais.
> Aprender não é ver mais vezes.
> É ver na hora certa.

**~100 palavras ≈ 35 s** a 2,8–3 palavras/s (mesmo ritmo das referências). Tom de documentário, rápido, sem pausas longas. A única pausa de verdade é antes de "O resultado?" (~0,3 s).

**Checagem dos fatos:**
- Hermann Ebbinghaus publicou *Über das Gedächtnis* em 1885. Ele mesmo foi o sujeito do experimento, com sílabas sem sentido.
- Pelo método de "economia" que ele usou, depois de ~24 h restava cerca de 1/3. Por isso o texto diz "**cerca de** dois terços", não um número exato.
- Os intervalos 1 / 3 / 7 dias são um **exemplo** comum de revisão espaçada, não uma regra científica fixa. Por isso a narração não diz "a ciência prova que…".

---

## 3. Paleta, tipografia e regras visuais

| Item | Definição |
|---|---|
| Fundo principal | Branco-gelo `#F2F1F6` com vinheta leve + bolinhas cinzas desfocadas (bokeh) |
| Fundo de virada | Preto `#0B0B0A` (cenas 6–7) |
| Ato de época | Imagens sépia/tungstênio geradas por IA (cena 3) |
| Cor de destaque | **Amarelo `#F5E02A`** com brilho (só nas palavras de peso e no marca-texto) |
| Fonte de ligação | Sans bold (Inter Bold / Helvetica Neue Bold) |
| Fonte de peso | Serifada itálica (Playfair Display Italic / Instrument Serif Italic) |
| Luz | Uma luz suave de **cima/esquerda**. Todas as sombras caem para baixo/direita |
| Sombra dos objetos | Drop shadow: distância 40 px, suavidade 80, opacidade 30 % |
| Câmera | Push-in constante de 100→106 % a cada 2 s em todo plano |
| Entrada de plano | Escala 108→100 % + desfoque 40→0 em 6–8 q, ease-out forte |
| Saída de plano | Escala 100→120 % + subida de 80 px + desfoque vertical, em 4 q, ease-in |
| Palavra de peso | Letra por letra, ~1,5 q por letra, cada letra com desfoque 20→0 |

---

## 4. Decupagem cena a cena

> **q** = quadro a 30 fps. Os tempos são um guia: ajuste cada corte à narração gravada.
> **Peso** = palavra em serifada itálica grande. **Lig.** = palavras de ligação em sans.

### ATO 1: GANCHO (0–3 s)

**Cena 1. "Amanhã você vai esquecer…"** · 0,0–2,0 s (q 0–60)
- **Visual:** um **cérebro 3D realista em tons de cinza** começa **grande e borrado** (q 0) e encolhe até o centro em 4 q. Um disco escuro cresce atrás dele (q 3–6) e vira um medalhão com sombra. Um **arco tracejado** é desenhado em volta (q 4–18) e depois gira (+150°/s). Neurônios desfocados nos cantos.
- **Texto:** Lig. "Amanhã você vai" (cai do canto superior esquerdo) → Peso "**esquecer**" (letra por letra, q 20–32) → Lig. "quase tudo deste vídeo" embaixo do medalhão.
- **Evento sincronizado:** em "esquecer", **pedaços do cérebro se desfazem em partículas** pela borda direita (q 24–40), como areia ao vento. É a metáfora visual do vídeo inteiro.
- **Saída:** zoom + desfoque vertical (q 56–60).
- **Som:** grave de impacto no q 0; som de areia/sopro nas partículas.

**Cena 2. "E não é culpa sua."** · 2,0–3,0 s (q 60–90)
- **Visual:** um painel preto **sobe de baixo** com a borda inclinada (q 60–72) e divide a tela. Em cima, no branco: Lig. "E não é". Embaixo, no preto: Peso "**culpa sua**" em branco.
- **Estrobo:** nos q 80–84, a tela **alterna invertida/normal a cada quadro** (igual ao V3 em "mostrarte").
- **Som:** 5 cliques secos, um por quadro de estrobo.

### ATO 2: A HISTÓRIA (3–10 s)

**Cena 3. "Em 1885…"** · 3,0–5,2 s (q 90–156)
- **Abertura:** **quadro branco** (q 90) → a imagem aparece a partir do branco em 5 q (igual ao V2).
- **Montagem de 5 imagens sépia (IA), ~8 q cada,** com "**1885**" grande, **fixo no centro** e com **preenchimento cromado/vidro azulado**:
  1. rua de paralelepípedo de uma cidade alemã do séc. XIX, com névoa;
  2. fachada de universidade antiga;
  3. escrivaninha com lamparina, livros e pena;
  4. caderno manuscrito com colunas de sílabas ("DAX", "BUP", "ZOL"…);
  5. mão escrevendo com pena, luz de vela.
- **Texto (embaixo de 1885):** Lig. "um psicólogo alemão".
- **Câmera:** cada imagem com push-in leve. O número fica parado enquanto as imagens trocam por baixo.
- **Som:** clique de projetor de slides em cada troca; trilha com corda grave entra aqui.

**Cena 4. "…decorou sílabas sem sentido e mediu quanto esquecia."** · 5,2–7,4 s (q 156–222)
- **Visual:** volta para o branco-gelo. Um **caderno antigo 3D** aberto no centro, de cima, com sombra. Nas páginas, sílabas que **aparecem uma a uma** (DAX · BUP · ZOL · KEF · MIV · LOT…), na fonte serifada.
- **Texto:** Lig. "decorou sílabas" (letra por letra, ~1 q/letra, como no V1) → Peso "**sem sentido**" → Lig. "e mediu quanto".
- **Evento:** em "esquecia" (q 205–220), as sílabas do caderno **começam a desbotar** de baixo para cima, como tinta sumindo.
- **Saída:** **só o texto some** (q 220); o caderno continua no fundo, igual ao V1 no q 261.

**Cena 5. "O resultado?"** · 7,4–8,2 s (q 222–246)
- **Visual:** o caderno desfoca forte no fundo (desfoque dentro do plano, sem corte). No centro, um **card preto arredondado com "?" branco brilhando** cresce de 0 a 100 % em 6 q.
- **Texto:** Lig. "O" + Peso "**resultado?**".
- **Som:** silêncio de 0,3 s antes (**a única pausa do vídeo**) + riser curto.

**Cena 6. "Em um dia… dois terços."** · 8,2–10,4 s (q 246–312)
- **Transição:** o card "?" **cresce até encher a tela** e vira o fundo preto (íris, igual ao V3 q 192–205).
- **Visual:** **gráfico da curva do esquecimento** desenhado em linha branca sobre um grid fino (eixo Y "memória", eixo X "dias"). A linha **despenca** do topo à esquerda (q 260–285, Trim Paths com ease-in). Uma **ampulheta 3D** dourada entra pelo canto superior direito, desfocada.
- **Texto:** Lig. "Em um dia" → números grandes "**⅔**" em sans black (como o "15" do V3) → Peso "**esquecido**" em **amarelo com brilho**, que **ilumina o grid em volta** (como "error" no V1).
- **Evento:** o ponto do gráfico em "1 dia" **pisca em amarelo** quando o número aparece.
- **Som:** "tick" de relógio + whoosh descendente acompanhando a curva.

### ATO 3: QUEBRA DE EXPECTATIVA (10–15 s)

**Cena 7. "Não era falta de…"** · 10,4–13,6 s (q 312–408)
- **Visual:** continua no **fundo preto** (como "Y no… No es" do V3). Topo: Lig. "E não era" + Peso "**falta de**".
- **Lista com losangos (estilo V1):** cada item entra numa **pílula cinza** vindo de baixo, borrado → foco, ~16 q cada:
  - ◇ Inteligência (q 330–346)
  - ◇ Foco (q 352–368)
  - ◇ Esforço (q 374–390)
- O **losango começa vazado** e fica **branco** quando a palavra termina. Depois, uma **linha risca cada item** da esquerda para a direita, em ~8 q (q 392–408).
- **Câmera:** o bloco sobe devagar para abrir espaço para cada item.
- **Som:** "pop" em cada pílula; "risco" de caneta em cada linha.

**Cena 8. "O cérebro apaga o que não se repete."** · 13,6–15,8 s (q 408–474)
- **Transição:** um ponto branco nasce no centro e um **círculo branco se expande** até virar o fundo branco-gelo (íris branca).
- **Visual:** o **cérebro do início** volta para o medalhão, agora com **metade dele em partículas** saindo pela direita.
- **Texto:** Lig. "O cérebro" → Peso "**apaga**" → Lig. "o que não se" → Peso "**repete**" com **marca-texto amarelo** crescendo junto com as letras.
- **Truque de texto:** "apaga" aparece num **retângulo tracejado de seleção**, é riscado e as letras encolhem até sobrar **"_____"** (igual a "cerrar" no V3).

### ATO 4: A REVELAÇÃO (15–27 s)

**Cena 9. "Mas existe um atalho:"** · 15,8–17,6 s (q 474–528)
- **Visual:** a **mão de escultura branca** desce do topo apontando (como no V1). Embaixo, **ondas de radar** e um medalhão com uma **seta curva** (ícone de "atalho") que nasce pequena e cresce. **Um anel duplo pulsa para fora** em "atalho".
- **Texto:** Lig. "Mas existe um" → Peso "**atalho**" em amarelo com brilho e aspas grandes: "**“atalho”**".

**Cena 10. "revisar bem na hora em que você está quase esquecendo."** · 17,6–20,6 s (q 528–618)
- **Visual:** volta o **gráfico da curva**, agora em fundo branco com linha preta. Um **cursor de mouse** entra e **arrasta um marcador amarelo** até o ponto onde a curva está quase no fundo. Ao soltar (clique), **a curva sobe de volta** para o topo.
- **Texto:** Lig. "revisar bem na" → Peso "**hora**" → Lig. "em que você está quase" → Peso "**esquecendo**".
- **Som:** clique de mouse + "swoosh" ascendente quando a curva sobe.

**Cena 11. "Um dia depois. Três dias. Uma semana."** · 20,6–23,6 s (q 618–708)
- **Visual:** a **mesma curva** se repete 3 vezes no gráfico, como dente de serra. A cada revisão, a nova queda fica **mais suave** (ela demora mais para cair). Cada revisão gera um **ponto amarelo com anel pulsando**.
- **Texto (substituição, uma palavra por vez no centro, como "y tomó → una → decisión" do V2):**
  - "**1 dia**" (q 618–648)
  - "**3 dias**" (q 648–678)
  - "**1 semana**" (q 678–708)
  Cada número **substitui** o anterior com um flash de 2 q.
- **Câmera:** a cada número, **snap zoom** de 110→100 % com overshoot leve.
- **Som:** 3 batidas de bumbo, uma por número.

**Cena 12. "A cada revisão, a memória dura mais."** · 23,6–27,0 s (q 708–810)
- **Visual:** a câmera **se afasta** do gráfico (zoom-out lento, igual à abertura do V1) e mostra a curva inteira: a última queda é **quase reta**, lá no alto. O **cérebro volta inteiro** no medalhão: as partículas que tinham saído **voltam voando** e se juntam (o contrário da cena 1).
- **Texto:** Lig. "A cada revisão, a" → Peso "**memória**" → Lig. "dura" + Peso "**mais**" em amarelo com brilho.
- **Som:** som de areia **ao contrário** (reverso da cena 1) + a trilha abre.

### ATO 5: FRASE FINAL (27–35 s)

**Cena 13. "Aprender não é ver mais vezes."** · 27,0–30,6 s (q 810–918)
- **Visual:** fundo branco-gelo limpo. Um **celular 3D gira** no eixo Y (frente → perfil → frente, como no V3, ~30 q) e para mostrando uma tela com o **ícone de replay ↻** girando várias vezes.
- **Texto:** Lig. "Aprender não é" → Peso "**ver mais vezes**". Depois, uma linha **risca** "mais vezes" (q 900–912).

**Cena 14. "É ver na hora certa."** · 30,6–35,0 s (q 918–1050)
- **Visual:** o celular sai com zoom + desfoque. Entra um **relógio 3D** grande no centro. **O ponteiro anda e para** exatamente no topo, e um **anel amarelo pulsa** quando ele para (q 980).
- **Texto:** Lig. "É ver na" → Peso "**hora certa**" (amarelo, com brilho, maior palavra do vídeo).
- **Último segundo (q 1020–1050):** embaixo, pequeno e em sans: "salva e revê amanhã ↻". Sem narração. É o único CTA, e ele é a própria técnica.
- **Fim:** **sem fade-out**. O último quadro corta seco, para o loop voltar a "Amanhã você vai esquecer…".
- **Som:** "ding" curto na parada do ponteiro; a trilha corta junto com o vídeo.

---

## 5. Mapa de ritmo

| Ato | Tempo | Planos | Função | Fundo |
|---|---|---|---|---|
| 1. Gancho | 0–3 s | 2 | Provocação + "não é culpa sua" | Branco → branco/preto + estrobo |
| 2. História | 3–10 s | 4 (+5 imagens na montagem) | Data, experimento, micro-gancho "O resultado?" | Sépia → branco → preto |
| 3. Quebra | 10–16 s | 2 | Lista de 3 eliminada + causa | Preto → branco (íris) |
| 4. Revelação | 16–27 s | 4 | Atalho, prova visual, intervalos | Branco |
| 5. Frase final | 27–35 s | 2 | Contraste "não é X, é Y" + loop | Branco |

**Total:** 14 cenas + 5 imagens de montagem ≈ **1 mudança grande a cada ~1,5 s**, dentro da faixa das referências (0,95–1,6 s). Dentro de cada cena, cada palavra nova é um micro-evento.

**Micro-ganchos para segurar a atenção:** "E não é culpa sua" (3 s) · "O resultado?" (7,5 s) · "Mas existe um atalho" (16 s) · gráfico subindo de volta (20 s).

---

## 6. Lista de assets

### Objetos 3D (PNG com fundo transparente, luz de cima/esquerda, em tons de cinza exceto onde indicado)
| Asset | Cenas | Observação |
|---|---|---|
| Cérebro realista | 1, 8, 12 | Também uma versão em **partículas** (desintegrando para a direita) |
| Neurônios (2–3) | 1 | Para os cantos, desfocados |
| Caderno antigo aberto, visto de cima | 4, 5 | Páginas lisas: as sílabas entram como texto animado |
| Ampulheta dourada | 6 | Canto superior direito, desfocada |
| Mão de escultura branca apontando para baixo | 9 | Igual à do V1 |
| Celular moderno (sequência de giro ou modelo 3D) | 13 | Tela branca para receber o ícone ↻ |
| Relógio de ponteiro, mostrador claro | 14 | O ponteiro em camada separada para animar |

### Imagens de época (cena 3), prompts para gerador de imagem
Todos em proporção **9:16**, estilo foto realista:
1. `cobblestone street in a 19th century German city, 1885, early morning fog, gas lamps, sepia tones, tungsten light, cinematic, film grain, vertical 9:16`
2. `facade of an old European university building, 1880s, overcast sky, sepia, cinematic photograph, film grain, vertical 9:16`
3. `wooden desk in a 19th century study, oil lamp glowing, stacks of old books, quill and ink, warm tungsten light from the left, dark shadows, sepia, cinematic, vertical 9:16`
4. `close-up of an old handwritten notebook with columns of short nonsense syllables, ink on aged paper, candle light, shallow depth of field, sepia, vertical 9:16`
5. `hand holding a quill writing in a notebook by candlelight, 1880s, warm light, deep shadows, sepia, cinematic, film grain, vertical 9:16`

### Elementos 2D (feitos no After Effects ou no CapCut)
- Medalhão escuro + arco tracejado (cenas 1, 8, 12)
- Grid fino + gráfico da curva do esquecimento (cenas 6, 10, 11, 12)
- Pílulas cinzas com losango (cena 7)
- Card "?" (cena 5)
- Ondas de radar + anel duplo (cenas 9, 11, 14)
- Cursor de mouse (cena 10)
- Retângulo tracejado de seleção (cena 8)

### Som
- **Trilha:** cinematográfica/ambiente tensa no começo, que abre na cena 12. Contínua, sem silêncio, exceto a pausa de 0,3 s antes de "O resultado?".
- **Efeitos:** impacto grave, areia/sopro (e reverso), cliques de estrobo, projetor de slides, "pop", risco de caneta, clique de mouse, whoosh subindo e descendo, tick de relógio, bumbo ×3, ding final, riser.
- **Mixagem:** master alto e comprimido (média de −16 a −19 dB, pico em −1 dB), como nas referências.

---

## 7. Ordem de produção sugerida

1. **Gravar a narração** (ou gerar com voz sintética) e cortar as respirações.
2. **Gerar legendas com tempo por palavra.** Elas definem o tempo exato de cada palavra de peso.
3. Ajustar os cortes da seção 4 ao áudio real.
4. Gerar/baixar os assets da seção 6 e padronizar a luz e a sombra de todos.
5. Montar cena por cena, com as entradas, saídas e push-ins da seção 3.
6. Fazer os eventos sincronizados (partículas, desbotar, curva subindo, ponteiro).
7. Colocar efeitos sonoros em **todo** evento visual.
8. Revisar com o checklist abaixo.

### Checklist final
- [ ] O gancho termina em ≤ 2 s
- [ ] O quadro 0 já está em movimento (cérebro encolhendo)
- [ ] Algo muda na tela a cada ≤ 1,5 s
- [ ] Toda frase tem uma palavra de peso (serifada, grande)
- [ ] O amarelo só aparece nas palavras de peso e no marca-texto
- [ ] Todas as sombras na mesma direção
- [ ] Lista de 3 (cena 7) e micro-gancho "O resultado?" (cena 5)
- [ ] Final em contraste "não é X, é Y", com corte seco para o loop
- [ ] Revisão ortográfica de todos os textos da tela (as referências tinham erros: "Steave", "Demaciados")

---

## 8. Ganchos alternativos (para teste A/B)

1. "Amanhã você vai esquecer quase tudo deste vídeo." *(usado)*
2. "Você esquece dois terços do que aprende em 24 horas."
3. "Existe um jeito de estudar que faz você lembrar por anos. E quase ninguém usa."
