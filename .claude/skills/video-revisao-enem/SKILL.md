---
name: video-revisao-enem
description: 'Cria vídeos curtos de revisão (ENEM, vestibular, escola) no estilo explicativo desenhado à mão, com traço tremido de stop motion, card "PASSO X DE N", trilha de etapas com ✓, fundo de papel creme, rosa e tinta preta. Gera tudo por código (canvas + Playwright + ffmpeg), sem depender de geração de imagem. Cobre o pacote inteiro: escolha do assunto, roteiro em passos, animação, render 1080×1920, roteiro de voz, sincronia do vídeo com a narração gravada (Vosk), legenda/descrição com hashtags e capa no mesmo estilo. Use sempre que o usuário pedir um vídeo de revisão ou explicação de matéria (matemática, física, química, biologia, história...), um "vídeo de ENEM", um Reels/TikTok educativo, para colocar/sincronizar a voz num desses vídeos, ou a capa/legenda de um deles, mesmo que não diga "skill" nem "desenhado à mão".'
---

# Vídeo de revisão desenhado à mão

O modelo é o vídeo de média/mediana/moda (`assets/template/`), que já funciona de ponta a ponta. Em vez de começar do zero, **copie o modelo e troque o conteúdo**: assim o estilo, os tempos e os detalhes de acabamento já corrigidos vêm junto.

Fale com o usuário em português, em linguagem simples. Ele cuida do perfil e grava a voz; você cuida do resto.

## Fluxo

### 1. Assunto e roteiro em passos
- Se o usuário não der o assunto, proponha um que **cai com frequência** na prova e diga que ninguém sabe exatamente o que vai cair. 2º dia do ENEM = Matemática + Ciências da Natureza; 1º dia = Linguagens, Humanas e redação.
- Estruture em **4 a 6 passos**, como uma receita: um conceito por passo, sempre com um exemplo numérico concreto, mais uma **pegadinha** (o erro clássico da prova) e um **resumo** no fim. O passo da pegadinha é o gancho que segura a atenção e ajuda a divulgar o vídeo.
- **Confira todas as contas e fatos** antes de animar. Escreva as contas no README do vídeo. Se exagerar algo só para ficar visível, diga isso no README.
- Duração: ~60 s, mas o vídeo final segue a narração (veja o passo 5).

### 2. Criar a pasta e animar
```bash
bash <skill>/scripts/novo_video.sh producao/videoNN_assunto
```
Em `app.js`, troque:
- `STEPS` (frame de início e rótulo de cada etapa), `FINALE` e `TOTAL_FRAMES` (30 fps);
- `CARDS` (texto do card de cada passo e da barra de progresso);
- as funções de cena (`sceneMedia`, `sceneMediana`...) e a lista `scenes` em `renderFrame`;
- o título em `drawTitle` (selo, linhas grandes e subtítulo).

Use as funções de `common.js`: `sPoly` (traço de mão com boil a cada 4 quadros), `roundPts`/`circlePts`/`rectPts`, `sArrow`, `text`, `pop`/`withPop` (entrada com mola) e `easeOutBack`. Leia **`references/estilo.md`** antes de desenhar: ele tem a paleta, o layout seguro e os erros que já aconteceram.

### 3. Conferir antes de renderizar
```bash
cd producao/videoNN_assunto && node render.js stills /tmp/stills 30,200,400,...
```
Monte uma folha com os quadros (ffmpeg `tile`) e **olhe** um quadro de cada passo. Texto sobrepondo texto ou barra é o defeito mais comum, e só aparece olhando. Corrija e renderize de novo até ficar limpo.

### 4. Renderizar sem áudio + roteiro de voz
```bash
node render.js video ../saida/videoNN_assunto_sem_audio.mp4
```
Escreva o roteiro de voz seguindo **`references/entregaveis.md`**: texto corrido para colar no gerador de voz, uma tabela de sincronia frase × tela, os números por extenso e reticências antes dos resultados.

### 5. Sincronizar com a narração gravada
Quando o usuário mandar o MP3, **não corte a voz**: re-cronometre o vídeo para ela. Siga **`references/sincronia.md`**:
1. `bash <skill>/scripts/instalar_vosk.sh` (precisa de `alphacephei.com` liberado na rede);
2. `python3 <skill>/scripts/transcrever.py audio/narracao.mp3 audio/narracao_palavras.json`;
3. monte `sync.json` com âncoras `[quadro original, segundo da fala]` (modelo em `sync.exemplo.json`);
4. `node render_sync.js ../saida/videoNN_assunto_COM_VOZ.mp4`, depois confira quadros nos segundos-chave.

### 6. Legenda e capa
- Legenda para Instagram e TikTok + comentário fixado, conforme `references/entregaveis.md`.
- Capa: edite `capa/capa.html` (selo, título, ilustração e selo amarelo de gancho) e rode `node capa/shot_capa.js`. Deixe tudo que importa entre y=240 e y=1680, porque a grade do perfil recorta em 3:4. Gere também a prévia recortada (`crop=1080:1440:0:240`) para mostrar ao usuário.

### 7. Entregar
- Envie cada entrega com `SendUserFile` (vídeo com `display: render`).
- Faça commit dos arquivos de código e do README. O `producao/saida/` está no `.gitignore`: adicione o MP4 final com `git add -f`.
- No README do vídeo: tabela tempo × passo × o que aparece, contas conferidas e como renderizar de novo.

## Ambiente
- Chromium e Playwright já vêm instalados (`require('playwright')`); ffmpeg também.
- A rede é limitada: sites como higgsfield, elevenlabsusercontent e alphacephei precisam ser liberados no ambiente. Use as ferramentas de ambiente (get/update_environment), que mostram o pedido para o usuário aprovar. Se ele recusar, siga sem esse recurso e diga o que ficou de fora.
- Imagens geradas por IA são opcionais. Tudo pode ser desenhado por código. Se o usuário mandar um PNG (por exemplo, de um gerador de imagem), recorte o fundo com numpy/PIL e use `drawImage`.
