# DGL — Dearest Gentle Reader

A personal letter-writing app. Write letters now, deliver them later to your email. Also has quotes from the shows that gave me the idea: Bridgerton, HIMYM, Before Trilogy and many more...

## What it does

- **Write** — Compose letters on a parchment-style form. Set a future delivery date. The backend scheduler sends them via AWS SES at 8 AM ET on the chosen day.
- **Archive** — View all letters with their status (pending, sent). Delivered letters gradually pick up a sepia tone.
- **Memories** — Password-protected photo gallery. Polaroid-style cards with captions.
- **Timeline** — Milestone chapters with dates, displayed along a central vine.

### The letter form

<p align="center">
<img src="https://github.com/user-attachments/assets/placeholder" alt="" width="0" height="0">
</p>

```
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║   ⬤  ─────────────────────────────────────────────────   ║
║                                                          ║
║   FROM   Your name                                       ║
║          ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   ║
║                                                          ║
║   TO     recipient@email.com                             ║
║          ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   ║
║                                                          ║
║   SUBJECT                                                ║
║   A letter from the heart                                ║
║          ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   ║
║                                                          ║
║   YOUR LETTER                                            ║
║   ┌──────────────────────────────────────────────────┐   ║
║   │                                                  │   ║
║   │  Dearest gentle reader...                        │   ║
║   │                                                  │   ║
║   │                                                  │   ║
║   │                                                  │   ║
║   │                                                  │   ║
║   └──────────────────────────────────────────────────┘   ║
║                                                          ║
║   To be delivered upon  2026-03-20                       ║
║          ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─   ║
║                                                          ║
║   ┌──────────────────────────────────────────────────┐   ║
║   │              ⬤  Seal & Send                      │   ║
║   └──────────────────────────────────────────────────┘   ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

On submit, the letter folds into an envelope, gets stamped with a wax seal, and flies off screen with a petal burst.

## Stack

| Layer | Tech |
|-------|------|
| Backend | FastAPI, SQLite (aiosqlite), SQLAlchemy, APScheduler, AWS SES |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, TanStack Query |
| Infra | Docker Compose, NGINX, Certbot |

## Run locally

```bash
cp backend/.env.example backend/.env   # fill in values
docker compose up --build
```

Frontend at `http://localhost:3000`, API at `http://localhost:8000`.

## Deploy (EC2)

```bash
# On a fresh Ubuntu 24.04 instance:
sudo apt update && sudo apt install -y docker.io docker-compose-v2 nginx certbot python3-certbot-nginx
sudo usermod -aG docker ubuntu

git clone <repo> ~/dgl
cp backend/.env ~/dgl/backend/.env     # with production values

sudo ln -s ~/dgl/nginx/dgl.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

cd ~/dgl
docker compose -f docker-compose.prod.yml up -d
sudo certbot --nginx -d dgl.novyte.ai
```

After that, `./deploy.sh` pulls and rebuilds.

## Project structure

```
backend/
  app/
    routers/          # letters, photos, timeline, quotes
    services/         # scheduler, email (SES + Jinja2 templates)
    models.py
    main.py
frontend/
  src/
    pages/            # Home, Write, Archive, Timeline
    components/       # LetterComposer, EnvelopeAnimation, WaxSeal,
                      #   PolaroidCard, FloatingPetals, etc.
nginx/                # host-level NGINX config
docker-compose.yml        # dev
docker-compose.prod.yml   # prod (ports bound to 127.0.0.1)
deploy.sh
```

## Environment variables

| Variable | What |
|----------|------|
| `DATABASE_URL` | SQLite path |
| `SECRET_KEY` | JWT signing |
| `PHOTOS_PASSWORD` | Gallery access |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | SES credentials |
| `SES_SENDER_EMAIL` | Verified sender |
| `LETTER_SEND_HOUR` / `LETTER_SEND_TIMEZONE` | When the scheduler fires |
| `CORS_ORIGINS` | Allowed frontend origin |
