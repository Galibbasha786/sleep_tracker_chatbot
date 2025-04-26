import React, { createContext, useContext, useState, useEffect } from 'react';
import { SleepEntry, SleepGoal, SleepStats } from '../types';
import { generateSleepStats } from '../utils/sleepAnalysis';

interface SleepContextType {
  sleepEntries: SleepEntry[];
  addSleepEntry: (entry: Omit<SleepEntry, 'id'>) => void;
  updateSleepEntry: (id: string, entry: Partial<SleepEntry>) => void;
  deleteSleepEntry: (id: string) => void;
  sleepGoal: SleepGoal;
  updateSleepGoal: (goal: Partial<SleepGoal>) => void;
  sleepStats: SleepStats;
}

const defaultSleepGoal: SleepGoal = {
  targetSleepDuration: 480, // 8 hours in minutes
  targetBedTime: '22:30',
  targetWakeTime: '06:30',
};

const defaultSleepStats: SleepStats = {
  averageSleepDuration: 0,
  averageSleepQuality: 0,
  consistencyScore: 0,
  bestSleepDay: '',
  worstSleepDay: '',
};

const SleepContext = createContext<SleepContextType | undefined>(undefined);

export const SleepProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>(() => {
    const savedEntries = localStorage.getItem('sleepEntries');
    return savedEntries ? JSON.parse(savedEntries) : [];
  });

  const [sleepGoal, setSleepGoal] = useState<SleepGoal>(() => {
    const savedGoal = localStorage.getItem('sleepGoal');
    return savedGoal ? JSON.parse(savedGoal) : defaultSleepGoal;
  });

  const [sleepStats, setSleepStats] = useState<SleepStats>(defaultSleepStats);

  useEffect(() => {
    localStorage.setItem('sleepEntries', JSON.stringify(sleepEntries));
    setSleepStats(generateSleepStats(sleepEntries));
  }, [sleepEntries]);

  useEffect(() => {
    localStorage.setItem('sleepGoal', JSON.stringify(sleepGoal));
  }, [sleepGoal]);

  const addSleepEntry = (entry: Omit<SleepEntry, 'id'>) => {
    const newEntry = {
      ...entry,
      id: crypto.randomUUID(),
    };
    setSleepEntries((prev) => [...prev, newEntry]);
  };

  const updateSleepEntry = (id: string, entry: Partial<SleepEntry>) => {
    setSleepEntries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...entry } : item))
    );
  };

  const deleteSleepEntry = (id: string) => {
    setSleepEntries((prev) => prev.filter((item) => item.id !== id));
  };

  const updateSleepGoal = (goal: Partial<SleepGoal>) => {
    setSleepGoal((prev) => ({ ...prev, ...goal }));
  };

  return (
    <SleepContext.Provider
      value={{
        sleepEntries,
        addSleepEntry,
        updateSleepEntry,
        deleteSleepEntry,
        sleepGoal,
        updateSleepGoal,
        sleepStats,
      }}
    >
      {children}
    </SleepContext.Provider>
  );
};

export const useSleep = () => {
  const context = useContext(SleepContext);
  if (context === undefined) {
    throw new Error('useSleep must be used within a SleepProvider');
  }
  return context;
};