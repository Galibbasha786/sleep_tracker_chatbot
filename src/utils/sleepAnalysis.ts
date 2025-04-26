import { SleepEntry, SleepStats } from '../types';

// Calculate time difference in minutes between two time strings (HH:MM)
export const calculateSleepDuration = (bedTime: string, wakeTime: string): number => {
  const [bedHours, bedMinutes] = bedTime.split(':').map(Number);
  const [wakeHours, wakeMinutes] = wakeTime.split(':').map(Number);
  
  let duration = (wakeHours * 60 + wakeMinutes) - (bedHours * 60 + bedMinutes);
  
  // If negative, it means sleep went across midnight
  if (duration < 0) {
    duration += 24 * 60;
  }
  
  return duration;
};

// Generate sleep statistics from sleep entries
export const generateSleepStats = (entries: SleepEntry[]): SleepStats => {
  if (entries.length === 0) {
    return {
      averageSleepDuration: 0,
      averageSleepQuality: 0,
      consistencyScore: 0,
      bestSleepDay: '',
      worstSleepDay: '',
    };
  }
  
  // Calculate average sleep duration
  const totalDuration = entries.reduce((sum, entry) => sum + entry.sleepDuration, 0);
  const averageSleepDuration = totalDuration / entries.length;
  
  // Calculate average sleep quality
  const totalQuality = entries.reduce((sum, entry) => sum + entry.sleepQuality, 0);
  const averageSleepQuality = totalQuality / entries.length;
  
  // Find best and worst sleep days
  let bestEntry = entries[0];
  let worstEntry = entries[0];
  
  entries.forEach(entry => {
    // Define a sleep score as a combination of duration and quality
    const currentScore = entry.sleepDuration * entry.sleepQuality;
    const bestScore = bestEntry.sleepDuration * bestEntry.sleepQuality;
    const worstScore = worstEntry.sleepDuration * worstEntry.sleepQuality;
    
    if (currentScore > bestScore) bestEntry = entry;
    if (currentScore < worstScore) worstEntry = entry;
  });
  
  // Calculate consistency score (0-100)
  let durationVariance = 0;
  const bedTimeMinutes: number[] = [];
  
  entries.forEach(entry => {
    // Calculate variance in sleep duration
    durationVariance += Math.pow(entry.sleepDuration - averageSleepDuration, 2);
    
    // Convert bedTime to minutes since midnight for consistency calculation
    const [hours, minutes] = entry.bedTime.split(':').map(Number);
    bedTimeMinutes.push(hours * 60 + minutes);
  });
  
  durationVariance /= entries.length;
  
  // Calculate bedtime consistency
  let bedTimeVariance = 0;
  const avgBedTimeMinutes = bedTimeMinutes.reduce((sum, min) => sum + min, 0) / bedTimeMinutes.length;
  
  bedTimeMinutes.forEach(minutes => {
    bedTimeVariance += Math.pow(minutes - avgBedTimeMinutes, 2);
  });
  
  bedTimeVariance /= bedTimeMinutes.length;
  
  // Calculate consistency score (inverse of variance, normalized to 0-100)
  const durationConsistency = Math.max(0, 100 - Math.sqrt(durationVariance) / 5);
  const bedTimeConsistency = Math.max(0, 100 - Math.sqrt(bedTimeVariance) / 5);
  
  const consistencyScore = Math.round((durationConsistency + bedTimeConsistency) / 2);
  
  return {
    averageSleepDuration,
    averageSleepQuality,
    consistencyScore,
    bestSleepDay: bestEntry.date,
    worstSleepDay: worstEntry.date,
  };
};

// Generate sleep recommendations based on sleep data
export const generateSleepRecommendations = (
  entries: SleepEntry[],
  stats: SleepStats
): string[] => {
  const recommendations: string[] = [];
  
  // Check if we have enough data
  if (entries.length < 3) {
    recommendations.push("Log your sleep for at least 3 days to receive personalized recommendations.");
    return recommendations;
  }
  
  // Check sleep duration
  if (stats.averageSleepDuration < 420) { // Less than 7 hours
    recommendations.push("You're averaging less than 7 hours of sleep. Try to extend your sleep time by going to bed 30 minutes earlier.");
  }
  
  // Check sleep quality
  if (stats.averageSleepQuality < 3) {
    recommendations.push("Your sleep quality is below average. Consider improving your sleep environment by reducing noise and light exposure.");
  }
  
  // Check consistency
  if (stats.consistencyScore < 70) {
    recommendations.push("Your sleep schedule is inconsistent. Try to go to bed and wake up at the same time every day, including weekends.");
  }
  
  // Add general recommendations if we don't have specific ones
  if (recommendations.length === 0) {
    recommendations.push("Your sleep patterns look good! To maintain healthy sleep, avoid caffeine in the afternoon and establish a calming bedtime routine.");
  }
  
  return recommendations;
};

// Format minutes to hours and minutes display (e.g. 480 -> "8h 0m")
export const formatMinutes = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}m`;
};