import React from 'react';
import ChatInterface from '../components/ChatInterface';
import SleepEntryForm from '../components/SleepEntryForm';
import SleepStatsCard from '../components/SleepStatsCard';
import SleepRecommendations from '../components/SleepRecommendations';

const HomePage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Sleep Tracker Dashboard
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Track, analyze, and improve your sleep with personalized insights.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <SleepStatsCard />
          <SleepRecommendations />
        </div>

        <div className="space-y-8">
          <ChatInterface />
          <SleepEntryForm />
        </div>
      </div>
    </div>
  );
};

export default HomePage;