import { SleepContextType } from "../context/SleepContext";
import { formatMinutes, generateSleepRecommendations } from "./sleepAnalysis";

type SleepData = Pick<SleepContextType, 'sleepEntries' | 'sleepGoal' | 'sleepStats'>;

// Process user messages and generate appropriate responses
export const generateBotResponse = (message: string, sleepData: SleepData): string => {
  const lowerMsg = message.toLowerCase();
  
  // Handle greetings
  if (
    lowerMsg.includes('hello') ||
    lowerMsg.includes('hi') ||
    lowerMsg.includes('hey') ||
    lowerMsg === 'hello' ||
    lowerMsg === 'hi'
  ) {
    return "Hello! I'm your sleep assistant. How can I help you improve your sleep today?";
  }
  
  // Handle sleep tracking commands
  if (
    lowerMsg.includes('track') ||
    lowerMsg.includes('log') ||
    lowerMsg.includes('record')
  ) {
    return "Great! To log your sleep, click on the 'Log Sleep' button below or tell me when you went to bed and woke up.";
  }
  
  // Handle sleep statistics queries
  if (
    lowerMsg.includes('stats') ||
    lowerMsg.includes('statistics') ||
    lowerMsg.includes('analysis') ||
    lowerMsg.includes('data') ||
    lowerMsg.includes('how am i doing')
  ) {
    if (sleepData.sleepEntries.length === 0) {
      return "You haven't logged any sleep yet. Start tracking your sleep to see statistics and personalized recommendations.";
    }
    
    const { sleepStats } = sleepData;
    
    return `
      Based on your sleep data:
      • Average sleep duration: ${formatMinutes(sleepStats.averageSleepDuration)}
      • Average sleep quality: ${sleepStats.averageSleepQuality.toFixed(1)}/5
      • Sleep consistency score: ${sleepStats.consistencyScore}/100
      
      Your best sleep was on ${sleepStats.bestSleepDay}.
      ${sleepStats.worstSleepDay ? `Your worst sleep was on ${sleepStats.worstSleepDay}.` : ''}
    `;
  }
  
  // Handle requests for recommendations
  if (
    lowerMsg.includes('recommend') ||
    lowerMsg.includes('suggestion') ||
    lowerMsg.includes('advice') ||
    lowerMsg.includes('tip') ||
    lowerMsg.includes('help me sleep') ||
    lowerMsg.includes('improve') ||
    lowerMsg.includes('better sleep')
  ) {
    if (sleepData.sleepEntries.length < 3) {
      return "I need at least 3 days of sleep data to provide personalized recommendations. Please continue logging your sleep.";
    }
    
    const recommendations = generateSleepRecommendations(
      sleepData.sleepEntries,
      sleepData.sleepStats
    );
    
    return `
      Here are my recommendations for improving your sleep:
      
      ${recommendations.map(rec => `• ${rec}`).join('\n')}
      
      Would you like more specific advice on any of these areas?
    `;
  }
  
  // Handle questions about sleep goals
  if (
    lowerMsg.includes('goal') ||
    lowerMsg.includes('target')
  ) {
    const { targetSleepDuration, targetBedTime, targetWakeTime } = sleepData.sleepGoal;
    
    return `
      Your current sleep goals are:
      • Target sleep duration: ${formatMinutes(targetSleepDuration)}
      • Target bedtime: ${targetBedTime}
      • Target wake time: ${targetWakeTime}
      
      You can adjust these goals in the settings.
    `;
  }
  
  // Handle requests about sleep hygiene
  if (
    lowerMsg.includes('hygiene') ||
    lowerMsg.includes('routine') ||
    lowerMsg.includes('habit') ||
    lowerMsg.includes('bedtime routine')
  ) {
    return `
      Good sleep hygiene practices:
      • Maintain a consistent sleep schedule
      • Create a restful environment (cool, dark, quiet)
      • Limit exposure to screens 1 hour before bed
      • Avoid caffeine and alcohol before bedtime
      • Exercise regularly, but not too close to bedtime
      • Establish a relaxing pre-sleep routine (reading, meditation, etc.)
      
      Would you like more information on any of these practices?
    `;
  }
  
  // Default response for unrecognized queries
  return `
    I'm here to help with your sleep. You can:
    • Log your sleep
    • View your sleep statistics
    • Get personalized recommendations
    • Learn about good sleep hygiene
    • Set sleep goals
    
    What would you like to do?
  `;
};