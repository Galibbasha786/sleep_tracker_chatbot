import React, { createContext, useContext, useState, useEffect } from 'react';
import { Message } from '../types';
import { generateBotResponse } from '../utils/chatbot';
import { useSleep } from './SleepContext';

interface ChatContextType {
  messages: Message[];
  sendMessage: (text: string) => void;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages
      ? JSON.parse(savedMessages)
      : [
          {
            id: '1',
            sender: 'bot',
            text: 'Hello! I\'m your sleep assistant. I can help you track and improve your sleep patterns. How can I assist you today?',
            timestamp: Date.now(),
          },
        ];
  });

  const sleep = useSleep();

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async (text: string) => {
    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: 'user',
      text,
      timestamp: Date.now(),
    };
    
    setMessages((prev) => [...prev, userMessage]);

    // Generate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(text, sleep);
      const botMessage: Message = {
        id: crypto.randomUUID(),
        sender: 'bot',
        text: botResponse,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 600);
  };

  const clearMessages = () => {
    setMessages([
      {
        id: '1',
        sender: 'bot',
        text: 'Hello! I\'m your sleep assistant. I can help you track and improve your sleep patterns. How can I assist you today?',
        timestamp: Date.now(),
      },
    ]);
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, clearMessages }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};