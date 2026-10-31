# RakshaPay AI

**Detect the scam before the payment.**

Hackathon: GRAVITON 2026 — CGC University Mohali

RakshaPay AI is a simulated, AI-powered payment safety layer. It detects social-engineering attack chains across messages, URLs, prototype device signals, and transaction behavior **before** a fictional Pay action.

This is a hackathon MVP. It does **not** connect to real UPI, banks, or device app inspection.

## What it does

Communication + URL + Device + Transaction = **Attack chain** = **Risk decision**

The LLM extracts signals. A deterministic risk engine makes `ALLOW` / `VERIFY` / `HOLD` / `BLOCK`.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Demo mode works with empty keys. Set `NEXT_PUBLIC_DEMO_MODE=true` (default in `.env.example`).

```
OPENAI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_DEMO_MODE=true
```

- OpenAI is optional. If missing or failing, fallback keyword analysis is used.
- Supabase is optional. If missing, history is stored in memory for the server process.
- Optional schema: `supabase/schema.sql`

```bash
npm test
npm run lint
npm run build
```

## 3-minute judge demo

1. Open the dashboard. Protection status is **ACTIVE**.
2. Click **Safe Payment**. Review Payment. Decision should be **ALLOW**.
3. Click **Fake Bank KYC**. Show message analysis, suspicious URL, then Review Payment.
4. Show the **Attack chain**, risk score, and **HOLD/BLOCK**.
5. Run **Digital Arrest** or **Hinglish UPI Scam**. Show **PAYMENT BLOCKED**.
6. Point out: the model does not make the final decision — weights and thresholds do.
7. Open **Threat history**.

## Safety labels

- Payment UI: **SIMULATED UPI PAYMENT**
- Device module: **PROTOTYPE DEVICE SECURITY SIGNAL**
- All holds/blocks are in-app only.

Do not enter real OTPs, UPI PINs, or banking passwords. Demo UPI IDs are fictional (`rahul.sharma@oksbi`).
