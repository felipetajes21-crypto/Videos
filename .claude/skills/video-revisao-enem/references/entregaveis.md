# Entregáveis de texto: roteiro de voz, legenda, capa

## Roteiro de voz
Salve em `roteiro/VOZ_<video>.md`, com três partes:

1. **Texto corrido** para colar no gerador de voz, um bloco por passo.
   - ~3 palavras/s (60 s ≈ 175 palavras). Tom de professor jovem conversando.
   - **Números por extenso** ("trinta e cinco", "quarenta mil"), para a voz não ler "35" de um jeito estranho.
   - **Reticências antes de cada resultado** ("…e a média é sete") criam a pausa em que a animação aparece.
   - Abra com o assunto em uma frase; no meio, um gancho para a pegadinha ("Mas segura, que tem pegadinha"); termine com "Salva pra revisar… e boa prova!".
2. **Tabela de sincronia:** tempo × fala × o que está na tela.
3. **Dicas de geração:** sugestão de voz (jovem e animada para estudante), stability 40–45%, style 25–35%, speed 1,0–1,05, e gerar em 3 partes para poder refazer só um trecho.

## Legenda / descrição
Salve em `roteiro/LEGENDA_<video>.md`:
- **Instagram:** gancho em 1 linha com emoji ⏱️ → frase "cai todo ano" → 1 linha por conceito com emoji (📊 📍 🔁) → "⚠️ DICA ENEM" com a pegadinha → 3 chamadas (💾 salva · 📤 manda pra quem vai fazer a prova · 💬 comenta o próximo assunto) → 10–12 hashtags (#enem #enem<ano> #revisaoenem + matéria + assunto + #vestibular #estudos).
- **TikTok:** 1–2 frases + 6–7 hashtags (inclua #fyp).
- **Comentário fixado:** resumo de uma linha com as fórmulas.
- Entregue no chat dentro de blocos de código, para o usuário copiar fácil.

## Capa (`capa/capa.html`)
- 1080×1920. Elementos: selo escuro "REVISÃO ENEM · Nº DIA" → título em 2–3 linhas grandes (Luckiest Guy rosa com contorno) → **uma ilustração que resume o assunto** (no modelo, o gráfico com a linha da média) → selo amarelo girado com o gancho ("TEM PEGADINHA!") → faixa rosa "EM 1 MINUTO" com o cronômetro ✓ (o mesmo da foto de perfil).
- Tudo que importa entre y 240 e 1680 (recorte 3:4 da grade). Gere a prévia recortada e mostre as duas.
- Mantenha o mesmo modelo em todos os vídeos e troque só o título e a ilustração, para a grade do perfil ficar padronizada.

## Identidade do perfil (já definida com o usuário)
- Nome sugerido: **Revisa em 1 Min** (@revisaem1min). Foto de perfil: cronômetro com ✓ em fundo rosa (`assets/capa/avatar.html`, opção C; `node shot_perfil.js` gera A, B e C).
