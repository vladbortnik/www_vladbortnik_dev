#!/bin/bash

# Cloudflare Worker Deployment Script
# Run this ONLY when you change cloudflare-worker-resend.js

echo "🚀 Deploying Cloudflare Worker..."
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Error: Wrangler CLI not found"
    echo "Install it with: npm install -g wrangler"
    exit 1
fi

# Check if worker file exists
if [ ! -f "cloudflare-worker-resend.js" ]; then
    echo "❌ Error: cloudflare-worker-resend.js not found"
    exit 1
fi

# Check if secrets are set
echo "📋 Checking secrets..."
SECRET_LIST=$(wrangler secret list 2>&1)

if echo "$SECRET_LIST" | grep -q "RESEND_API_KEY"; then
    echo "✅ RESEND_API_KEY is set"
else
    echo "⚠️  RESEND_API_KEY not found"
    echo "Run: wrangler secret put RESEND_API_KEY"
fi

if echo "$SECRET_LIST" | grep -q "TURNSTILE_SECRET_KEY"; then
    echo "✅ TURNSTILE_SECRET_KEY is set"
else
    echo "⚠️  TURNSTILE_SECRET_KEY not found"
    echo "Run: wrangler secret put TURNSTILE_SECRET_KEY"
fi

echo ""
echo "🔄 Deploying Worker..."
wrangler deploy

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Worker deployed successfully!"
    echo ""
    echo "📍 Your Worker URL:"
    echo "   https://portfolio-contact-form.vladbortnik.workers.dev"
    echo ""
    echo "🧪 Test it:"
    echo "   curl -X POST https://portfolio-contact-form.vladbortnik.workers.dev"
else
    echo ""
    echo "❌ Deployment failed"
    exit 1
fi
