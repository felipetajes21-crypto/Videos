# Análise quadro a quadro: 3 vídeos de referência (estilo "motion typography 3D")

Formato dos 3 vídeos: vertical 1080×1920, 30 fps, 20 s, 31 s e 37 s. Idioma espanhol (narração + texto na tela).
As folhas de quadros (1 quadro a cada 0,5 s, com timestamp) estão em [`quadros/`](quadros/).
Análise de movimento com **todos os quadros** (30 fps): [`QUADRO_A_QUADRO.md`](QUADRO_A_QUADRO.md).

| # | Duração | Tema | Paleta | Arquivo de quadros |
|---|---|---|---|---|
| V1 | 19,8 s | "El mayor error que te enseñaron sobre hacerse rico" | Preto + dourado/amarelo + laranja | `video1_sheet_01..02.jpg` |
| V2 | 31,0 s | Apple em 1997: virada de Steve Jobs | Começa sépia/escuro, vira branco P&B | `video2_sheet_01..03.jpg` |
| V3 | 37,5 s | "Tu cérebro va a odiarme…" (loops abertos / retenção) | Branco-gelo + preto + um toque de cor | `video3_sheet_01..04.jpg` |

---

## 1. O que define o estilo (resumo em uma frase)

**Não é vídeo filmado: é tudo motion design 2.5D.** A narração é escrita na tela palavra por palavra (tipografia cinética), e cada frase ganha **um único objeto 3D realista** (moeda, cérebro, cadeado, ampulheta, celular) que flutua sobre um fundo liso, com sombra suave e profundidade de campo. A "câmera" é virtual: push-ins, parallax e whip-pans feitos no After Effects (ou similar).

---

## 2. Camadas do vídeo (de trás para frente)

Toda cena repete a mesma pilha de camadas:

1. **Fundo liso com gradiente radial.** Preto/carvão com vinheta (V1) ou branco-gelo `#F2F1F6` com leve vinheta (V2, V3). Nunca é chapado: tem um "centro de luz".
2. **Textura gráfica de apoio.** Grade fina (grid de papel milimetrado, V1/V2), linhas curvas que cruzam a tela em X (V1/V2), bolinhas cinzas desfocadas tipo bokeh (V2/V3), anéis concêntricos (radar) atrás de ícones.
3. **Objetos 3D de canto, desfocados (foreground/background).** Ex.: câmeras fotográficas nos cantos (V3 25 s), claquetes (V3 35 s), globos (V2 14 s), cadeados (V3 22 s), relógios (V3 30 s). Ficam **cortados pela borda** e com blur forte: criam profundidade e "molduram" o texto.
4. **Objeto herói 3D no centro** (nítido): cérebro, moeda, maçã, olho, celular, ampulheta. Geralmente dentro de um **círculo/medalhão com anel tracejado** (V2 maçã, V3 cérebro e ícones do TikTok/Instagram).
5. **Tipografia cinética** (camada principal; ver seção 5).
6. **Elementos de UI "falsos"**: popup "Eliminar 'Productos' / Cancelar / Eliminar" com cursor clicando (V2 11,5 s), player de vídeo (V3 24 s), tela de celular de TikTok (V3 27 s), timeline de edição com cursor (V3 34 s), checklist com losangos (V1 6 s), lista numerada em pílulas (V3 12 s).
7. **Pós (adjustment layer):** glow no texto-chave, motion blur forte, leve grão, vinheta.

---

## 3. Iluminação, sombras e efeitos

Ver `quadros/comparativo_luz.jpg` (um quadro de cada vídeo lado a lado).

