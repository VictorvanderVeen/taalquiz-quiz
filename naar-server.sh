#!/bin/bash
# Zet het mailscript van de taalquiz op de PocketBase-server en herstart PocketBase.
#   ./naar-server.sh             → alleen de scripts
#   ./naar-server.sh <sleutel>   → scripts + Brevo-API-sleutel
set -e
SERVER=victorvanderveen@85.10.151.75
cd "$(dirname "$0")"
scp pb_hooks/taalquiz_mail.pb.js pb_hooks/taalquiz_mail.js "$SERVER:/tmp/"
ssh "$SERVER" "sudo mkdir -p /opt/pocketbase/pb_hooks \
  && sudo mv /tmp/taalquiz_mail.pb.js /tmp/taalquiz_mail.js /opt/pocketbase/pb_hooks/ \
  && if [ -n '$1' ]; then echo '$1' | sudo tee /opt/pocketbase/pb_hooks/brevo.key >/dev/null && sudo chmod 600 /opt/pocketbase/pb_hooks/brevo.key; fi \
  && sudo chown -R pocketbase:pocketbase /opt/pocketbase/pb_hooks \
  && sudo systemctl restart pocketbase && sleep 2 && systemctl is-active pocketbase"
