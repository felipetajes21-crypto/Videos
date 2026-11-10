# Vídeo 02: "Por que o gelo boia?"

Explicação de física no estilo do vídeo de referência [prompt-motion.com/ror-fly-9950f1](https://prompt-motion.com/ror-fly-9950f1) (animação da receita do Negroni):
- desenho à mão em papel creme, traço que "treme" a cada 4 quadros (efeito stop motion medido na referência);
- paleta rosa + tinta escura, título em Luckiest Guy, textos em Patrick Hand;
- card "PASSO X DE 6" com barra de progresso, trilha de 6 etapas com ✓ e objetos que entram com mola.

**Arquivo:** [`../saida/video02_por_que_o_gelo_boia_sem_audio.mp4`](../saida/) · 1080×1920 · 30 fps · 30 s · sem áudio

## Roteiro visual

| Tempo | Passo | Card | Animação |
|---|---|---|---|
| 0–2,5 s | Abertura | "POR QUE O GELO BOIA?" | Letras pulam uma a uma, o título sobe e o copo é desenhado |
| 2,5–6,5 s | 1. Água | **1,00 g/cm³**, ÁGUA | A jarra enche o copo; a lupa mostra as moléculas de H₂O agitadas e juntinhas |
| 6,5–10,5 s | 2. Frio | **0 °C**, ESFRIA | O termômetro cai de 20° para 0°; as moléculas desaceleram |
| 10,5–14,5 s | 3. Cristal | **HEXÁGONOS**, VIRA CRISTAL | As moléculas se travam num favo de mel (pontes de hidrogênio); a água vira gelo e o nível sobe |
| 14,5–18,5 s | 4. Volume | **+9%**, MAIS VOLUME | No copo medidor, 1,00 L de água vira 1,09 L de gelo |
| 18,5–22,5 s | 5. Densidade | **0,92 g/cm³**, MENOS DENSO | O cubo cai, afunda, balança e flutua; setas de peso e empuxo |
| 22,5–26,5 s | 6. Iceberg | **~90%**, FICA SUBMERSO | Iceberg no mar: ~10% para fora, ~90% embaixo |
| 26,5–30 s | Final | **BOIA!**, É FÍSICA | Copo com o gelo boiando, brilhos, todas as etapas com ✓ |

## Física (conferida)
- Densidade da água líquida: ~1,00 g/cm³ (máxima a 4 °C). Gelo: ~0,92 g/cm³.
- Ao congelar, as moléculas formam uma rede hexagonal com espaços vazios: o volume aumenta ~9%.
- Um corpo flutua quando é menos denso que o líquido (princípio de Arquimedes: empuxo = peso do líquido deslocado).
- Fração submersa = densidade do gelo ÷ densidade do líquido: ~92% em água doce; ~89–90% na água do mar (1,025 g/cm³), por isso "~90%" no iceberg.
- No copo medidor, a marca de +9% está **exagerada 3×** na altura para ficar visível.

## Renderizar
```bash
cd producao/video02_gelo
node render.js video ../saida/video02.mp4
node render.js stills /tmp/stills 0,120,600   # quadros soltos
```
