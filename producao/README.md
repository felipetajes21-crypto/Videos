# Produção: Vídeo 01, "Amanhã você vai esquecer este vídeo"

Vídeo **sem áudio**, montado 100% por código a partir do [roteiro](../roteiro/ROTEIRO_01_CURVA_DO_ESQUECIMENTO.md).
Formato 1080×1920, 30 fps, 35 s (1.050 quadros).

- **Arquivo final:** [`saida/video01_curva_do_esquecimento_sem_audio.mp4`](saida/)
- **Código:** [`render/`](render/)
  - `engine.js`: texto animado (letra por letra / palavra inteira com desfoque), fundos, compositor com push-in, entrada desfoque→foco e saída zoom + desfoque vertical
  - `objects.js`: cérebro (com partículas), medalhão, anel tracejado, caderno, ampulheta, celular 3D, relógio, gráfico da curva, imagens de época em sépia
  - `scenes.js`: as 14 cenas do roteiro, com os tempos em quadros
  - `render.js`: renderiza no Chromium (Playwright) e junta com o ffmpeg
- **Fontes:** Playfair Display Italic (em `fonts/`) + Inter (já instalada no sistema)

## Como renderizar de novo

```bash
cd producao/render
node render.js video ../saida/video01.mp4          # vídeo inteiro
node render.js video ../saida/trecho.mp4 246 312   # só um trecho (quadros 246 a 311)
node render.js stills ../saida/stills 0,30,90      # quadros soltos em PNG para conferir
```

## Como encaixar o áudio do ElevenLabs

Os tempos atuais seguem o roteiro (~2,9 palavras/s). Depois de gerar a voz:

1. Veja em que segundo começa cada frase (no CapCut/Premiere ou numa transcrição com tempos).
2. Em `render/scenes.js`, ajuste `start`/`end` de cada cena (em quadros: segundos × 30). O `start` de cada texto é relativo ao início da cena.
3. Renderize de novo e junte o áudio:

```bash
ffmpeg -i saida/video01.mp4 -i narracao.mp3 -c:v copy -c:a aac -b:a 192k -shortest saida/video01_com_audio.mp4
```

Outra opção é levar o MP4 para o CapCut e ajustar a velocidade de cada trecho à voz. Os cortes já estão nas trocas de frase.

## Limitações conhecidas

- Os objetos (cérebro, caderno, ampulheta, celular, relógio) e as cenas de 1885 foram **desenhados por código**, porque a rede deste ambiente bloqueia o download das imagens geradas no ElevenLabs. Para chegar ao realismo das referências, dá para trocar cada objeto por um PNG 3D (os prompts estão no roteiro, seção 6): basta substituir a função de desenho correspondente em `objects.js` por um `drawImage`.
- O roteiro previa uma mão de escultura na cena 9 ("atalho"). Ela foi trocada por um feixe de luz sobre o medalhão.
