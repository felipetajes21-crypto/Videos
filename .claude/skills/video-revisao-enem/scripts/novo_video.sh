#!/usr/bin/env bash
# Cria a pasta de um vídeo novo a partir do modelo (vídeo de média/mediana/moda que já funciona).
# Uso: bash scripts/novo_video.sh producao/video04_porcentagem
set -euo pipefail
SKILL="$(cd "$(dirname "$0")/.." && pwd)"
DEST="${1:?informe a pasta de destino, ex.: producao/video04_porcentagem}"
mkdir -p "$DEST/fonts" "$DEST/capa/fonts" "$DEST/audio"
cp "$SKILL"/assets/template/{index.html,common.js,app.js,render.js,render_sync.js,sync.exemplo.json} "$DEST/"
cp "$SKILL"/assets/fonts/*.ttf "$DEST/fonts/"
cp "$SKILL"/assets/capa/{capa.html,shot_capa.js} "$DEST/capa/"
cp "$SKILL"/assets/template/common.js "$DEST/capa/"
cp "$SKILL"/assets/fonts/*.ttf "$DEST/capa/fonts/"
echo "Pronto: $DEST"
echo " - edite $DEST/app.js (STEPS, CARDS, cenas e título)"
echo " - quadros soltos: (cd $DEST && node render.js stills /tmp/stills 0,120,600)"
echo " - vídeo sem voz:  (cd $DEST && node render.js video ../saida/NOME_sem_audio.mp4)"
