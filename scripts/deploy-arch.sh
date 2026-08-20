#!/usr/bin/env bash
# ============================================================
# deploy-arch.sh — Controlled production deploy for arch-platform
#
# UTFØRER HELE KJEDEN og bekrefter hvert steg:
#   1. Git: verifiser ren arbeidskatalog + pushet state
#   2. Build: collect.mjs (regenererer data.js)
#   3. Deploy: wrangler pages deploy (Customer Portal)
#   4. Prod-smoke: curl på forside + axn.css + assets
#   5. Git push: SKYVER ALLTID til origin/main (GH-synk)
#   6. Bekreft: lokal HEAD == origin/main
#
# KRAV: kilde klarpakke/.env.local (CLOUDFLARE_API_TOKEN) før kjøring.
# ============================================================
set -euo pipefail

cd "$(dirname "$0")/.."
REPO="arch-platform"
BRANCH="main"

log()  { echo -e "\033[1;34m[deploy]\033[0m $*"; }
ok()   { echo -e "\033[1;32m  ✓\033[0m $*"; }
fail() { echo -e "\033[1;31m  ✗\033[0m $*"; exit 1; }

# 1. Git — ren katalog + ingen u-pushet commits fra før
log "1/6 Git-sjekk"
if [ -n "$(git status --porcelain)" ]; then
  echo "  ⚠ Ucommittede filer:"
  git status --porcelain
  fail "Commit endringene før deploy (skriptet deployer ikke direkte-commit, det er en egen bevisst handling)."
fi
if [ "$(git rev-parse --abbrev-ref HEAD)" != "$BRANCH" ]; then
  fail "Kjører på $(git rev-parse --abbrev-ref HEAD), forventet $BRANCH"
fi
git fetch origin "$BRANCH" 2>/dev/null || true
LOCAL_HEAD=$(git rev-parse HEAD)
REMOTE_HEAD=$(git rev-parse origin/$BRANCH 2>/dev/null || echo "n/a")
if [ "$LOCAL_HEAD" != "$REMOTE_HEAD" ]; then
  ok "Lokal ${LOCAL_HEAD:0:8} er i fork av origin/${BRANCH} — vil pushe ${LOCAL_HEAD:0:8} → ${REMOTE_HEAD:0:8}"
else
  ok "Allerede synkronisert (${LOCAL_HEAD:0:8})"
fi

# 2. Build
log "2/6 Build (collect.mjs)"
npm run build > /tmp/arch-build.log 2>&1 || { tail -20 /tmp/arch-build.log; fail "Build feilet"; }
ok "Build grønn"

# 3. Deploy
log "3/6 Deploy Customer Portal"
DEPLOY_OUT=$(npx wrangler pages deploy apps/customer-portal --project-name arch-platform --branch main 2>&1)
echo "$DEPLOY_OUT" | grep -E "Deployment complete|Error" || true
if ! echo "$DEPLOY_OUT" | grep -q "Deployment complete"; then
  echo "$DEPLOY_OUT" | tail -20
  fail "Deploy feilet"
fi
DEPLOY_URL=$(echo "$DEPLOY_OUT" | grep -oE "https://[a-z0-9]+\.arch-platform\.pages\.dev" | head -1)
ok "Deployet: ${DEPLOY_URL:-se over}"

# 4. Prod-smoke
log "4/6 Prod-smoke (arch.axn.no)"
sleep 6
for url in "" "axn.css" "assets/logo.svg" "assets/favicon.svg"; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://arch.axn.no/$url")
  [ "$CODE" = "200" ] || fail "Smoke feilet: /$url → $CODE"
done
ok "Alle smoke-ruter 200"

# 5. Git push — ALLTID
log "5/6 Git push → origin/${BRANCH}"
# (Commit forventes allerede gjort; dette sikrer at det som er committed også er på GH)
git push origin "$BRANCH" 2>&1 | tail -3 || fail "git push feilet"
ok "Push utført"

# 6. Bekreft synkronisering
log "6/6 Bekreft GH-synk"
git fetch origin "$BRANCH" 2>/dev/null || true
LOCAL_HEAD=$(git rev-parse HEAD)
REMOTE_HEAD=$(git rev-parse origin/$BRANCH)
if [ "$LOCAL_HEAD" = "$REMOTE_HEAD" ]; then
  ok "Lokal == origin/${BRANCH} == ${LOCAL_HEAD:0:8}"
else
  fail "DESYNK: lokal ${LOCAL_HEAD:0:8} ≠ origin ${REMOTE_HEAD:0:8}"
fi

log "✓ Deploy fullført. Prod live + GitHub synkronisert."
