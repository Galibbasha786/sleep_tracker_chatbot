import React from 'react';
import { Card, CardHeader, CardBody } from './ui/Card';
import { Moon, Sun, Coffee, Clock, Zap, Dumbbell } from 'lucide-react';

const SleepTipsCard: React.FC = () => {
  const sleepTips = [
    {
      title: 'Maintain a Consistent Schedule',
      description:
        'Go to bed and wake up at the same time every day, including weekends. This helps regulate your body\'s internal clock.',
      icon: <Clock className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
    },
    {
      title: 'Create a Relaxing Bedtime Routine',
      description:
        'Develop a pre-sleep ritual such as reading, meditation, or a warm bath to signal to your body that it\'s time to wind down.',
      icon: <Moon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
    },
    {
      title: 'Optimize Your Sleep Environment',
      description:
        'Keep your bedroom cool, dark, and quiet. Consider using earplugs, an eye mask, or white noise to block disturbances.',
      icon: <Zap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
    },
    {
      title: 'Limit Caffeine and Alcohol',
      description:
        'Avoid caffeine late in the day and limit alcohol before bedtime, as both can disrupt your sleep quality and patterns.',
      icon: <Coffee className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
    },
    {
      title: 'Exercise Regularly',
      description:
        'Regular physical activity can help you fall asleep faster and enjoy deeper sleep, but avoid vigorous exercise close to bedtime.',
      icon: <Dumbbell className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
    },
    {
      title: 'Manage Light Exposure',
      description:
        'Get plenty of natural sunlight during the day and reduce blue light exposure from screens in the evening.',
      icon: <Sun className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
    },
  ];
  
  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <h2 className="text-xl font-semibold">Sleep Hygiene Tips</h2>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sleepTips.map((tip, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center mb-2">
                {tip.icon}
                <h3 className="ml-2 text-lg font-medium text-gray-900 dark:text-white">
                  {tip.title}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">{tip.description}</p>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default SleepTipsCard;