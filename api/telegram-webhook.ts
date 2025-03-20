
import { VercelRequest, VercelResponse } from '@vercel/node';

// Telegram Bot interface types
interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: TelegramCallbackQuery;
}

interface TelegramMessage {
  message_id: number;
  from: TelegramUser;
  chat: TelegramChat;
  text?: string;
}

interface TelegramCallbackQuery {
  id: string;
  from: TelegramUser;
  message?: TelegramMessage;
  data?: string;
}

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
}

interface TelegramChat {
  id: number;
  type: string;
}

// Function to send messages back to Telegram
async function sendTelegramMessage(chatId: number, text: string, inlineKeyboard?: any) {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  if (!BOT_TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN environment variable is not set');
    return;
  }

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  
  const data = {
    chat_id: chatId,
    text: text,
    parse_mode: 'HTML',
  };

  if (inlineKeyboard) {
    Object.assign(data, {
      reply_markup: {
        inline_keyboard: inlineKeyboard
      }
    });
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
  }
}

// Main webhook handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const update: TelegramUpdate = req.body;
    
    // Handle regular messages
    if (update.message?.text) {
      const chatId = update.message.chat.id;
      const text = update.message.text;
      
      // Handle /start command
      if (text === '/start') {
        const welcomeText = 'Welcome to COCO - Tap-to-Earn Adventure! Choose an option:';
        const keyboard = [
          [{ text: 'Play Now', web_app: { url: process.env.MINI_APP_URL || 'https://your-vercel-app-url.vercel.app' } }],
          [{ text: 'About', callback_data: 'about' }]
        ];
        
        await sendTelegramMessage(chatId, welcomeText, keyboard);
      } 
      // Handle other messages
      else {
        const replyText = 'Use the /start command to see available options.';
        await sendTelegramMessage(chatId, replyText);
      }
    }
    
    // Handle callback queries (button clicks)
    if (update.callback_query && update.callback_query.data) {
      const chatId = update.callback_query.message?.chat.id;
      const callbackData = update.callback_query.data;
      
      if (callbackData === 'about' && chatId) {
        const aboutText = 'COCO is a tap-to-earn adventure game where you can collect tokens and play mini-games to earn rewards!';
        await sendTelegramMessage(chatId, aboutText);
      }
    }
    
    // Always respond with 200 OK to Telegram
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
