# Análise quadro a quadro (30 fps, todos os 3.148 quadros)

Complementa o [`ANALISE.md`](ANALISE.md). Aqui o foco é **movimento**: como cada elemento entra, se mexe e sai, com a contagem de quadros.

- Folhas com **todos os quadros** (12×5 = 2 s por folha, número do quadro + tempo em cada miniatura): [`quadro_a_quadro/`](quadro_a_quadro/)
- Medições por quadro (fluxo óptico): [`dados/`](dados/) — `diff` (quanto a imagem mudou), `sharp` (nitidez), `scale/tx/ty/rot` (zoom, deslocamento e rotação estimados entre quadros).

> Notação: **q** = quadro (1 q = 33 ms). "q 274–277" = quadros 274 a 277.

---

## 1. A descoberta principal: a "câmera" quase não se move. Quem se move são as camadas.

Olhando quadro a quadro, a imagem de fundo fica praticamente parada durante cada plano. A sensação de movimento vem de 4 coisas, sempre as mesmas:

1. **Entrada com desfoque → foco** (cada plano começa borrado e "acha o foco" em 4–12 q).
2. **Deriva lenta** (push-in de 2–10 %/s + leve subida) enquanto o plano está parado.
3. **Saída com zoom + desfoque vertical** (3–5 q) antes do corte.
4. **Objetos que entram voando** (com motion blur) e "pousam" com um leve overshoot.

Medição automática de desfoque forte: cada um dos 3 vídeos tem um trecho borrado **no início de praticamente todo plano** (V1: 12 trechos, V2: 16, V3: 20), com duração mediana de **11–17 quadros (0,4–0,6 s)** entre o borrão total e a nitidez total. Ou seja: **nada aparece nítido de cara. Tudo "entra em foco".**

---

## 2. A transição-assinatura: "zoom blur" (saída) + "rack focus" (entrada)

É usada em mais da metade dos cortes. Anatomia exata, contada nos quadros:

| Fase | Quadros | O que acontece | Exemplos |
|---|---|---|---|
| **Saída** | 3–5 q | Tudo escala +10 a 25 %, sobe um pouco e ganha **motion blur vertical** forte. O texto vira "fantasma" esticado. | V2 q 274–277 ("Steave Jobs"), q 660–664 ("EMPRESA"), q 720–722, q 783–785 (cérebro); V3 q 36–38, q 264–267 (Jobs), q 470–472 ("No es"), q 523–526 ("simple"), q 724–726 (cadeados), q 793–796 ("serie"), q 1024–1027 |
| **Corte** | 1 q | Corte seco. Às vezes o quadro novo é quase branco. | V2 q 548, q 606; V3 q 268, q 797 |
| **Entrada** | 4–12 q | O novo plano entra **desfocado e um pouco maior**, encolhe até 100 % e foca. Objetos vêm de fora da tela com motion blur. | V2 q 723–731 (cérebro desce do topo), q 575–585 (ampulheta gira e foca); V3 q 527–535 (cérebro sobe), q 976–983 (cérebro entra de baixo) |

**Curva de animação:** a saída **acelera** (ease-in) e a entrada **desacelera** (ease-out forte). É o preset "Smooth Zoom" / "Zoom Blur" do CapCut, ou Transform + Directional Blur no After Effects.

---

## 3. Catálogo de transições (todas as que aparecem)

