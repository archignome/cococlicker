
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/hooks/useGame';
import { ArrowRight } from 'lucide-react';
import { DiceIcon } from '@/components/ui/dice-icon';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const DiceRoll = () => {
  const { state, playDiceRoll } = useGame();
  const [betAmount, setBetAmount] = useState(5);
  const [winChance, setWinChance] = useState(50);
  const [isRolling, setIsRolling] = useState(false);
  
  const maxBet = state.tokens;
  
  // Memoize calculations to improve performance
  const potentialWin = useMemo(() => 
    Math.floor(betAmount * (95 / winChance)), 
    [betAmount, winChance]
  );
  
  const multiplier = useMemo(() => 
    (95 / winChance).toFixed(2), 
    [winChance]
  );
  
  const handleWinChanceChange = (value: number[]) => {
    setWinChance(value[0]);
  };
  
  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setBetAmount(Math.min(value, maxBet));
    } else {
      setBetAmount(0);
    }
  };
  
  const handleRoll = async () => {
    if (isRolling) return;
    
    setIsRolling(true);
    await playDiceRoll(betAmount, winChance);
    setIsRolling(false);
  };
  
  return (
    <motion.div 
      className="game-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <DiceIcon className="h-6 w-6 text-coco-primary" />
        <h2 className="text-xl font-display font-semibold">Dice Roll</h2>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Win Chance: {winChance}%</label>
            <span className="text-sm text-muted-foreground">
              Roll 1-{winChance} to win
            </span>
          </div>
          <Slider
            value={[winChance]}
            min={1}
            max={95}
            step={1}
            onValueChange={handleWinChanceChange}
            disabled={isRolling}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Bet Amount</label>
          <Input
            type="number"
            value={betAmount}
            onChange={handleBetChange}
            min={1}
            max={maxBet}
            disabled={isRolling}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Min: 1</span>
            <span>Max: {maxBet}</span>
          </div>
        </div>
        
        <div className="p-3 bg-muted/50 rounded-lg flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Potential Win</p>
            <p className="text-lg font-medium">{potentialWin} COCO</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Multiplier</p>
            <p className="text-lg font-medium">{multiplier}x</p>
          </div>
        </div>
        
        <div className="flex justify-center">
          {state.lastDiceRoll !== null && (
            <motion.div 
              className={`dice ${isRolling ? 'animate-dice-roll' : ''}`}
              initial={isRolling ? { rotateX: 0, rotateY: 0 } : false}
              animate={isRolling ? { rotateX: 360, rotateY: 720 } : false}
            >
              <span className={
                state.lastDiceRoll <= winChance 
                  ? "text-green-500" 
                  : "text-red-500"
              }>
                {state.lastDiceRoll}
              </span>
            </motion.div>
          )}
        </div>
        
        <Button 
          className="btn-primary w-full"
          onClick={handleRoll}
          disabled={isRolling || betAmount <= 0 || betAmount > state.tokens}
        >
          {isRolling ? "Rolling..." : "Roll Dice"}
        </Button>
      </div>
    </motion.div>
  );
};

export default DiceRoll;
