# Lesson: Governed deploy — verifiser verktøy FØR prosedyre dokumenteres

**Regel:** Før en operasjonell prosedyre (rollback, deploy, rotasjon) skrives
som standard, verifiser at (1) CLI-kommandoen faktisk finnes i gjeldende versjon,
(2) CI-workflowen matcher repoets verktøykjede. En dokumentert antakelse som ikke
er testet blir en «falsk standard» som svikter nøyaktig når den trengs.

**Hvorfor:** F3.6C fant to slike feil FØR de ble permanente Arch-standarder:
rollback-planen refererte en ikke-eksisterende wrangler-kommando, og deploy.yml var
en ødelagt stub som ga falsk rød CI. Begge ble fanget av Deploy Ready Gate + manuell
verifisering — bevis på at gaten beskytter, ikke bare dokumenterer.

**Arvet av:** Arch Audit v1 (F4) — hver audit-sjekk bærer `observed_at` + faktisk
verktøy-versjon, så «verifisert» betyr «testet mot faktisk runtime», ikke «antatt».
