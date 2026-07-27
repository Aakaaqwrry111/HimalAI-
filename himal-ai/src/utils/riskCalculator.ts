export interface TrekConditions {
  currentAltitude: number; // in meters
  dailyAltitudeGain: number; // meters climbed today
  weatherSeverity: 'Clear' | 'Rain' | 'Snow' | 'Storm';
  trailStatus: 'Clear' | 'Muddy' | 'Icy' | 'Landslide';
}

/**
 * Calculates a dynamic risk score from 0 (Safe) to 100 (Critical)
 */
export function calculateRiskScore(conditions: TrekConditions): number {
  let score = 0;

  // 1. Altitude Base Risk (Risk increases exponentially above 3000m)
  if (conditions.currentAltitude > 3000) {
    score += (conditions.currentAltitude - 3000) * 0.005; 
  }

  // 2. Acute Mountain Sickness (AMS) Risk (Golden rule: Don't sleep > 500m higher than yesterday once above 3000m)
  if (conditions.currentAltitude > 3000 && conditions.dailyAltitudeGain > 500) {
    // Heavy penalty for breaking the altitude gain rule
    score += ((conditions.dailyAltitudeGain - 500) / 100) * 15; 
  }

  // 3. Weather Multiplier
  const weatherScores = {
    'Clear': 0,
    'Rain': 15,
    'Snow': 25,
    'Storm': 50
  };
  score += weatherScores[conditions.weatherSeverity];

  // 4. Trail Condition Multiplier
  const trailScores = {
    'Clear': 0,
    'Muddy': 10,
    'Icy': 20,
    'Landslide': 40
  };
  score += trailScores[conditions.trailStatus];

  // Cap the score at 100
  return Math.min(Math.round(score), 100);
}

// Example usage to test it:
// const currentRisk = calculateRiskScore({
//   currentAltitude: 4410,
//   dailyAltitudeGain: 600, // Pushing it a bit fast
//   weatherSeverity: 'Snow',
//   trailStatus: 'Clear'
// }); 
// console.log(currentRisk); // Would output a high warning score!