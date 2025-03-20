
import { motion } from 'framer-motion';
import { useGame } from '@/hooks/useGame';
import Token from './Token';
import UserProfile from './UserProfile';
import { BarChart3, History, Settings } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Dashboard = () => {
  const { state } = useGame();
  
  return (
    <motion.div 
      className="w-full max-w-md mx-auto p-4 glass rounded-2xl shadow-xl"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <motion.h1
            className="font-display text-xl font-bold tracking-tight"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            COCO
          </motion.h1>
          <motion.p 
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Tap-to-Earn Adventure
          </motion.p>
        </div>
        <Token amount={state.tokens} />
      </div>
      
      <UserProfile />
      
      <Separator className="my-4" />
      
      <div className="grid grid-cols-3 gap-4 mb-4">
        <motion.div 
          className="flex flex-col items-center p-3 bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-lg border border-muted"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs text-muted-foreground mb-1">Total Clicks</p>
          <p className="font-semibold">{state.totalClicks}</p>
        </motion.div>
        
        <motion.div 
          className="flex flex-col items-center p-3 bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-lg border border-muted"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-xs text-muted-foreground mb-1">Earned</p>
          <p className="font-semibold">{state.tokensPerClick}/click</p>
        </motion.div>
        
        <motion.div 
          className="flex flex-col items-center p-3 bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-lg border border-muted"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xs text-muted-foreground mb-1">Level</p>
          <p className="font-semibold">1</p>
        </motion.div>
      </div>
      
      <div className="flex justify-between mb-2">
        <h3 className="text-sm font-medium">Recent Activity</h3>
        <button className="text-xs text-coco-primary">See all</button>
      </div>
      
      <motion.div 
        className="space-y-2 max-h-28 overflow-y-auto scrollbar-thin pr-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {state.history.length > 0 ? (
          state.history.slice(0, 5).map((item, index) => (
            <motion.div 
              key={index}
              className="flex items-center justify-between p-2 bg-white/30 dark:bg-black/20 rounded-md text-xs"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="flex items-center gap-2">
                <History className="h-3 w-3 text-muted-foreground" />
                <span className="capitalize">{item.action}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className={item.action === 'earned' ? 'text-green-500' : 'text-red-500'}>
                  {item.action === 'earned' ? '+' : '-'}{item.amount}
                </span>
                <span className="text-muted-foreground">COCO</span>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-xs text-muted-foreground py-2">No activity yet</p>
        )}
      </motion.div>
      
      <div className="flex justify-between mt-4">
        <motion.button
          className="flex items-center justify-center w-10 h-10 rounded-full bg-muted"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <BarChart3 className="h-5 w-5 text-muted-foreground" />
        </motion.button>
        
        <motion.button
          className="flex items-center justify-center w-10 h-10 rounded-full bg-muted"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Settings className="h-5 w-5 text-muted-foreground" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Dashboard;
