import React from 'react';
import { useSleep } from '../context/SleepContext';
import { formatMinutes } from '../utils/sleepAnalysis';
import { Card, CardHeader, CardBody } from './ui/Card';
import { Clock, Calendar, Star, Trash } from 'lucide-react';
import Button from './ui/Button';

const SleepEntryList: React.FC = () => {
  const { sleepEntries, deleteSleepEntry } = useSleep();
  
  if (sleepEntries.length === 0) {
    return (
      <Card className="shadow-md">
        <CardBody>
          <p className="text-center text-gray-600 dark:text-gray-400 my-8">
            No sleep entries yet. Start tracking your sleep to see your data here.
          </p>
        </CardBody>
      </Card>
    );
  }
  
  const sortedEntries = [...sleepEntries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Sleep History</h2>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {sortedEntries.map((entry) => (
            <div
              key={entry.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {new Date(entry.date).toLocaleDateString(undefined, {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </h3>
                  
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <Clock className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                      <span>
                        {entry.bedTime} - {entry.wakeTime} ({formatMinutes(entry.sleepDuration)})
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <Star className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                      <span>Quality: {entry.sleepQuality}/5</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                      <Calendar className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                      <span>{entry.date}</span>
                    </div>
                  </div>
                  
                  {entry.notes && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-2 rounded">
                      {entry.notes}
                    </p>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteSleepEntry(entry.id)}
                  aria-label="Delete entry"
                  className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default SleepEntryList;