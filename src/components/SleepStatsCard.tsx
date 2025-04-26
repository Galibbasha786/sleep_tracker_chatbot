import React from 'react';
import { useSleep } from '../context/SleepContext';
import { formatMinutes } from '../utils/sleepAnalysis';
import { Card, CardHeader, CardBody } from './ui/Card';
import { Clock, BarChart, Calendar, Check } from 'lucide-react';

const SleepStatsCard: React.FC = () => {
  const { sleepEntries, sleepStats, sleepGoal } = useSleep();
  
  if (sleepEntries.length === 0) {
    return (
      <Card className="shadow-md">
        <CardBody>
          <p className="text-center text-gray-600 dark:text-gray-400 my-8">
            No sleep data available yet. Start logging your sleep to see analytics.
          </p>
        </CardBody>
      </Card>
    );
  }
  
  // Get streak (consecutive days with sleep data)
  const calculateStreak = () => {
    if (sleepEntries.length === 0) return 0;
    
    const sortedDates = sleepEntries
      .map((entry) => new Date(entry.date).getTime())
      .sort((a, b) => b - a); // Sort in descending order
    
    let streak = 1;
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    for (let i = 0; i < sortedDates.length - 1; i++) {
      const currentDate = new Date(sortedDates[i]);
      const nextDate = new Date(sortedDates[i + 1]);
      
      currentDate.setHours(0, 0, 0, 0);
      nextDate.setHours(0, 0, 0, 0);
      
      // Check if dates are consecutive
      if (currentDate.getTime() - nextDate.getTime() === oneDayMs) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };
  
  const streak = calculateStreak();
  
  // Calculate goal achievement percentages
  const durationPercentage = Math.min(
    100,
    Math.round((sleepStats.averageSleepDuration / sleepGoal.targetSleepDuration) * 100)
  );
  
  return (
    <Card className="shadow-md overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <h2 className="text-xl font-semibold">Sleep Analytics</h2>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Average Sleep
              </h3>
            </div>
            <p className="mt-2 text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {formatMinutes(sleepStats.averageSleepDuration)}
            </p>
            <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-600 dark:bg-indigo-400 h-full rounded-full"
                style={{ width: `${durationPercentage}%` }}
              ></div>
            </div>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {durationPercentage}% of {formatMinutes(sleepGoal.targetSleepDuration)} goal
            </p>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <BarChart className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Sleep Quality
              </h3>
            </div>
            <p className="mt-2 text-3xl font-bold text-purple-600 dark:text-purple-400">
              {sleepStats.averageSleepQuality.toFixed(1)}/5
            </p>
            <div className="mt-2 flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <div
                  key={star}
                  className={`h-2 flex-1 mx-0.5 rounded-full ${
                    star <= Math.round(sleepStats.averageSleepQuality)
                      ? 'bg-purple-600 dark:bg-purple-400'
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                ></div>
              ))}
            </div>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {sleepStats.averageSleepQuality < 3
                ? 'Could be better'
                : sleepStats.averageSleepQuality < 4
                ? 'Pretty good'
                : 'Excellent'}
            </p>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Consistency
              </h3>
            </div>
            <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
              {sleepStats.consistencyScore}%
            </p>
            <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 dark:bg-blue-400 h-full rounded-full"
                style={{ width: `${sleepStats.consistencyScore}%` }}
              ></div>
            </div>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {sleepStats.consistencyScore < 50
                ? 'Needs improvement'
                : sleepStats.consistencyScore < 75
                ? 'Getting better'
                : 'Very consistent'}
            </p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Streak</h3>
            </div>
            <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
              {streak} {streak === 1 ? 'day' : 'days'}
            </p>
            <div className="mt-2 flex space-x-1">
              {Array.from({ length: Math.min(10, streak) }).map((_, index) => (
                <div
                  key={index}
                  className="h-2 w-2 rounded-full bg-green-600 dark:bg-green-400"
                ></div>
              ))}
              {Array.from({ length: Math.max(0, 10 - streak) }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="h-2 w-2 rounded-full bg-gray-200 dark:bg-gray-700"
                ></div>
              ))}
            </div>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {streak < 3
                ? 'Just getting started!'
                : streak < 7
                ? 'Great progress!'
                : 'Outstanding commitment!'}
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default SleepStatsCard;