| # | Transição | Duração | Onde (quadros) | Como recriar |
|---|---|---|---|---|
| 1 | **Zoom blur + rack focus** (seção 2) | 3–5 q + 4–12 q | Na maioria dos cortes | Escala 100→120 % + Directional Blur 90° na saída; Camera Lens Blur 40→0 na entrada |
| 2 | **Painel preto subindo (wipe)** | 10–20 q | V3 q 39–58 (preto sobe por baixo, com a lupa passando borrada); q 312–335 (preto sobe na diagonal e "engole" o branco → cena escura) | Sólido preto com máscara animada + Motion Blur; borda levemente inclinada |
| 3 | **Painel preto descendo (wipe)** | ~8 q | V3 q 137–145 (preto desce do topo e cobre "pero después de que lo veas") | Igual ao 2, de cima para baixo |
| 4 | **Estrobo negativo** | 5 q | V3 q 65–69: a imagem alterna **invertida/normal a cada quadro** em "mostrarte" | Inverter cores em quadros alternados (Invert ligado/desligado) |
| 5 | **Íris/bolinha que cresce** | ~12 q | V3 q 193–204: um ponto preto nasce em cima do texto, cresce virando um card, e um halo branco se expande e enche a tela, passando do fundo escuro para o claro | Círculo com escala 0→1500 % + Glow; troca de fundo por baixo |
| 6 | **Flash de silhueta** | 3 q | V3 q 220–222 e q 243–245: a foto vira uma **silhueta branca brilhante** por 3 quadros e volta como outra pessoa | 3 quadros de silhueta branca com Glow entre duas fotos |
| 7 | **Pop-in de janela (UI)** | ~8 q | V2 q 347–358: o popup "Eliminar 'Productos'" nasce pequeno, borrado e com sombra, cresce até 100 % e as fichas dos produtos aparecem em volta | Escala 20→100 % com overshoot + desfoque 30→0 |
| 8 | **Tingimento vermelho** | ~13 q | V2 q 377–390: depois do clique em "Eliminar", tudo fica cada vez mais vermelho enquanto as fichas crescem e se espalham. Corte seco para branco no q 391 | Tint/Fill vermelho com opacidade 0→100 % + Scale nas fichas |
| 9 | **Troca dentro do medalhão** | ~6 q | V3 q 607–614 (TikTok → Instagram), q 640–647 (Instagram → molécula da dopamina): o ícone desliza na horizontal com motion blur **dentro** da máscara circular | Ícones em fila numa pré-composição com máscara circular; Position animada |
| 10 | **Rotação 3D de objeto** | ~33 q | V3 q 797–830: celular gira no eixo Y (frente → perfil → costas → perfil → frente) | Modelo 3D (Blender/Element 3D) ou sequência de PNGs |
| 11 | **Entrada lateral com motion blur** | 6–8 q | V2 q 606–611 (maçã vem da esquerda), q 665–672 (maçã vem do canto superior direito); V3 q 145–155 (ícones de apps entram por baixo à direita) | Position com ease-out + Motion Blur |
| 12 | **Morph de número em símbolo** | 6 q | V3 q 943–948: o "15" é coberto por um card com "?" que cresce na frente dele | Card em escala 0→100 % por cima do número |
| 13 | **Fotos empilhando** | ~8 q cada | V2 q 488–492, q 503, q 518: polaroids caem uma sobre a outra, giradas, com sombra | Position + Rotation com ease-out; sombra grande |

---

## 4. Como o texto se move (medido letra por letra)

### Palavra de peso (serifada itálica): aparece **letra por letra**
Cada letra surge borrada e transparente e foca em ~4 q. As letras aparecem em sequência, **1,3 a 2 quadros por letra**:

| Palavra | Quadros | Letras | Quadros por letra |
|---|---|---|---|
| "cerebro" (V3) | q 5–15 | 7 | 1,4 |
| "tontería" (V3) | q 85–98 | 8 | 1,6 |
| "ENFOCARSE" (V2) | q 492–503 | 9 | 1,3 |
| "EMPRESA" (V2) | q 622–635 | 7 | 1,9 |
| "segundos" (V3) | q 925–940 | 8 | 1,9 |
| "terminarla" (V3) | q 1007–1017 | 10 | 1,0 |

Efeito no After Effects: **Text Animator** com Opacity 0 %, Blur 20, Position Y +15 px e **Range Selector por caractere**, Ease High ~80 %. Vale ligar o "Randomize Order" para algumas letras chegarem fora de ordem: em "cerebro" o "b" aparece borrado depois do "r".

### Palavra de ligação (sans bold): entra **inteira**
Desfocada e cinza clara, foca e escurece em **3–8 q** ("usan" q 268–276; "vas" q 145–150). Não tem movimento de posição, só foco e opacidade.

### Bloco de texto
- As linhas se acumulam palavra por palavra **no ritmo da fala** e o bloco inteiro **sobe devagar** (~5–15 px/s) enquanto cresce (V3 q 120–143; V2 q 732–779).
- Na saída, o bloco **sobe e estica** junto com a transição (seção 2).