### Iluminação
- **Key light única e suave, vinda de cima/esquerda.** Todas as sombras dos objetos caem para baixo e para a direita. Isso é consistente nos 3 vídeos e é o que faz os elementos parecerem "do mesmo mundo".
- **V1 (escuro):** "low-key". Fundo quase preto, objeto iluminado como se tivesse um spot em cima. A palavra-chave em amarelo tem **glow** (bloom) que "ilumina" a cena. Laranja aparece como **feixe de luz volumétrico** (cone saindo do ícone de engrenagens, 10,5–11,5 s), um holofote.
- **V2 (dois atos de luz):** 0–7 s usa **imagens geradas por IA em sépia/tungstênio** (rua suja, escritório com "$708M NET LOSS", depósito cheio de produtos, homem com a mão na cabeça): luz quente de lâmpada fluorescente + janela fria e chuvosa. Clima de crise. Quando Jobs volta (7,5 s), **a luz "abre" para branco total, high-key**: é a virada narrativa contada com luz.
- **V3 (high-key):** branco-gelo, sombras suaves e longas. Os momentos de tensão ("Y no… No es") **invertem para fundo preto** (11–15,5 s). Inversão de fundo = virada de argumento.

### Sombras
- **Drop shadow grande, difusa e deslocada** (≈30–60 px de offset, blur alto, opacidade 25–40 %). Ela faz o objeto "flutuar" uns centímetros acima do fundo.
- Sombras de contato mais escuras perto do objeto (ambient occlusion) em cadeado, câmera, cérebro.
- **No texto também há sombra suave** nas palavras grandes do V2/V3 ("ENFOCARSE", "EMPRESA").

### Efeitos recorrentes
| Efeito | Onde | Como fazer |
|---|---|---|
| **Blur de entrada/saída (focus pull)** | Praticamente todas as palavras entram desfocadas e "focam" | Gaussian/Camera blur animado 30→0 em 4–6 frames |
| **Motion blur direcional** | Transições e objetos voando (V3 34 s, V2 22 s) | Motion blur do AE / RSMB, shutter 180–360° |
| **Glow na palavra-chave** | "error", "rico", "trabajar", "dinero", "serie", "simple" | Glow / Deep Glow, cor da palavra |
| **Destaque marca-texto** | "veas" com faixa amarela (V3 4,5 s) | Shape layer que cresce atrás da palavra |
| **Riscado** | "TikTok", "Instagram", "dopamina" (V3 20–21,5 s) | Linha animada com trim paths |
| **Máscara de revelação** | "abso**lut**amente" revelado por um bloco preto passando (V3 16,5 s) | Track matte com retângulo |
| **Contorno tracejado girando** | Anel em volta do medalhão (V2 maçã, V3 cérebro) | Stroke dashed + rotação |
| **Ondas de radar** | Anéis atrás da picareta e engrenagens (V1) | Círculos com escala+opacidade em loop |
| **Rachadura** | Maçã "rachando" em "al borde" (V2 3 s) | Overlay de crack animado |
| **Texto "glitch/eco"** | "Ahora" com rastro vertical (V3 34 s), "Años después" | Echo + motion blur |
| **Polaroids com fita adesiva** | "PowerBook (1997)", "Desktop Mac (1998)" (V2 16–18 s) | PNG de polaroid + fotos, entram empilhando |
| **Fotos de pessoas reais em cartão** | Musk, Zuckerberg, Jobs (V3 6,5–8,5 s) | Recorte em card arredondado com sombra, troca a cada ~0,5 s |

---

## 4. "Movimentos de câmera" (câmera virtual)

Não há câmera física. Os movimentos são simulados:

1. **Push-in lento constante (Ken Burns 3D).** Quase todo plano tem zoom de 100→108 % ao longo da cena. Mantém a tela "viva" mesmo quando nada muda (V1 dinheiro, V2 escritório IA, V3 cérebro).
2. **Parallax.** Objetos de canto (desfocados) se movem mais rápido que o centro: dá profundidade (V3 câmeras/claquetes, V2 globos).
3. **Whip-pan / zoom-blur de transição.** Entre ideias, a tela "voa" para um lado com blur forte (V1 9,5 s, 12 s, 17,5 s; V3 34 s). É o corte principal.
4. **Rotação/rack de objeto.** O celular gira de frente → perfil → frente (V3 26,5–27,5 s). A moeda vira de lado (V1 2–2,5 s). Simula órbita de câmera.
5. **Dolly-out para revelar.** V1 4 s: a figura da mãe aparece pequena e a "câmera" recua/aproxima até enquadrar mãe e filho.
6. **Snap zoom em palavra.** A palavra-chave entra grande (escala 120 %→100 %) com overshoot.

