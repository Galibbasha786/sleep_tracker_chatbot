import React from 'react';
import SleepEntryForm from '../components/SleepEntryForm';
import SleepEntryList from '../components/SleepEntryList';

const SleepLogPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sleep Log</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Record and review your sleep history to track patterns over time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <SleepEntryForm />
        </div>
        <div>
          <SleepEntryList />
        </div>
      </div>
    </div>
  );
};

export default SleepLogPage;