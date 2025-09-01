import { useState } from 'react';
import { motion } from 'framer-motion';
import WelcomeHeader from './WelcomeHeader';
import WelcomeInput from './WelcomeInput';
import ExamplePrompts from './ExamplePrompts';

interface ChatWelcomeProps {
  onStartChat: (message: string) => void;
}

export default function ChatWelcome({ onStartChat }: ChatWelcomeProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSelectPrompt = (prompt: string) => {
    setInputValue(prompt);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full text-center space-y-8"
      >
        <WelcomeHeader />
        <WelcomeInput 
          onStartChat={onStartChat} 
          value={inputValue}
          onChange={setInputValue}
        />
        <ExamplePrompts onSelectPrompt={handleSelectPrompt} />
      </motion.div>
    </div>
  );
}