Regra prática: **a cada ~1,5–2,5 s algo grande muda de posição na tela**; e dentro de cada frase, **cada palavra nova é um micro-evento** (~0,3 s).

---

## 5. Tipografia (a parte mais importante do estilo)

- **Duas famílias:**
  - **Sans-serif bold** (estilo Helvetica Neue / Inter / SF Pro Bold) para palavras de ligação: "Tu", "Parece una", "Las personas más", "Por eso".
  - **Serifada itálica condensada** (estilo Playfair Display Italic / Instrument Serif / Editorial New Italic) para a **palavra de peso**: *cerebro, tontería, error, rico, ENFOCARSE, EMPRESA, simple, serie, viste videos*.
- **Hierarquia por tamanho:** a palavra de peso é 2–3× maior que a de ligação. Muitas vezes vem em **CAIXA ALTA itálica comprimida** (V2: "MILLONES", "PRODUCTOS", "VENDERLE", "ENFOCARSE", "ENTENDIERON", "HACER MAS").
- **Escada tipográfica:** as linhas ficam desalinhadas como degraus ("Apple / estaba / al borde"; "Hacen que el / dinero / trabaje por ellos"). Cria ritmo visual.
- **Uma cor de destaque só:** V1 amarelo `#F5E02A` com glow (+ laranja `#FF6A1A` no conceito "sistemas"); V2 nenhum (P&B puro, só o vermelho do gráfico na foto); V3 amarelo marca-texto + laranja na timeline final.
- **Palavra entra sincronizada com a fala**, com blur→foco, e sai com blur/motion. Texto antigo some ou "sobe" quando entra a frase nova.
- **Aspas e pontuação viram design:** “trabajar”, "¿El Resultado?", "Y no…".
- Erros de digitação reais nos vídeos ("Steave Jobs", "Dekstop", "despues" sem acento): **evitar** no nosso.

---

## 6. Cortes e ritmo (medido)

Detecção automática de mudança de cena (ffmpeg, limiar 0,12):

- **V1:** 13 mudanças em 19,8 s → **~1 corte a cada 1,5 s**
- **V2:** 33 mudanças em 31 s → **~1 a cada 0,95 s** (abertura com 6 cortes no 1º segundo e meio)
- **V3:** 23 mudanças em 37,5 s → **~1 a cada 1,6 s** (mais animação dentro do plano, menos corte)

Tipos de corte usados:
1. **Corte seco no beat da música/na palavra** (mais comum).
2. **Transição por blur / whip** (ver seção 4).
3. **Match cut de forma:** círculo → círculo (lupa preta vira olho, V3 2–2,5 s; bolinha preta vira medalhão do TikTok, V3 19–19,5 s; maçã do logo continua entre cenas, V2).
4. **Inversão de cor** (branco→preto) para marcar virada de argumento.
5. **Wipe por objeto:** o objeto em primeiro plano passa e "limpa" a tela (lupa V3 1,5 s; dinheiro V1 13,5 s).

Densidade de fala: ~2,8–3,2 palavras por segundo. Áudio sem nenhum silêncio (testado com silencedetect a −35 dB): **música de fundo contínua + narração + SFX (whoosh, clique, pop)** colados.

---

## 7. Roteiro: transcrição e estrutura

> As frases abaixo foram reconstruídas do texto na tela, que segue a narração palavra por palavra.

