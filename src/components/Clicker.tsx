
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/hooks/useGame';
import { Coins } from 'lucide-react';

const Clicker = () => {
  const { handleClick, state } = useGame();
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [isPressed, setIsPressed] = useState(false);

  const createParticles = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // Get position relative to the button
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create 5 particles
    const newParticles = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      x,
      y,
    }));

    setParticles(prev => [...prev, ...newParticles]);

    // Remove particles after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.some(np => np.id === p.id)));
    }, 1000);
  };

  const handleClickWithEffects = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    handleClick();
    createParticles(e);
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
  };

  return (
    <div className="relative flex flex-col items-center justify-center gap-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="text-center mb-4"
      >
        <h2 className="text-2xl font-display font-semibold mb-2">Tap to Earn</h2>
        <p className="text-muted-foreground">{state.tokensPerClick} COCO per tap</p>
      </motion.div>
      
      <motion.button
        className="clicker-btn"
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        onClick={handleClickWithEffects}
      >
        <Coins className="w-12 h-12" />
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute w-4 h-4 bg-yellow-300 rounded-full z-10"
            initial={{ 
              x: particle.x, 
              y: particle.y, 
              scale: 1,
              opacity: 1 
            }}
            animate={{ 
              x: particle.x + (Math.random() * 100 - 50),
              y: particle.y - Math.random() * 100,
              scale: 0,
              opacity: 0
            }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        ))}
      </motion.button>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-4 text-center"
      >
        <p className="text-lg">Total Clicks: <span className="font-semibold">{state.totalClicks}</span></p>
      </motion.div>
    </div>
  );
};

export default Clicker;
