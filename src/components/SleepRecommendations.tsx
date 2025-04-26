import React from 'react';
import { useSleep } from '../context/SleepContext';
import { generateSleepRecommendations } from '../utils/sleepAnalysis';
import { Card, CardHeader, CardBody } from './ui/Card';
import { Sparkles, AlertCircle } from 'lucide-react';

const SleepRecommendations: React.FC = () => {
  const { sleepEntries, sleepStats } = useSleep();
  
  if (sleepEntries.length < 3) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Personalized Recommendations
          </h2>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              More data needed
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Track your sleep for at least 3 days to receive personalized recommendations.
            </p>
          </div>
        </CardBody>
      </Card>
    );
  }
  
  const recommendations = generateSleepRecommendations(sleepEntries, sleepStats);
  
  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
        <h2 className="text-xl font-semibold flex items-center">
          <Sparkles className="h-5 w-5 mr-2" />
          Personalized Recommendations
        </h2>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {recommendations.map((recommendation, index) => (
            <div
              key={index}
              className="p-4 border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-900/20 rounded-r-lg"
            >
              <p className="text-gray-800 dark:text-gray-200">{recommendation}</p>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default SleepRecommendations;