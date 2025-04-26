export type SleepEntry = {
  id: string;
  date: string;
  bedTime: string;
  wakeTime: string;
  sleepQuality: number; // 1-5
  sleepDuration: number; // in minutes
  notes: string;
};

export type Message = {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: number;
};

export type SleepGoal = {
  targetSleepDuration: number; // in minutes
  targetBedTime: string;
  targetWakeTime: string;
};

export type SleepStats = {
  averageSleepDuration: number;
  averageSleepQuality: number;
  consistencyScore: number; // 0-100
  bestSleepDay: string;
  worstSleepDay: string;
};