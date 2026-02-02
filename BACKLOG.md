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

### [ ] Adaptação dinâmica de treino via linguagem natural
**Problema:** Sistema é determinístico demais. Usuário faz onboarding uma vez e fica preso àquele contexto. Vida real muda:
- Viajando com equipamento limitado
- Mudou de academia
- Quer focar em músculo específico
- Lesão temporária

**Solução:**

**1. Nova tool `regenerate_program` pro AI Coach:**
```typescript
regenerate_program({
  temporaryEquipment: ["dumbbell", "bench"],  // override
  focusMuscles: ["chest", "triceps"],         // priorizar
  excludeMuscles: ["shoulders"],               // injury/skip
  duration: "2_weeks" | "permanent",
  notes: "Viajando, hotel gym"
})
```

**2. Atualizar prompt do Coach:**
- Detectar mudanças de contexto (viagem, lesão, foco)
- Perguntar detalhes relevantes
- Chamar `regenerate_program` automaticamente

**3. UX: Quick-access "Algo mudou?" no Dashboard:**
```
"Algo mudou? Me conta:"
- 🏨 Tô viajando (equipamento limitado)
- 🎯 Quero focar em [músculo]  
- 🤕 Tô com dor em [área]
- 🔄 Voltei ao normal
```
Abre chat com Coach pré-preenchido pra facilitar.

**Exemplos de uso:**
- "Tô no hotel, só tem halteres até 20kg e banco" → regenera programa pra 2 semanas
- "Quero focar em peito no próximo mês" → ajusta split pra mais volume de chest
- "Machuquei o ombro" → remove exercícios de ombro, sugere alternativas

**Impacto:** Muito alto — transforma app estático em PT adaptável
**Esforço:** Médio-Alto (3-4 dias)

---

### [ ] Pre-workout check-in
**Problema:** App não sabe como o usuário está hoje. Treino é sempre o mesmo independente de sono, energia, dor.

**Solução:** Tela de 3 segundos antes de começar:
```
"Como você tá hoje?"
😴 Cansado  →  -10-20% volume
💪 Normal   →  treino planejado  
🔥 Energizado  →  pode sugerir +1 set
🤕 Com dor  →  oferece modificações/swaps
```

**Impacto:** Alto — diferencial de PT real
**Esforço:** Baixo (1 dia)

---

### [ ] Feedback no Rest Screen (zero friction)
**Problema:** Não sabemos se o set foi fácil/difícil. Não conseguimos adaptar.

**Solução:** Durante o rest timer, mostrar opção de feedback opcional:
```
┌─────────────────────────────┐
│     SYSTEM COOLING DOWN     │
│          01:23              │
│                             │
│   Último set: 80kg × 10     │
│      😰    ✓    🔥          │  ← tap opcional
│                             │
│        [ SKIP REST ]        │
└─────────────────────────────┘
```
- Se não tocar em nada → assume normal
- Se tocar → registra e usa pra sugerir ajustes

**Impacto:** Alto — feedback loop sem friction
**Esforço:** Baixo (1 dia)

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
