# Tournament Platform — Secure Starter

This package implements the architecture discussed:
- account registration/login
- SMS verification adapter
- referral links and referral attribution
- paid seat/order flow
- task/offer completion webhook with HMAC verification and idempotency
- ticket ledger (server-side)
- tournament creation, seat allocation and entry
- server-side cryptographic draw
- prize ledger
- withdrawal/payout request workflow
- admin audit log
- PostgreSQL production database
- rate limiting and strict CORS
- no secrets in frontend

IMPORTANT:
This is a production-oriented starter, not a claim that your service is legally ready to launch.
Real-money operation requires your payment/SMS accounts, production database, HTTPS, provider webhooks,
business verification, security testing, and legal/regulatory review for the jurisdiction in which you operate.

The frontend is static and can be hosted on GitHub Pages.
The Flask API can be hosted on Render or another Python host.
Use PostgreSQL for production. SQLite is not used by this package.

## Quick start

Backend:
1. Copy `.env.example` to `.env`.
2. Create a PostgreSQL database.
3. Set DATABASE_URL and all secrets.
4. `pip install -r requirements.txt`
5. `flask --app app run --debug`

Frontend:
1. Edit `frontend/config.js` and set API_BASE_URL.
2. Host the `frontend/` directory on GitHub Pages.

## Payment
The API contains a payment-provider interface and a Flutterwave-compatible starter.
Do not credit a seat from a browser success message. Credit only after a verified provider
webhook and server-side verification. Flutterwave documents UGX Uganda mobile-money collection
and webhook/verification flows in its current developer documentation.

## SMS
The SMS provider is an adapter. Configure your provider credentials in environment variables.
The included HTTP adapter is intentionally generic; plug in your chosen verified SMS provider.

## Task/offerwalls
Do not accept "task completed" from the browser. Configure your offer provider to call
`POST /api/webhooks/offers` with the shared HMAC secret. The endpoint is idempotent.

## Draw
The draw is performed by the backend using Python's `secrets` module. Every draw is recorded
with a pre-draw commitment and post-draw reveal. This is an audit mechanism, not a substitute
for any certification/regulatory requirement that may apply.

## Production checklist
- HTTPS everywhere
- PostgreSQL with backups
- exact CORS origin
- strong random secrets
- provider webhook signature validation
- payment amount/currency/reference verification
- payout status verification
- fraud/device/account controls
- admin MFA
- independent penetration test
- monitoring and alerting
- privacy/terms/competition rules
- legal/regulatory review before live UGX operation
