
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the Telegram WebApp interface
interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    query_id: string;
    user: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
      photo_url?: string;
    };
    auth_date: string;
    hash: string;
  };
  ready: () => void;
  expand: () => void;
  close: () => void;
  isExpanded: boolean;
}

// Define the type for our context
interface TelegramContextType {
  webApp: TelegramWebApp | null;
  user: {
    id: number | null;
    username: string | null;
    firstName: string | null;
    lastName: string | null;
    photoUrl: string | null;
  };
  isReady: boolean;
}

// Create the context with a default value
const TelegramContext = createContext<TelegramContextType>({
  webApp: null,
  user: {
    id: null,
    username: null,
    firstName: null,
    lastName: null,
    photoUrl: null,
  },
  isReady: false,
});

// Create a provider component
export const TelegramProvider = ({ children }: { children: ReactNode }) => {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState({
    id: null as number | null,
    username: null as string | null,
    firstName: null as string | null,
    lastName: null as string | null,
    photoUrl: null as string | null,
  });

  useEffect(() => {
    // Check if we're running in Telegram WebApp
    if (window.Telegram && window.Telegram.WebApp) {
      const tgWebApp = window.Telegram.WebApp;
      setWebApp(tgWebApp);
      
      // Get user data if available
      if (tgWebApp.initDataUnsafe && tgWebApp.initDataUnsafe.user) {
        const userData = tgWebApp.initDataUnsafe.user;
        setUser({
          id: userData.id,
          username: userData.username || null,
          firstName: userData.first_name,
          lastName: userData.last_name || null,
          photoUrl: userData.photo_url || null,
        });
      }

      // Tell Telegram WebApp we're ready
      tgWebApp.ready();
      setIsReady(true);
    } else {
      // For development outside of Telegram
      console.log('Telegram WebApp not detected, running in development mode');
      setIsReady(true);
    }
  }, []);

  return (
    <TelegramContext.Provider value={{ webApp, user, isReady }}>
      {children}
    </TelegramContext.Provider>
  );
};

// Create a custom hook to use the context
export const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }
  return context;
};

// Add type definition for the Telegram WebApp global variable
declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}
