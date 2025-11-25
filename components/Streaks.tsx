import React from 'react';
import { Flame } from 'lucide-react';

interface StreaksProps {
  streak: number;
}

export const Streaks: React.FC<StreaksProps> = ({ streak }) => {
  return (
    <div className="flex items-center gap-2">
      <Flame className="w-6 h-6 text-orange-500" />
      <span className="text-xl font-bold text-white">{streak}</span>
      <span className="text-sm text-gray-400">day streak</span>
    </div>
  );
};
