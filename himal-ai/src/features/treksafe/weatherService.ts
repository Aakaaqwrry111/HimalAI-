import { TrekConditions, calculateRiskScore } from '../../utils/riskCalculator';

const WEATHER_API_KEY = (import.meta as any).env.VITE_WEATHER_API_KEY || '';

/**
 * Maps OpenWeather condition strings/codes to your TrekConditions severity types
 */
function mapWeatherCondition(mainText: string): TrekConditions['weatherSeverity'] {
  const text = mainText.toLowerCase();
  if (text.includes('thunderstorm') || text.includes('squall')) return 'Storm';
  if (text.includes('snow')) return 'Snow';
  if (text.includes('rain') || text.includes('drizzle')) return 'Rain';
  return 'Clear';
}

/**
 * Fetches live weather data for given coordinates and computes the live risk score
 */
export async function fetchLiveTrekRisk(
  lat: number, 
  lon: number, 
  currentAltitude: number, 
  dailyAltitudeGain: number
): Promise<{ riskScore: number; weatherDescription: string; temperature: number }> {
  
  if (!WEATHER_API_KEY) {
    console.warn("Weather API key missing. Returning baseline estimation.");
    // Fallback calculation if key isn't provided yet
    const fallbackScore = calculateRiskScore({
      currentAltitude,
      dailyAltitudeGain,
      weatherSeverity: 'Clear',
      trailStatus: 'Clear'
    });
    return { riskScore: fallbackScore, weatherDescription: 'API Key Missing', temperature: 0 };
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
    );
    
    if (!response.ok) throw new Error('Failed to fetch live weather data');

    const data = await response.json();
    
    // Extract parameters from API response
    const mainCondition = data.weather[0]?.main || 'Clear';
    const temperature = data.main?.temp || 0;
    const description = data.weather[0]?.description || 'clear sky';

    // Map API condition to your application types
    const weatherSeverity = mapWeatherCondition(mainCondition);

    // Heuristic for trail status based on recent weather (e.g., heavy snow or rain implies risky trails)
    let trailStatus: TrekConditions['trailStatus'] = 'Clear';
    if (weatherSeverity === 'Snow') trailStatus = 'Icy';
    if (weatherSeverity === 'Rain') trailStatus = 'Muddy';

    // Calculate the live score using your algorithm
    const riskScore = calculateRiskScore({
      currentAltitude,
      dailyAltitudeGain,
      weatherSeverity,
      trailStatus
    });

    return {
      riskScore,
      weatherDescription: description,
      temperature
    };

  } catch (error) {
    console.error("Error fetching live weather for trek:", error);
    throw error;
  }
}