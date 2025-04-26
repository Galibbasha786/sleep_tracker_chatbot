import React, { useState } from 'react';
import { useSleep } from '../context/SleepContext';
import { formatMinutes } from '../utils/sleepAnalysis';
import { Card, CardHeader, CardBody, CardFooter } from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import { AlarmClock, Clock, Moon } from 'lucide-react';

const SleepGoalCard: React.FC = () => {
  const { sleepGoal, updateSleepGoal } = useSleep();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    targetBedTime: sleepGoal.targetBedTime,
    targetWakeTime: sleepGoal.targetWakeTime,
    targetSleepDuration: sleepGoal.targetSleepDuration,
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'targetBedTime' || name === 'targetWakeTime') {
      // Update form value
      setForm((prev) => ({ ...prev, [name]: value }));
      
      // If both times are set, calculate duration
      if (form.targetBedTime && form.targetWakeTime) {
        const [bedHours, bedMinutes] = form.targetBedTime.split(':').map(Number);
        const [wakeHours, wakeMinutes] = form.targetWakeTime.split(':').map(Number);
        
        let duration = (wakeHours * 60 + wakeMinutes) - (bedHours * 60 + bedMinutes);
        if (duration < 0) duration += 24 * 60; // Handle overnight sleep
        
        setForm((prev) => ({ ...prev, targetSleepDuration: duration }));
      }
    } else if (name === 'targetSleepDuration') {
      // Don't allow direct edits of this field as it's calculated
      // This is just a safeguard
    }
  };
  
  const handleSave = () => {
    updateSleepGoal(form);
    setIsEditing(false);
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <h2 className="text-xl font-semibold">Sleep Goals</h2>
      </CardHeader>
      <CardBody>
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  label="Target Bed Time"
                  type="time"
                  name="targetBedTime"
                  value={form.targetBedTime}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Input
                  label="Target Wake Time"
                  type="time"
                  name="targetWakeTime"
                  value={form.targetWakeTime}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Target Sleep Duration
              </label>
              <p className="text-lg font-medium text-emerald-600 dark:text-emerald-400">
                {formatMinutes(form.targetSleepDuration)}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
              <div className="flex items-center">
                <Moon className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-2" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Bed Time
                </h3>
              </div>
              <p className="mt-1 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {sleepGoal.targetBedTime}
              </p>
            </div>
            
            <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg">
              <div className="flex items-center">
                <AlarmClock className="h-5 w-5 text-teal-600 dark:text-teal-400 mr-2" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Wake Time
                </h3>
              </div>
              <p className="mt-1 text-2xl font-bold text-teal-600 dark:text-teal-400">
                {sleepGoal.targetWakeTime}
              </p>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Sleep Duration
                </h3>
              </div>
              <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatMinutes(sleepGoal.targetSleepDuration)}
              </p>
            </div>
          </div>
        )}
      </CardBody>
      <CardFooter className="flex justify-end">
        {isEditing ? (
          <>
            <Button
              variant="outline"
              onClick={() => {
                setForm({
                  targetBedTime: sleepGoal.targetBedTime,
                  targetWakeTime: sleepGoal.targetWakeTime,
                  targetSleepDuration: sleepGoal.targetSleepDuration,
                });
                setIsEditing(false);
              }}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Goals</Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit Goals</Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SleepGoalCard;