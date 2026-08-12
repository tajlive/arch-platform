# Lesson: Verifiser rendret DOM med Chrome --dump-dom

Ser du at `vision_analyze` feiler med `unknown variant "image_url"` → modellen er ikke
multimodal og kan ikke lese screenshots. Ikke kast bort tid på screenshots for egen
verifisering.

**Regel:** bruk headless Chrome `--dump-dom` + grep for å verifisere at JS faktisk rendret
korrekt DOM (navn, scores, tall). Screenshot brukes kun til leveranse til mennesker,
ikke som bevisgrunnlag for deg selv.

```
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --virtual-time-budget=3000 \
  --dump-dom "file:///sti/til/index.html" | grep '<selector>'
```

**Kilde:** F3.5 Arch Control Center-verifisering 2026-08-13. `browser_exec` kan også
feile (Browserbase uten CDP-endepunkt) — `--dump-dom` er alltid tilgjengelig lokalt.
