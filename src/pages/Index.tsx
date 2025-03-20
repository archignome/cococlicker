import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameProvider } from '@/context/GameContext';
import Dashboard from '@/components/Dashboard';
import Clicker from '@/components/Clicker';
import DiceRoll from '@/components/DiceRoll';
import CoinFlip from '@/components/CoinFlip';
import AnimatedBackground from '@/components/AnimatedBackground';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Hand, Dice5, Coins } from 'lucide-react';

const Index = () => {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("clicker");

  useEffect(() => {
    setMounted(true);
    
    // Simulate loading for a smoother entrance
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle tab change with proper state management
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (!mounted) return null;

  return (
    <GameProvider>
      <div className="min-h-screen w-full overflow-hidden relative">
        <AnimatedBackground />
        
        <AnimatePresence>
          {loading ? (
            <motion.div
              key="loading"
              className="fixed inset-0 flex items-center justify-center bg-background z-50"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="w-20 h-20 mb-4 rounded-full bg-gradient-to-r from-coco-primary to-coco-secondary"
                  animate={{ 
                    rotate: 360,
                    boxShadow: [
                      "0 0 15px rgba(155, 135, 245, 0.3)",
                      "0 0 25px rgba(155, 135, 245, 0.6)",
                      "0 0 15px rgba(155, 135, 245, 0.3)",
                    ]
                  }}
                  transition={{ 
                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                    boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                />
                <h1 className="text-2xl font-display font-semibold">COCO</h1>
                <p className="text-muted-foreground">Loading adventure...</p>
              </motion.div>
            </motion.div>
          ) : (
            <motion.main
              key="content"
              className="container max-w-5xl px-4 py-8 mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <Dashboard />
                </div>
                
                <div className="lg:col-span-2">
                  <Tabs 
                    value={activeTab} 
                    onValueChange={handleTabChange}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-3 mb-8">
                      <TabsTrigger value="clicker" className="flex items-center gap-2">
                        <Hand className="h-4 w-4" />
                        <span className="hidden sm:inline">Clicker</span>
                      </TabsTrigger>
                      <TabsTrigger value="dice" className="flex items-center gap-2">
                        <Dice5 className="h-4 w-4" />
                        <span className="hidden sm:inline">Dice Roll</span>
                      </TabsTrigger>
                      <TabsTrigger value="coinflip" className="flex items-center gap-2">
                        <Coins className="h-4 w-4" />
                        <span className="hidden sm:inline">Coin Flip</span>
                      </TabsTrigger>
                    </TabsList>
                    
                    {/* Pre-render all tab contents but keep them hidden when not active */}
                    <div className="relative">
                      <div className={`${activeTab === "clicker" ? "block" : "hidden"}`}>
                        <Clicker />
                      </div>
                      <div className={`${activeTab === "dice" ? "block" : "hidden"}`}>
                        <DiceRoll />
                      </div>
                      <div className={`${activeTab === "coinflip" ? "block" : "hidden"}`}>
                        <CoinFlip />
                      </div>
                    </div>
                  </Tabs>
                </div>
              </div>
              
              <motion.footer
                className="text-center mt-20 mb-10 text-xs text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <p>COCO - A Tap-to-Earn Telegram Mini-App</p>
              </motion.footer>
            </motion.main>
          )}
        </AnimatePresence>
      </div>
    </GameProvider>
  );
};

export default Index;
