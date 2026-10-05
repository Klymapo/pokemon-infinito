#!/usr/bin/env bash
# Reconstruye app/lib/ps-sim.js: el simulador de combate de Pokémon Showdown (MIT) empaquetado para navegador.
# Cambios respecto al original (ps-browser.patch):
#  - datos cargados estáticamente (browser-shim.ts) en vez de require() dinámico
#  - Dinamax permitido en gen 9 si battle.allowDynamax = true (antes de setPlayer)
#  - sin dependencias de Node (fs, path, util, ts-chacha20, generadores de equipos aleatorios)
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
WORK="${1:-/tmp/ps-build}"
COMMIT=9fb3a5b99f1a0bea17f495c5cc1bfe04fdd19c3e
rm -rf "$WORK" && git clone https://github.com/smogon/pokemon-showdown "$WORK"
cd "$WORK" && git checkout -q "$COMMIT"
cp "$HERE/browser-shim.ts" "$HERE/browser-entry.ts" sim/
git apply "$HERE/ps-browser.patch"
bun build sim/browser-entry.ts --target=browser --format=esm --minify --outfile="$HERE/../app/lib/ps-sim.js"