### V1: "O maior erro"
| Tempo | Texto | Função |
|---|---|---|
| 0–2 s | *El mayor **error** que te enseñaron* | **GANCHO**: promessa de revelar um erro (curiosidade + "te enganaram") |
| 2–4 s | *sobre hacerse **rico** es: "**trabajar** más"* | Nomeia o erro (crença comum) |
| 4–8 s | *Desde pequeños nos dijeron: ◆ Estudia ◆ Trabaja duro ◆ Ahorra* | Identificação: "você ouviu isso" (mãe apontando para criança) |
| 8–9,5 s | *Pero **nadie** te dijo que los más **ricos*** | **VIRADA** ("Pero nadie te dijo") |
| 10–13 s | *No venden su **tiempo**. Construyen **sistemas**. Crean **ACTIVOS**.* | Revelação em 3 batidas (regra de três) |
| 13–15 s | *Hacen que el **dinero** trabaje por ellos* | Síntese |
| 15–20 s | *La **Riqueza** no recompensa al que más **trabaja**. **Recompensa** al que más **valor crea**.* | **FRASE-FINAL de contraste** (quotable, loop para o início) |

### V2: "Apple em 1997"
| Tempo | Texto | Função |
|---|---|---|
| 0–1,5 s | *En **1997**…* | **GANCHO de história**: data + cenário decadente |
| 1,5–3,5 s | *Apple estaba **al borde*** (maçã racha) | Stakes |
| 3,5–7,5 s | *La empresa perdía **MILLONES**, tenía demasiados **PRODUCTOS** y nadie sabía qué hacer* | Problema em 3 sintomas |
| 7,5–9 s | *Entonces volvió… Steve Jobs (fundador de Apple)* | Entrada do herói |
| 9,5–11 s | *Una **decisión** parecía una **locura*** | Micro-gancho (o que ele fez?) |
| 11,5–13 s | (popup "Eliminar Productos" + clique) | Mostra a decisão sem falar: corte de produtos |
| 13–16 s | *Apple dejó de **VENDERLE a todo el mundo*** | Ação 1 |
| 16–18 s | *Empezó a **ENFOCARSE*** (polaroids) | Ação 2 |
| 18,5 s | *¿El Resultado?* | **Pergunta-gancho antes do payoff** |
| 19–24 s | *Años después, esa misma **EMPRESA** se convertiría en una de las más valiosas del mundo* | Payoff |
| 24–31 s | *Todo empezó cuando **ENTENDIERON** algo… No significa **HACER MÁS**. Significa saber **QUÉ ELIMINAR**.* | **Lição / moral**: os pontos somem e o central cresce |

### V3: "Teu cérebro vai me odiar"
| Tempo | Texto | Função |
|---|---|---|
| 0–2,5 s | *Tu **cerebro** va a **odiarme** por **mostrarte*** | **GANCHO provocativo** (conflito com o espectador) |
| 2,5–6,5 s | *Parece una **tontería**, pero después de que lo **veas** vas a empezar a **notarlo** en todos* | Promessa + FOMO |
| 6,5–9 s | *Las personas más **inteligentes** de Internet* (Musk, Zuckerberg, Jobs) | Autoridade / prova social |
| 9–11 s | *usan esto sin decirte qué es* | Segredo / loop aberto |
| 11–15,5 s | *Y no… No es: ① Disciplina ② Motivación ③ Trabajo Duro* | **Quebra de expectativa** (elimina as respostas óbvias) |
| 16–17 s | *Es algo absolutamente **simple*** | Mantém o suspense |
| 17,5–24 s | *Tu cerebro tiene una adicción. No a TikTok, no a Instagram, no a la dopamina… a **cerrar cosas que están abiertas*** | Revelação (efeito Zeigarnik) |
| 24–29 s | *Por eso empiezas una **serie** y no puedes **dejarla**. Por eso **viste videos** que ni siquiera te **interesaban**.* | Exemplos do dia a dia |
| 29–33 s | *Y por eso **sigues aquí**. Porque hace **15 segundos** abrí una **pregunta*** | **Meta-gancho**: usa a técnica no próprio espectador |
| 33–37 s | *y tu cerebro quiere **terminarla**. Ahora imagina usar eso en tus **videos**: eso cambia todo* | CTA implícito / aplicação |

