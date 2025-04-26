import React from 'react';
import SleepTipsCard from '../components/SleepTipsCard';

const TipsPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Sleep Improvement Tips
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Evidence-based techniques to help you get better sleep.
        </p>
      </div>

      <SleepTipsCard />

      <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Understanding Sleep Cycles
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Sleep consists of multiple cycles, each lasting about 90-110 minutes. Each cycle includes
          stages of light sleep, deep sleep, and REM (rapid eye movement) sleep.
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Deep sleep is crucial for physical recovery, while REM sleep plays a vital role in
          cognitive functions like learning and memory consolidation.
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          The ideal amount of sleep varies by individual, but most adults need between 7-9 hours per
          night to function optimally.
        </p>
      </div>

      <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Managing Sleep Disorders
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          If you consistently experience sleep problems despite following good sleep hygiene
          practices, you may have a sleep disorder such as insomnia, sleep apnea, or restless leg
          syndrome.
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          Consider speaking with a healthcare provider if you experience:
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700 dark:text-gray-300">
          <li>Difficulty falling or staying asleep multiple nights per week</li>
          <li>Excessive daytime sleepiness despite adequate sleep time</li>
          <li>Loud snoring, gasping, or stopping breathing during sleep</li>
          <li>Uncomfortable sensations in your legs that disrupt sleep</li>
          <li>Sleep problems that affect your daily functioning</li>
        </ul>
      </div>
    </div>
  );
};

export default TipsPage;