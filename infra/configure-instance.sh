#!/bin/bash
set -euo pipefail

dnf install -y nginx nodejs
mkdir -p /opt/pani-puri-house/server /var/lib/pani-puri-house
chown ec2-user:ec2-user /var/lib/pani-puri-house
chown -R ec2-user:ec2-user /usr/share/nginx/html

rm -f /etc/nginx/conf.d/default.conf
cat > /etc/nginx/conf.d/pani-puri-house.conf <<'NGINX'
server {
    listen 80 default_server;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;
    client_max_body_size 16k;

    location /api/ {
        proxy_pass http://127.0.0.1:3000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
NGINX

cat > /etc/systemd/system/pani-puri-house.service <<'SERVICE'
[Unit]
Description=Pani Puri House API
After=network.target

[Service]
Type=simple
User=ec2-user
Group=ec2-user
WorkingDirectory=/opt/pani-puri-house
Environment=PORT=3000
Environment=ORDERS_FILE=/var/lib/pani-puri-house/orders.json
ExecStart=/usr/bin/node /opt/pani-puri-house/server/index.js
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target
SERVICE

nginx -t
systemctl daemon-reload
systemctl enable --now nginx pani-puri-house
