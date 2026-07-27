#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

LAN_IP="$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || true)"
PORT="${APP_PORT:-8080}"

prepare_production_assets() {
  echo "▸ Sediakan asset production (wajib untuk client luar)..."
  docker compose --profile frontend stop node 2>/dev/null || true
  rm -f public/hot
  docker compose --profile frontend run --rm node npm run build >/dev/null
  echo "  Asset production siap."
  echo ""
}

echo "=== Belia Hub — public preview ==="
echo ""

if [[ "${1:-}" == "--tunnel" ]]; then
  prepare_production_assets
  docker compose --profile public up -d tunnel
  echo "▸ Tunggu URL tunnel..."
  sleep 8
  URL="$(docker compose logs tunnel 2>&1 | grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' | tail -1)"
  if [[ -n "$URL" ]]; then
    echo ""
    echo "  Kongsi link ini dengan client:"
    echo "  $URL"
    echo ""
  else
    echo "  URL belum muncul — jalankan: docker compose logs tunnel | grep trycloudflare"
    echo ""
  fi
  exit 0
fi

echo "Pastikan stack berjalan: docker compose up -d"
echo ""
echo "PENTING: Jangan hidupkan Vite dev (node) bila kongsi dengan client."
echo "         Dev server guna localhost:5173 — client luar akan dapat blank page."
echo ""

if [[ -n "$LAN_IP" ]]; then
  echo "▸ Same WiFi / LAN:"
  echo "  http://${LAN_IP}:${PORT}"
  echo ""
fi

echo "▸ Internet (remote client):"
echo "  ./scripts/share-public.sh --tunnel"
echo ""