### Truques de texto vistos no detalhe
- **Marca-texto** em "veas": a faixa amarela cresce da esquerda para a direita junto com as letras (V3 q 128–135).
- **Riscado** em TikTok/Instagram/dopamina: a linha é desenhada da esquerda para a direita em ~10 q, **depois** que a palavra está nítida (V3 q 590–605, q 615–623, q 645–650).
- **Palavra que se apaga** e deixa um espaço em branco: "cerrar" aparece num retângulo tracejado, é riscada, e as letras se encolhem até sobrar só um traço: **"a ______"** (V3 q 674–681). O espectador fica com uma lacuna para preencher, e isso também segura a atenção.
- **Retângulo tracejado** em volta de "cerrar" e "abiertas", como uma seleção de software (V3 q 662, q 710–719).
- **Bloco preto que cobre e troca**: um retângulo preto cresce no meio de "absurdamente", engole a palavra e vira o fundo de "simple", que é digitado dentro dele (V3 q 501–512).
- **Sobreposição de camadas**: "15" é um número enorme em sans black, "segundos" é serifado itálico **por cima** do número (V3 q 925–940).

---

## 5. Movimento de objetos e "câmera" por cena

### V1 (preto/dourado, 594 q)
- **12 planos, média de 1,65 s cada.** Medição: o 1º plano **afasta** (zoom acumulado 0,50×, a moeda vai se afastando), e os planos seguintes alternam push-in (+15 a +31 %/s) e pull-out (−7 a −15 %/s). Essa alternância **dentro/fora** dá a sensação de "respiração".
- Planos com deslocamento vertical grande (−360 a −520 px e +360 a +700 px): são os **whip-pans verticais** entre ideias (q ~120, ~290, ~390). No plano de 13,1 s, a câmera vai para o canto (−695 px em X e +703 em Y) com rotação de −17,6°, uma diagonal com giro.
- O feixe de luz laranja (≈ q 315–345) é animado **por dentro** do plano. A câmera fica parada.

### V2 (sépia → branco, 930 q)
- **0–1,6 s:** 4 planos de 0,3–0,5 s. Abertura em rajada.
- **Fotos geradas por IA (1,6–7,5 s):** push-in lento e contínuo. A medição pega +9 a +47 %/s, mas isso inclui o texto crescendo. Nos quadros (q 180–226) o fundo quase não se mexe: o movimento é do texto e da **nuvem/chuva na janela**.
- **Jobs de terno (q 227–277):** entra com desfoque forte no q 227, fica nítido no q 229. Depois, **deriva para cima ~2 px/q** enquanto "Steave Jobs / Fundador de Apple" aparece com uma **seta curva desenhada à mão** (q 250–270), também animada como traço.
- **Jobs P&B (q 278–346):** a foto é **esticada na horizontal** no q 278 e se ajusta em ~4 q, um "squash" de entrada. Fica parada, só o texto troca.
- **Popup (q 347–390):** a câmera fica fixa. Só o cursor anda: vai do canto inferior até "Eliminar" em ~25 q, com ease-in-out.
- **Globo (q 391–472):** o fundo de grid é fixo, e 3 globos entram **pelos cantos** em tamanhos diferentes. É parallax: o grande da direita entra antes e o de baixo depois.
- **Ampulheta (q 575–605):** entra pequena, girada ~30° e borrada, **gira e cresce até 100 % em ~12 q**. Uma segunda ampulheta borrada passa pelos cantos (parallax).
- **Cérebro (q 723–785):** desce do topo com blur em ~6 q e assenta. Duas **linhas curvas finas** (estilo "trajetória") cruzam o quadro.
- **Final (q 786–929):** a bolinha preta aparece no centro, depois **os pontos pequenos se espalham em volta** (q 790–815: 1 → 40 pontos em ~25 q, com sombra). Em "QUE ELIMINAR" (q 893–911), **os pontos de fora somem com desfoque** e sobra o central maior. A metáfora do roteiro vira animação.

