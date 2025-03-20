import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'sonner';
import { useTelegram } from './TelegramContext';

type GameState = {
  tokens: number;
  tokensPerClick: number;
  totalClicks: number;
  lastDiceRoll: number | null;
  lastCoinFlip: 'heads' | 'tails' | null;
  history: Array<{ action: string; amount: number; timestamp: number }>;
};

type GameAction =
  | { type: 'ADD_TOKENS'; payload: number }
  | { type: 'DEDUCT_TOKENS'; payload: number }
  | { type: 'INCREMENT_CLICKS' }
  | { type: 'SET_DICE_ROLL'; payload: number }
  | { type: 'SET_COIN_FLIP'; payload: 'heads' | 'tails' }
  | { type: 'RESET_GAME' };

const initialState: GameState = {
  tokens: 50, // Starting amount
  tokensPerClick: 1,
  totalClicks: 0,
  lastDiceRoll: null,
  lastCoinFlip: null,
  history: [],
};

// Save and load game state from localStorage
const getStorageKey = (userId: number | null) => {
  return userId ? `coco_game_state_${userId}` : 'coco_game_state_guest';
};

const loadGameState = (userId: number | null): GameState => {
  try {
    const savedState = localStorage.getItem(getStorageKey(userId));
    return savedState ? JSON.parse(savedState) : initialState;
  } catch (error) {
    console.error('Failed to load game state:', error);
    return initialState;
  }
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'ADD_TOKENS':
      return {
        ...state,
        tokens: state.tokens + action.payload,
        history: [
          {
            action: 'earned',
            amount: action.payload,
            timestamp: Date.now(),
          },
          ...state.history.slice(0, 19),
        ],
      };
    case 'DEDUCT_TOKENS':
      return {
        ...state,
        tokens: Math.max(0, state.tokens - action.payload),
        history: [
          {
            action: 'spent',
            amount: action.payload,
            timestamp: Date.now(),
          },
          ...state.history.slice(0, 19),
        ],
      };
    case 'INCREMENT_CLICKS':
      return {
        ...state,
        totalClicks: state.totalClicks + 1,
      };
    case 'SET_DICE_ROLL':
      return {
        ...state,
        lastDiceRoll: action.payload,
      };
    case 'SET_COIN_FLIP':
      return {
        ...state,
        lastCoinFlip: action.payload,
      };
    case 'RESET_GAME':
      return initialState;
    default:
      return state;
  }
};

type GameContextType = {
  state: GameState;
  handleClick: () => void;
  playDiceRoll: (betAmount: number, winChance: number) => Promise<boolean>;
  playCoinFlip: (betAmount: number, choice: 'heads' | 'tails') => Promise<boolean>;
  resetGame: () => void;
};

export const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useTelegram();
  const [state, dispatch] = useReducer(gameReducer, null, () => loadGameState(user.id));

  // Save state to localStorage whenever it changes, using the user ID if available
  useEffect(() => {
    localStorage.setItem(getStorageKey(user.id), JSON.stringify(state));
  }, [state, user.id]);

  const handleClick = () => {
    dispatch({ type: 'INCREMENT_CLICKS' });
    dispatch({ type: 'ADD_TOKENS', payload: state.tokensPerClick });
    
    // Random chance to get bonus tokens (5% chance)
    if (Math.random() < 0.05) {
      const bonus = Math.floor(Math.random() * 5) + 1;
      dispatch({ type: 'ADD_TOKENS', payload: bonus });
      toast.success(`Bonus! +${bonus} COCO`);
    }
  };

  const playDiceRoll = async (betAmount: number, winChance: number): Promise<boolean> => {
    if (betAmount <= 0 || betAmount > state.tokens) {
      toast.error('Invalid bet amount');
      return false;
    }

    if (winChance <= 0 || winChance > 95) {
      toast.error('Win chance must be between 1-95%');
      return false;
    }

    // Deduct bet amount first
    dispatch({ type: 'DEDUCT_TOKENS', payload: betAmount });

    // Simulate dice roll with animation timing
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Random number 1-100
    const roll = Math.floor(Math.random() * 100) + 1;
    dispatch({ type: 'SET_DICE_ROLL', payload: roll });

    // Calculate payout based on win chance (higher risk = higher reward)
    const payout = Math.floor(betAmount * (95 / winChance));

    // Check if player won
    if (roll <= winChance) {
      dispatch({ type: 'ADD_TOKENS', payload: payout });
      toast.success(`You won ${payout} COCO!`);
      return true;
    } else {
      toast.error(`You lost ${betAmount} COCO!`);
      return false;
    }
  };

  const playCoinFlip = async (betAmount: number, choice: 'heads' | 'tails'): Promise<boolean> => {
    if (betAmount <= 0 || betAmount > state.tokens) {
      toast.error('Invalid bet amount');
      return false;
    }

    // Deduct bet amount first
    dispatch({ type: 'DEDUCT_TOKENS', payload: betAmount });

    // Simulate coin flip with animation timing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 50/50 chance
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    dispatch({ type: 'SET_COIN_FLIP', payload: result });

    // Check if player won
    if (result === choice) {
      dispatch({ type: 'ADD_TOKENS', payload: betAmount * 2 });
      toast.success(`You won ${betAmount * 2} COCO!`);
      return true;
    } else {
      toast.error(`You lost ${betAmount} COCO!`);
      return false;
    }
  };

  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
    toast.info('Game reset');
  };

  return (
    <GameContext.Provider
      value={{
        state,
        handleClick,
        playDiceRoll,
        playCoinFlip,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
