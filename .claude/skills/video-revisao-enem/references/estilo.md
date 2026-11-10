# Estilo visual (desenhado à mão / "stop motion")

A referência foi uma animação explicativa de receita (prompt-motion.com/ror-fly-9950f1). O que faz o estilo funcionar:

## Movimento
- **Boil:** o traço muda levemente **a cada 4 quadros** (`BOIL = floor(f/4)` em `renderFrame`). Medido na referência: parado, a imagem só muda a cada 4 quadros; em movimento, muda todo quadro. Isso dá o ar de desenho quadro a quadro. Não aumente `amp` acima de ~2 px, senão vira tremedeira.
- **Entradas com mola:** `pop(f, entra, sai)` + `withPop` (easeOutBack de 12 quadros e saída encolhendo em 10). Tudo que aparece "pula"; nada surge do nada.
- **Um evento por fala:** cada número, palavra ou ideia da narração tem algo acontecendo na tela (barra acende, número se ordena, bolinha cai, seta desenha). A tela nunca fica parada por mais de ~2 s.
- **Sem cortes:** o vídeo é um palco contínuo. As cenas trocam com pop-out/pop-in no mesmo fundo de papel.

## Paleta (em `common.js` → `COL`)
| Uso | Cor |
|---|---|
| Papel (fundo, com pontinhos de textura) | `#FAF6EF` |
| Tinta (contornos, texto) | `#2B2B2E` |
| Destaque | rosa `#E5636B` · sombra do rosa `#B9474F` · sombra do card `#F4C4C6` |
| Inativo | `#B9B6B0` / `#C9C5BE` / `#D9D5CE` |
| Apoio | azul-água `#A9D8EA`/`#BFE3F0` · amarelo do selo de gancho `#F2B33D` |
Uma cor de destaque só (rosa). O amarelo aparece só em selos de gancho ("TEM PEGADINHA!") e nos brilhos finais.

## Tipografia
- **Luckiest Guy** (`F_DISPLAY`): títulos, número grande do card, rótulos. Só tem maiúsculas, então **unidades** ("g/cm³") vão em Patrick Hand ao lado do número (campo `unit` do card), senão aparecem como "G/CM³".
- **Patrick Hand** (`F_HAND`): todo texto explicativo.
- Títulos com contorno escuro (`outline`) + sombra deslocada em rosa escuro (`shadow`).

## Layout 1080×1920 (zonas usadas no modelo)
| Zona | y |
|---|---|
| Título (selo + 2 linhas + subtítulo) | 80–420 |
| Palco das cenas | 440–1200 |
| Card do passo | 1250–1610 |
| Trilha de etapas | 1700–1820 |
Em vídeo, a parte de baixo (~1650+) pode ficar sob a interface do app. A trilha é decorativa, então não ponha informação essencial ali.

## Componentes prontos (`app.js` do modelo)
- `drawTitle`: letras que pulam uma a uma e depois sobem para o topo.
- `drawCard`: "PASSO X DE N", número grande, rótulo, frase, barra de progresso com contador.
- `drawStepper`: círculos numerados; o atual com contorno escuro; os concluídos ficam rosa com ✓ desenhado.
- `tile` (quadradinho com número), barras de gráfico, bolinhas que caem com quique (`easeOutBounce`), notinhas coloridas do resumo, brilhos finais.

## Erros que já aconteceram (confira sempre)
1. **Texto em cima de barra ou de quadradinho:** a fórmula invadiu a barra mais alta, e "(5+7)÷2" cobriu os quadradinhos. Calcule o topo do maior elemento e posicione o texto acima, com folga de ~40 px.
2. **Rótulos de linhas próximas se encavalando** (média × mediana): ponha um à esquerda e outro em outra altura, nunca os dois na ponta direita.
3. **`textAlign` vazando:** funções que mudam `ctx.textAlign` sem `save/restore` desalinham todo o texto seguinte. `text()` já faz save/restore. Faça o mesmo em código novo.
4. **Objeto recortado pelo clip do copo/recipiente:** algo que entra de fora (cubo caindo) deve ser desenhado fora do clip (callback `behind`), e só a água vai dentro do clip.
5. **Legenda escondida por outro objeto que entra depois:** confira a ordem de desenho.
