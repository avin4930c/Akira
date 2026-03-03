import { useState } from 'react';
import { motion } from 'framer-motion';
import ExamplePrompts from '../ExamplePrompts';
import WelcomeHeader from './WelcomeHeader';
import WelcomeInput from './WelcomeInput';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface ChatWelcomeProps {
  onStartChat: (message: string) => void;
  isCreating?: boolean;
}

export default function ChatWelcome({ onStartChat, isCreating = false }: ChatWelcomeProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSelectPrompt = (prompt: string) => {
    setInputValue(prompt);
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="w-full px-4 py-3 flex items-center bg-transparent z-10">
        <SidebarTrigger className="h-8 w-8 text-zinc-400 hover:text-zinc-100 bg-[#111111]/50 border border-white/5 backdrop-blur-sm" />
      </div>

      <ScrollArea className="flex-1 w-full">
        <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 min-h-full relative overflow-hidden">
          <div className="absolute top-[10%] left-[20%] w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl w-full text-center space-y-10 relative z-10 m-auto mt-10 md:mt-auto"
          >
            <WelcomeHeader />
            <WelcomeInput
              onStartChat={onStartChat}
              value={inputValue}
              onChange={setInputValue}
              isCreating={isCreating}
            />
            <ExamplePrompts onSelectPrompt={handleSelectPrompt} />
          </motion.div>
        </div>
      </ScrollArea>
    </div>
  );
}
