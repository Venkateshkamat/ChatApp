#!/bin/bash

# -----------------------------
# CONFIGURATION
# -----------------------------
RENDER_API_KEY="rnd_dpOiikeqKlufHc08ZyJk8RmV6BEE"
RENDER_SERVICE_ID="srv-d1srcvp5pdvs73csqebg"
README_FILE="README.md"
BADGE_LINE_IDENTIFIER="Render Deploy Status"

# -----------------------------
# STEP 1: Show current README badge line
# -----------------------------
echo "----- CURRENT BADGE LINE -----"
# grep "$BADGE_LINE_IDENTIFIER" "$README_FILE"

# -----------------------------
# STEP 2: Fetch latest deploy status from Render
# -----------------------------
RAW_RESPONSE=$(curl -s -H "Authorization: Bearer $RENDER_API_KEY" \
  "https://api.render.com/v1/services/$RENDER_SERVICE_ID/deploys")

echo "----- RAW RENDER RESPONSE -----"
echo "$RAW_RESPONSE"

STATUS=$(echo "$RAW_RESPONSE" | jq -r '.[0].deploy.status // empty')

# Fallback if STATUS is empty
if [ -z "$STATUS" ]; then
  STATUS="unknown"
fi

echo "----- PARSED STATUS -----"
echo "$STATUS"

# ----------------
