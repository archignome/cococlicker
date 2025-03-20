
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import { UserIcon } from 'lucide-react';
import { useTelegram } from '@/context/TelegramContext';

const UserProfile = () => {
  const { user, isReady } = useTelegram();

  // If not running in Telegram or user data not available
  if (!isReady || !user.id) {
    return (
      <motion.div 
        className="flex items-center gap-2 p-2 bg-muted/50 rounded-full text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            <UserIcon className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <span className="text-muted-foreground">Guest</span>
      </motion.div>
    );
  }

  // Initial for avatar fallback
  const getInitials = () => {
    if (user.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    if (user.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <motion.div 
      className="flex items-center gap-2 p-2 bg-muted/50 rounded-full"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Avatar className="h-8 w-8 border border-coco-primary/20">
        {user.photoUrl ? (
          <AvatarImage src={user.photoUrl} alt={user.username || "User"} />
        ) : (
          <AvatarFallback className="bg-gradient-to-r from-coco-primary to-coco-secondary text-white">
            {getInitials()}
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-medium truncate max-w-[120px]">
          {user.firstName || user.username || "User"}
        </span>
        {user.username && (
          <span className="text-xs text-muted-foreground">@{user.username}</span>
        )}
      </div>
    </motion.div>
  );
};

export default UserProfile;