### V3 (branco/preto, 1.124 q)
- **Cérebro inicial (q 0–38):** começa **grande e borrado** e encolhe até caber no medalhão (q 0–6). O anel tracejado **gira** (~5°/q). Neurônios borrados nos cantos.
- **Lupa (q 39–69):** passa grande pela tela da esquerda para a direita (wipe), depois fica no canto. Estrobo de 5 q.
- **Olho (q 70–143):** aparece como uma **linha** (pálpebra fechada, q 71) e **abre** em ~6 q. **Pisca** duas vezes (q 85–87 e q 97–99) e depois cresce ~25 % até o q 143. Push-in lento.
- **Apps (q 145–192):** ícones com glow entram de baixo/direita e **flutuam** (deriva de ~1 px/q, cada um em velocidade diferente = profundidade).
- **Fotos (q 197–267):** o card fica fixo e só a foto troca, com o flash de silhueta.
- **"Y no… No es" (q 326–472):** fundo preto, câmera fixa. As 3 pílulas entram **por baixo**, uma de cada vez, ~16 q cada. Entrada cinza e borrada, depois nítida. O bloco inteiro **sobe** para abrir espaço.
- **Cadeados (q 662–726):** dois cadeados borrados nos cantos (cima-direita e baixo-esquerda) **derivam em direções opostas**.
- **Celular (q 797–864):** rotação 3D completa e depois **inclina em perspectiva** (q 840+).
- **Personagem "?" (q 865–901):** bola preta com carinha, os sinais "¿ ?" **crescem a partir dos lados** e um pin de localização desce sobre a cabeça.
- **Relógios (q 902–975):** dois relógios nos cantos, **o ponteiro anda** (animação real dentro do objeto).
- **Timeline (q 1028–1123):** UI de edição. O cursor arrasta o clipe laranja e o **playhead varre** da esquerda para a direita (~2 s), revelando "Eso cambia todo".

---

## 6. Regras de movimento para copiar (resumo prático)

1. **Câmera = quase parada.** Push-in de 2–10 %/s em todo plano. Nunca deixe um quadro 100 % estático.
2. **Todo plano começa borrado** e foca em 4–12 quadros (0,15–0,4 s).
3. **Todo plano termina** com zoom +10–25 % e desfoque vertical em 3–5 quadros.
4. **Palavras de peso:** letra por letra, ~1,5 quadro por letra, cada letra com blur e fade de ~4 q.
5. **Palavras de ligação:** inteiras, com desfoque + opacidade em 3–8 q.
6. **Objetos 3D entram voando de fora da tela** com motion blur e assentam em 6–12 q com overshoot leve.
7. **Objetos de canto:** sempre borrados, cortados pela borda e com deriva lenta em direções opostas (parallax).
8. **A cada palavra-chave do roteiro, algo acontece no objeto:** o olho pisca, a maçã racha, o ponteiro anda, os pontos somem, o cursor clica.
9. **Mudar o fundo** (branco ↔ preto) com um wipe de painel ou uma íris quando o argumento vira.
10. **Use 1 ou 2 transições "especiais" por vídeo** (estrobo, íris, silhueta, tingimento vermelho). O resto é a transição-assinatura.

### Parâmetros sugeridos (After Effects, 30 fps)
| Elemento | Propriedade | Valores | Easing |
|---|---|---|---|
| Entrada de plano | Scale / Camera Lens Blur | 108 → 100 % / 40 → 0 | Ease out 80 % |
| Saída de plano | Scale / Position Y / Directional Blur (90°) | 100 → 120 % / 0 → −80 px / 0 → 60 | Ease in 80 % |
| Push-in contínuo | Scale | 100 → 106 % por 2 s | Linear |
| Letra serifada | Opacity / Blur / Position Y (por caractere) | 0 → 100 / 20 → 0 / +15 → 0 | Range Selector, offset 1,5 q/letra |
| Palavra sans | Opacity / Blur | 0 → 100 / 12 → 0 em 5 q | Ease out |
| Objeto voando | Position + Motion Blur (shutter 360°) | de fora da tela até o lugar em 8 q | Ease out + overshoot 3 % |
| Objeto de canto | Camera Lens Blur / Position | 25–40 / deriva 20–40 px por plano | Linear |
| Anel tracejado | Rotation | +150°/s | Linear |
