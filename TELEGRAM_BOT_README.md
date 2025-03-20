
# Telegram Bot for COCO - Tap-to-Earn Adventure

This document explains how to set up and deploy your Telegram bot to Vercel.

## Prerequisites

1. A Telegram Bot token (obtained from BotFather)
2. A Vercel account
3. The Vercel CLI installed (optional, for local development)

## Setting up your Telegram Bot

1. Chat with [@BotFather](https://t.me/botfather) on Telegram
2. Use the `/newbot` command and follow the instructions to create a new bot
3. Save the token that BotFather gives you
4. Use the `/setdomain` command with BotFather to specify your mini app domain
5. Use the `/newapp` command with BotFather to create the mini app and link it to your bot

## Deploying to Vercel

### Option 1: Using the Vercel Dashboard

1. Fork or push this repository to GitHub/GitLab/Bitbucket
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project" and import your repository
4. Add the following environment variables:
   - `TELEGRAM_BOT_TOKEN`: Your bot token from BotFather
   - `MINI_APP_URL`: The URL of your deployed mini app
5. Click "Deploy"

### Option 2: Using Vercel CLI

1. Install Vercel CLI: `npm i -g vercel`
2. Login to Vercel: `vercel login`
3. Set up environment variables:
   ```
   vercel env add TELEGRAM_BOT_TOKEN
   vercel env add MINI_APP_URL
   ```
4. Deploy your project: `vercel --prod`

## Setting up the Webhook

After deploying, you need to register your webhook URL with Telegram:

```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://your-vercel-app-url.vercel.app/api/telegram-webhook
```

Replace `<YOUR_BOT_TOKEN>` with your actual bot token and `your-vercel-app-url` with your Vercel deployment URL.

## Local Development

For local development, you can use the Vercel CLI:

```
vercel dev
```

For testing webhook locally, you can use a service like ngrok to expose your local server.

## Troubleshooting

- If your bot doesn't respond, check the Vercel logs for any errors
- Ensure your webhook is set up correctly
- Verify that your environment variables are set properly in Vercel
