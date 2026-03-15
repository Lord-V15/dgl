#!/bin/bash
set -e
cd /home/ubuntu/dgl
git pull origin main
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
echo "Deployed successfully"
