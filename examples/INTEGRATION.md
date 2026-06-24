# Integrating with VEIL

VEIL audits a trade before execution. Send a POST, get a verdict.

## Run it (no Bitget keys needed  falls back to real cached values)

git clone https://github.com/0xkinno/veil
cd veil
npm install
npm run dev

## Reproduce the sample audit

curl -X POST http://localhost:3000/api/audit -H "Content-Type: application/json" -d "@examples/sample-request.json"

Input:  examples/sample-request.json
Output: examples/sample-response.json

## Call from your own agent

const res = await fetch("https://<your-veil-url>/api/audit", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ asset: "BTC/USDT", direction: "LONG", agentId: "momentum" }),
})
const audit = await res.json()
if (audit.verdict === "APPROVED") { /* execute */ } else { /* blocked */ }

## Verdict rule

APPROVED if finalScore >= 65 AND layersPassed >= 3, else BLOCKED.
