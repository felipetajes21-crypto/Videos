#!/usr/bin/env bash
# Instala o Vosk (reconhecimento de voz local) e o modelo pequeno de português.
# Precisa do host alphacephei.com liberado na rede do ambiente.
set -euo pipefail
python3 -c "import vosk" 2>/dev/null || {
  pip install -q --use-pep517 srt   # a dependência 'srt' não compila com o setuptools do sistema sem isso
  pip install -q --no-deps vosk
  pip install -q cffi tqdm requests websockets
}
M="$HOME/.cache/vosk/vosk-model-small-pt-0.3"
if [ ! -d "$M" ]; then
  mkdir -p "$HOME/.cache/vosk" && cd "$HOME/.cache/vosk"
  curl -sS -L -o model.zip https://alphacephei.com/vosk/models/vosk-model-small-pt-0.3.zip
  unzip -q model.zip && rm model.zip
fi
echo "Vosk ok, modelo em $M"
