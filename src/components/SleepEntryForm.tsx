import React, { useState } from 'react';
import { useSleep } from '../context/SleepContext';
import { calculateSleepDuration } from '../utils/sleepAnalysis';
import Button from './ui/Button';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import { Card, CardHeader, CardBody, CardFooter } from './ui/Card';

interface SleepEntryFormProps {
  onComplete?: () => void;
}

const SleepEntryForm: React.FC<SleepEntryFormProps> = ({ onComplete }) => {
  const { addSleepEntry } = useSleep();
  const today = new Date().toISOString().split('T')[0];
  
  const [form, setForm] = useState({
    date: today,
    bedTime: '22:30',
    wakeTime: '06:30',
    sleepQuality: 3,
    notes: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when changed
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!form.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!form.bedTime) {
      newErrors.bedTime = 'Bed time is required';
    }
    
    if (!form.wakeTime) {
      newErrors.wakeTime = 'Wake time is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const sleepDuration = calculateSleepDuration(form.bedTime, form.wakeTime);
    
    addSleepEntry({
      ...form,
      sleepQuality: Number(form.sleepQuality),
      sleepDuration,
    });
    
    // Reset form
    setForm({
      date: today,
      bedTime: '22:30',
      wakeTime: '06:30',
      sleepQuality: 3,
      notes: '',
    });
    
    if (onComplete) {
      onComplete();
    }
  };
  
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Log Your Sleep</h2>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardBody className="space-y-4">
          <Input
            label="Date"
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            error={errors.date}
            max={today}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Bed Time"
              type="time"
              name="bedTime"
              value={form.bedTime}
              onChange={handleChange}
              error={errors.bedTime}
            />
            
            <Input
              label="Wake Time"
              type="time"
              name="wakeTime"
              value={form.wakeTime}
              onChange={handleChange}
              error={errors.wakeTime}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Sleep Quality (1-5)
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, sleepQuality: value }))}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors
                    ${
                      form.sleepQuality >= value
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                >
                  {value}
                </button>
              ))}
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {form.sleepQuality === 1 && 'Poor - Very restless sleep'}
              {form.sleepQuality === 2 && 'Fair - Somewhat restless sleep'}
              {form.sleepQuality === 3 && 'Average - Typical sleep quality'}
              {form.sleepQuality === 4 && 'Good - Restful sleep'}
              {form.sleepQuality === 5 && 'Excellent - Deep, refreshing sleep'}
            </p>
          </div>
          
          <Textarea
            label="Notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Any factors that affected your sleep? (optional)"
            rows={3}
          />
        </CardBody>
        
        <CardFooter className="flex justify-end">
          <Button type="submit">Save Sleep Entry</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SleepEntryForm;