### Fórmula de roteiro comum aos 3
1. **Gancho em ≤ 2 s** com uma de três armas: *erro/crença errada* (V1), *data + crise* (V2), *provocação direta* (V3).
2. **Identificação ou stakes** (2–6 s): "desde pequeno te disseram…", "a empresa perdia milhões…".
3. **"Pero / Y no / Entonces"**: palavra de virada clara.
4. **Lista de 3** (Estudia/Trabaja/Ahorra · Millones/Productos/nadie sabía · Disciplina/Motivación/Trabajo duro). Sempre 3.
5. **Micro-ganchos a cada 5–8 s**: "¿El resultado?", "una decisión parecía una locura", "usan esto sin decirte qué es".
6. **Payoff + frase final de contraste** "Não é X, é Y" (*No recompensa al que más trabaja, recompensa al que más valor crea* / *No significa hacer más, significa saber qué eliminar*). Frase curta, citável, boa para print/compartilhar.
7. **Sem CTA explícito** ("segue", "curte"). O fim é a moral, o que favorece rewatch/loop.

---

## 8. Som (inferido dos visuais + medição)
- Volume médio −16 a −19 dB, picos em 0 dB: master alto, compressão forte (padrão de Reels/TikTok).
- Trilha contínua (ambient/cinematic, tensa no início, abre na virada).
- **SFX em cada evento visual:** whoosh nos whip-pans, "tick" de relógio (V3 30 s), clique de mouse (popup V2, timeline V3), "crack" (maçã), "pop" quando cada item de lista entra, riser antes do payoff.
- Narração em tom de documentário, ritmo rápido (~3 palavras/s), sem respiros longos.

---

## 9. Receita para produzir no mesmo estilo

### Pré-produção
1. **Roteiro de 60–110 palavras** (20–37 s) seguindo a fórmula da seção 7. Marque em **negrito a palavra de peso de cada frase**: ela vai ser a serifada itálica grande.
2. **Shot list = 1 objeto herói por frase.** Escolha objetos-metáfora simples e reconhecíveis (cérebro = mente, cadeado = fechar, ampulheta = tempo, moeda = dinheiro).
3. **Escolha a paleta:** escuro + 1 cor quente (V1) ou branco-gelo + preto + 1 acento (V3). Defina antes e não fuja dela.

### Assets
- Objetos 3D: renders próprios (Blender) ou PNGs 3D/IA com fundo removido, **todos com a mesma direção de luz (de cima-esquerda)**. Converter para P&B quando o estilo for monocromático.
- Cenas "fotográficas" (estilo V2): imagens geradas por IA com prompt de época + luz sépia/tungstênio, depois push-in lento.
- Fontes: Inter/Helvetica Bold + Playfair Display Italic (ou Instrument Serif Italic).

### Edição (After Effects / CapCut / Premiere)
1. Narração primeiro → gerar legenda com timestamps por palavra.
2. Cada palavra = 1 layer de texto que entra no seu timestamp com: blur 30→0, escala 110→100 %, opacidade 0→100 em ~5 frames, easing "ease out" forte.
3. Fundo: sólido + gradiente radial + grid/bokeh em baixa opacidade.
4. Objeto herói: drop shadow suave (distância 40, softness 80, opacidade 30 %) + push-in contínuo 100→108 %.
5. 1–2 objetos de canto com Camera Blur forte e parallax.
6. Transições: whip com Directional Blur + Transform (posição) em 6–8 frames, ou match cut de forma.
7. Inverter fundo (claro↔escuro) no momento da virada.
8. Adjustment layer final: glow na cor de destaque, motion blur, vinheta leve, grão sutil.
9. SFX em todo evento; trilha contínua com riser antes do payoff.

### Checklist de qualidade
- [ ] Gancho termina em ≤ 2 s
- [ ] Algo muda na tela a cada ≤ 1,5 s
- [ ] Toda frase tem 1 palavra de peso (serifada, grande, cor/glow)
- [ ] Sombras de todos os objetos na mesma direção
- [ ] Lista de 3 em algum ponto
- [ ] Pelo menos 1 micro-gancho no meio ("¿El resultado?")
- [ ] Final em contraste "Não é X, é Y"
- [ ] Revisão ortográfica (os originais têm erros: "Steave", "Dekstop")
