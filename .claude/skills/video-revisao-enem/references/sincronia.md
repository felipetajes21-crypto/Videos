# Sincronizar o vídeo com a narração

Princípio: **a voz manda**. A narração gravada quase nunca tem a mesma duração do vídeo (no vídeo 03, a voz tinha 80 s e o vídeo 60). Cortar a voz soa mal. Re-cronometrar a animação é invisível para quem assiste.

## 1. Tempo de cada palavra
```bash
bash <skill>/scripts/instalar_vosk.sh        # uma vez por máquina; precisa de alphacephei.com liberado
python3 <skill>/scripts/transcrever.py audio/narracao.mp3 audio/narracao_palavras.json
```
Sai uma linha `palavra@segundo ...`. O modelo pequeno erra algumas palavras ("o do meio" → "o domínio"), mas os **tempos** são confiáveis e o texto é conhecido pelo roteiro. Use os dois juntos.

Alternativas, se o Vosk não estiver disponível: o `silencedetect` do ffmpeg dá as pausas entre frases, que funcionam como âncoras grosseiras. Faster-whisper precisa do Hugging Face, que costuma estar bloqueado.

## 2. Âncoras (`sync.json`)
Cada âncora é `[quadro do vídeo original, segundo da narração]`. Para cada evento visual importante, ache a palavra que ele ilustra:

| Evento no vídeo original | Palavra na voz | Âncora |
|---|---|---|
| barra 1 acende (q190) | "seis" @7,4 | `[190, 7.4]` |
| barras se nivelam (q310–370) | "é como se todo mundo… nota" 17,2–19,2 | `[310, 17.2], [370, 19.2]` |
| barra de 40 sobe (q1290) | "aí entra o chefe" @56,2 | `[1290, 56.2]` |

Regras:
- As duas colunas precisam **crescer sempre** (o `render_sync.js` recusa âncoras fora de ordem).
- Ponha âncora no **início e no fim** de cada animação longa, para ela durar o trecho falado.
- Ponha âncoras nas **trocas de passo** (pop-out/pop-in) logo antes da palavra que abre o passo seguinte.
- Primeira âncora `[0, 0.0]`; última `[TOTAL_FRAMES, duração da voz]`.
- Entre âncoras o tempo é interpolado. Esticar ~1,5× fica natural; mais que 3× vira câmera lenta. Nesse caso, adicione animação ou uma âncora intermediária.

## 3. Renderizar com voz
```bash
node render_sync.js ../saida/videoNN_COM_VOZ.mp4                 # vídeo + áudio
node render_sync.js stills /tmp/sy 7.4,17.5,56.3                 # quadros nos segundos-chave
```
O boil do traço usa o quadro de **saída**, então o tremido continua no ritmo normal mesmo nos trechos esticados. Confira sempre os quadros nos segundos das palavras-chave antes de entregar.
