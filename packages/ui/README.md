# Arch UI — delt design-system

Kanonisk mørk premium-tema for Arch-plattformen. Begge apper kopierer dette temaet
inn i sin egen katalog (Pages deployer én app-katalog av gangen, så appene er
selvstendige).

Design-prinsipper (prioritet, jf. Tom F3.6 §8):
1. Klarhet — 2-minutters forståelse
2. Tillit — aldri vise antatt som observert
3. Målbar evidens — score + provenance synlig
4. Status-synlighet — observed/declared/unknown fargekodet
5. Elegant tetthet — rolig, premium, ikke debug-panel
6. Responsivt — mobil/desktop

Farger: bg #0b0e14 · panel #12161f · accent #5b8cff → #7c4dff · grønn #2ecc71 ·
gul #f1c40f · rød #e74c3c.

Ved endring: oppdater `apps/customer-portal/styles.css` og `apps/control-center/styles.css`
(eller flytt til en felles bygg-copy).
