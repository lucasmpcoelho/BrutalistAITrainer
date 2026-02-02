# BACKLOG — Brutalist AI Trainer

> Objetivo: Transformar o app em um **PT de bolso** que substitui personal trainer real.

---

## 🎯 Visão

O app deve funcionar como um PT real:
1. **Pré-treino:** Avalia como você está hoje e adapta
2. **Durante:** Dá dicas no momento certo, não só quando você pede
3. **Pós-série:** Coleta feedback e ajusta em tempo real
4. **Análise:** Observa sua forma e corrige (stretch goal)

---

## 🔥 Prioridade Alta

### [x] Adaptação dinâmica de treino via linguagem natural ✅
**Implementado em:** 2025-02-02

**Backend:**
- Nova tool `regenerate_program` no ai-tools.ts
- Função `regenerateProgramWithConstraints` no workout-generator.ts
- Suporta: temporaryEquipment, focusMuscles, excludeMuscles
- Mudanças temporárias arquivam programa original pra restore
- Prompt do Coach atualizado pra detectar mudanças de contexto
- Commit: c163c56

**Frontend:**
- Novo componente `ContextChangePrompts.tsx`
- Card "Algo mudou?" no Dashboard com 4 botões:
  - 🏨 Tô viajando
  - 🎯 Quero focar em...
  - 🤕 Tô com dor
  - 🔄 Voltei ao normal
- Navega pro Coach com mensagem pré-preenchida
- Commit: (sub-agent)

---

### [x] Pre-workout check-in ✅
**Implementado em:** 2025-02-02

- Sheet aparece ao clicar "Start Workout"
- 4 opções: 😴 Cansado, 💪 Normal, 🔥 Energizado, 🤕 Com dor
- Mostra sugestões de ajuste que usuário pode aceitar/rejeitar
- Normal vai direto pro treino
- Pode pular check-in se preferir
- Commit: 2e462a5

---

### [x] Feedback no Rest Screen (zero friction) ✅
**Implementado em:** 2025-02-02

- Durante rest, mostra último set (peso × reps)
- 3 botões: 😰 Hard, ✓ Good, 🔥 Easy
- Feedback é opcional (pode ignorar)
- Salva difficulty no banco (campo `sets.difficulty`)
- Visual confirmation quando feedback é registrado
- Commit: 874242e

---

### [x] Form cue proativo ao iniciar exercício ✅
**Implementado em:** 2025-02-02

- Campo `keyCue` adicionado ao schema (fallback: `instructions[0]`)
- Banner aparece por 4s após rest terminar
- Dismissível com tap
- Commit: b81c89b

---

## 📋 Prioridade Média

### [ ] Sugestão de ajuste baseada em feedback
**Problema:** Coletamos feedback mas não fazemos nada com ele.

**Solução:** Se usuário marca 😰 (difícil):
- No próximo set: "Tá pesado. Quer reduzir 2.5kg?" com botão rápido
- Se marca difícil 2x seguidas: "Quer reduzir pra 3 sets hoje?"

Se marca 🔥 (fácil) 2x:
- "Tá leve! Próximo set +2.5kg?"

**Impacto:** Alto — adaptação real como PT
**Esforço:** Médio (2-3 dias)

---

### [ ] Análise de forma pós-série (AI Vision)
**Problema:** Usuário não sabe se está executando certo. PT real observa e corrige.

**Solução MVP:**
1. Botão "Gravar série" opcional
2. Grava 15-30 segundos
3. Envia frames pra Gemini 1.5 Pro Vision
4. Mostra feedback: "Boa profundidade. Atenção: lombar arredondando nas últimas reps."

**Tech:**
- Gemini 1.5 Pro com video/frames
- Custo: ~$0.01-0.02 por análise
- Prompt específico por tipo de exercício

**Impacto:** Muito alto — diferencial único
**Esforço:** Médio-Alto (3-5 dias)

**Limitações conhecidas:**
- Depende do ângulo da câmera
- Não é live (é pós-série)
- Qualidade varia por exercício

---

### [ ] Contagem automática de reps
**Problema:** Usuário tem que lembrar quantas reps fez.

**Solução:**
- MediaPipe Pose no browser
- Detecta movimento repetitivo
- Conta reps automaticamente
- Usuário confirma/ajusta

**Impacto:** Médio — quality of life
**Esforço:** Alto (requer calibração por exercício)

---

## 🧊 Backlog (Later)

### [ ] Live form feedback
- MediaPipe + regras hardcoded por exercício
- "Costas retas!" quando detecta curvatura
- Muito trabalho, deixar pra depois de validar pós-série

### [ ] Voice commands durante treino
- "Próximo" / "Pular" / "Mais peso"
- Mãos ocupadas com peso

### [ ] Apple Watch integration
- Log sets do pulso
- Haptic quando rest acabar

### [ ] Playlist/Music integration
- Spotify connect
- Música muda baseado na intensidade

### [ ] Social/Accountability
- Compartilhar treino com amigo
- Streak competitions

### [ ] Progressive overload tracking
- Gráficos de evolução por exercício
- Sugestão automática de aumento de peso

---

## ✅ Concluído

- [x] Onboarding completo (10 perguntas)
- [x] Geração de treino personalizada (Focus Tracks)
- [x] AI Coach (IRON) com chat contextual
- [x] Exercise swap via AI tools
- [x] Form cues sheet com GIF
- [x] Rest timer
- [x] Set logging

---

## 📝 Notas de Produto

### Filosofia UX
- **Zero friction** — cada tap a mais é um usuário perdido
- **Proativo > Reativo** — app sugere, não espera pedido
- **PT real como benchmark** — "um PT faria isso?"

### Competidores
| App | Preço | Diferencial | Gap |
|-----|-------|-------------|-----|
| Tempo | $2,500 + $39/mo | Hardware + AI | Preço absurdo |
| Future | $150/mo | PT humano real | Caro demais |
| Fitbod | $13/mo | Geração de treino | Sem AI coach |
| Strong | $5/mo | Logging simples | Zero inteligência |

**Nossa oportunidade:** PT-level intelligence, preço de app.

---

*Última atualização: 2025-02-02*
