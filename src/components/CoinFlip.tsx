
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/hooks/useGame';
import { Coins } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const CoinFlip = () => {
  const { state, playCoinFlip } = useGame();
  const [betAmount, setBetAmount] = useState(5);
  const [choice, setChoice] = useState<'heads' | 'tails'>('heads');
  const [isFlipping, setIsFlipping] = useState(false);
  
  const maxBet = state.tokens;
  
  // Memoize the potential win calculation
  const potentialWin = useMemo(() => betAmount * 2, [betAmount]);
  
  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setBetAmount(Math.min(value, maxBet));
    } else {
      setBetAmount(0);
    }
  };
  
  const handleFlip = async () => {
    if (isFlipping) return;
    
    setIsFlipping(true);
    await playCoinFlip(betAmount, choice);
    setIsFlipping(false);
  };
  
  return (
    <motion.div 
      className="game-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Coins className="h-6 w-6 text-coco-primary" />
        <h2 className="text-xl font-display font-semibold">CALIMB - Coin Flip</h2>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <div className="flex justify-center pb-4">
          <motion.div 
            className="coin relative"
            animate={isFlipping ? { rotateY: "1800deg" } : {}}
            transition={isFlipping ? { duration: 1.5, ease: "easeOut" } : {}}
          >
            <div className="coin-front flex items-center justify-center">
              <span className="font-display font-bold">HEADS</span>
            </div>
            <div className="coin-back flex items-center justify-center">
              <span className="font-display font-bold">TAILS</span>
            </div>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              choice === 'heads'
                ? 'bg-coco-primary text-white'
                : 'bg-muted text-muted-foreground'
            }`}
            onClick={() => setChoice('heads')}
            disabled={isFlipping}
          >
            Heads
          </Button>
          <Button
            type="button"
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              choice === 'tails'
                ? 'bg-coco-primary text-white'
                : 'bg-muted text-muted-foreground'
            }`}
            onClick={() => setChoice('tails')}
            disabled={isFlipping}
          >
            Tails
          </Button>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Bet Amount</label>
          <Input
            type="number"
            value={betAmount}
            onChange={handleBetChange}
            min={1}
            max={maxBet}
            disabled={isFlipping}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Min: 1</span>
            <span>Max: {maxBet}</span>
          </div>
        </div>
        
        <div className="p-3 bg-muted/50 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">Potential Win</p>
          <p className="text-lg font-medium">{potentialWin} COCO</p>
        </div>
        
        {state.lastCoinFlip && !isFlipping && (
          <div className="text-center p-2 rounded-md bg-muted/30">
            <p className="text-sm">Last flip: <span className="font-medium capitalize">{state.lastCoinFlip}</span></p>
          </div>
        )}
        
        <Button 
          className="btn-primary w-full"
          onClick={handleFlip}
          disabled={isFlipping || betAmount <= 0 || betAmount > state.tokens}
        >
          {isFlipping ? "Flipping..." : "Flip Coin"}
        </Button>
      </div>
    </motion.div>
  );
};

export default CoinFlip;
