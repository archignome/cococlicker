
import { Coins } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TokenProps {
  amount: number;
  className?: string;
}

const Token = ({ amount, className }: TokenProps) => {
  return (
    <motion.div
      className={cn(
        "token-badge flex items-center justify-center",
        className
      )}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <Coins className="h-4 w-4 mr-1" />
      <span>{amount.toLocaleString()}</span>
    </motion.div>
  );
};

export default Token;
