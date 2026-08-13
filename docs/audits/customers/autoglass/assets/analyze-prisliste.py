import xlrd, re, json
from collections import Counter

wb = xlrd.open_workbook('PROSEKT-API-16-MAI26-prisliste.xls')
sh = wb.sheet_by_index(0)

rows = []
for r in range(5, sh.nrows):
    varenr = str(sh.cell_value(r, 0)).strip()
    navn = str(sh.cell_value(r, 1)).strip()
    kommentar = str(sh.cell_value(r, 2)).strip()
    pris = sh.cell_value(r, 3)
    euro = str(sh.cell_value(r, 5)).strip()
    if not varenr and not navn:
        continue
    rows.append({
        'varenr': varenr, 'navn': navn, 'kommentar': kommentar,
        'pris': pris, 'euro': euro
    })

print("TOTALT datarader:", len(rows))

# Pris-typer
numeric = [r for r in rows if isinstance(r['pris'], float) and r['pris'] > 0]
priser = sorted(r['pris'] for r in numeric)
print(f"Rader med numerisk pris: {len(numeric)} / {len(rows)}")
if priser:
    print(f"Pris min: {priser[0]:.0f} kr, max: {priser[-1]:.0f} kr, median: {priser[len(priser)//2]:.0f} kr")
    avg = sum(priser)/len(priser)
    print(f"Pris snitt: {avg:.0f} kr")

# Med eurokode (glass) vs uten
med_euro = [r for r in rows if r['euro']]
uten_euro = [r for r in rows if not r['euro']]
print(f"\nMed Eurokode (glass): {len(med_euro)}, Uten Eurokode (tilbehør/frakt): {len(uten_euro)}")

# Kategorier via nøkkelord
def kategori(navn):
    u = navn.upper()
    if 'VISKERSETT' in u or 'VISKER' in u: return 'viskersett'
    if 'POST' in u or 'BRING' in u or 'FRAKT' in u: return 'frakt'
    if 'LIM' in u and 'GLASS' not in u: return 'lim'
    if 'PRIMER' in u: return 'primer'
    if 'KLIPS' in u: return 'klips'
    if 'PYNTELIST' in u or 'PYNT' in u: return 'pyntelist'
    if 'SENSOR' in u or 'SENSORGEL' in u or 'GEL' in u: return 'sensorgel'
    if 'FRONTRUTE' in u or 'FRONTRUTA' in u: return 'frontrute'
    if 'BAKRUTE' in u or 'BAKRUTA' in u or 'BAKGLASS' in u: return 'bakrute'
    if 'DØRRUTE' in u or 'DORRUTE' in u or 'DØRRGLASS' in u: return 'dorrute'
    if 'VENTILRUTE' in u or 'VENTIL' in u: return 'ventilrute'
    if 'SIDERUTE' in u or 'SIDEGLASS' in u: return 'siderute'
    if 'TAKRUTE' in u or 'TAKGLASS' in u: return 'takrute'
    if 'EKSOS' in u or 'SPEIL' in u: return 'annet'
    return 'glass/annet'

kat = Counter(kategori(r['navn']) for r in rows)
print("\nKATEGORIER (etter nøkkelord i varenavn):")
for k, v in kat.most_common(30):
    print(f"  {k}: {v}")

# Unike bilmerker (første 'ord' i navnet som består av bokstaver, men skip viskersett/frakt)
merker = Counter()
for r in rows:
    n = r['navn'].upper()
    if kategori(n) in ('viskersett', 'frakt', 'lim', 'primer', 'klips', 'pyntelist', 'sensorgel', 'annet'):
        continue
    # første token
    m = re.match(r'^([A-ZÆØÅ0-9]+)', n)
    if m and m.group(1).isalpha() and len(m.group(1)) >= 2:
        merker[m.group(1)] += 1
print("\nTOPP 40 BILMERKER (antall varer):")
for k, v in merker.most_common(40):
    print(f"  {k}: {v}")

# Sotet-grad / spesialkoder i kommentarfeltet
kom = Counter()
for r in rows:
    k = r['kommentar']
    for m in re.findall(r'#\s*-?\s*\d+\s*%#', k):
        kom[m] += 1
    if 'EMB' in k.upper(): kom['EMB (emballasje)'] += 1
    if 'NB' in k.upper(): kom['NB (merknad)'] += 1
print("\nKOMMENTARFELT-MØNSTRE:")
for k, v in kom.most_common(15):
    print(f"  {k}: {v}")

# Eksempler på ulike kategorier
print("\nEKSEMPLER:")
seen = set()
for r in rows:
    k = kategori(r['navn'])
    if k not in seen and k in ('frontrute','bakrute','dorrute','ventilrute','siderute','viskersett','frakt','sensorgel','lim','klips'):
        print(f"  [{k}] {r['varenr']} | {r['navn'][:45]} | {r['pris']:.0f} kr | {r['euro']}")
        seen.add(k)
