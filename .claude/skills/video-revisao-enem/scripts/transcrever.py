"""Transcreve uma narração em português com tempo por palavra (Vosk, roda local).
Uso: python3 scripts/transcrever.py narracao.mp3 narracao_palavras.json
Imprime "palavra@segundo" para montar as âncoras do sync.json."""
import json, os, subprocess, sys, tempfile, wave
from vosk import Model, KaldiRecognizer, SetLogLevel

src, out = sys.argv[1], sys.argv[2]
model_dir = os.environ.get('VOSK_MODEL', os.path.expanduser('~/.cache/vosk/vosk-model-small-pt-0.3'))
SetLogLevel(-1)
with tempfile.TemporaryDirectory() as tmp:
    wav = os.path.join(tmp, 'a.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-ac', '1', '-ar', '16000', wav], check=True)
    wf = wave.open(wav); rec = KaldiRecognizer(Model(model_dir), wf.getframerate()); rec.SetWords(True)
    words = []
    while True:
        d = wf.readframes(4000)
        if not d: break
        if rec.AcceptWaveform(d): words += json.loads(rec.Result()).get('result', [])
    words += json.loads(rec.FinalResult()).get('result', [])
json.dump(words, open(out, 'w'), ensure_ascii=False, indent=0)
dur = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', src], capture_output=True, text=True).stdout.strip()
print(f'duração do áudio: {dur} s · {len(words)} palavras')
print(' '.join(f"{w['word']}@{w['start']:.1f}" for w in words))
