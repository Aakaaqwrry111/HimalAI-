import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export interface JourneyPlan {
  title: string;
  days: {
    dayNumber: number;
    title: string;
    description: string;
    activities: string[];
  }[];
  budgetBreakdown: {
    category: string;
    amount: number;
    currency: string;
  }[];
  difficulty: string;
}

// Fallback dummy plan to guarantee the app never breaks
const DUMMY_FALLBACK_JOURNEY: JourneyPlan = {
  title: "Whispers of the Annapurnas: A Himalayan Odyssey",
  days: [
    {
      dayNumber: 1,
      title: "Arrival in Kathmandu & Cultural Immersion",
      description: "Touch down in the historic Kathmandu Valley, where ancient temples meet vibrant local markets filled with the scent of incense and spices.",
      activities: ["Check-in at traditional heritage hotel", "Evening walk through vibrant Thamel", "Welcome dinner featuring authentic Newari cuisine"]
    },
    {
      dayNumber: 2,
      title: "Scenic Drive to Pokhara's Lakeside",
      description: "Journey westward through winding mountain highways alongside raging rivers, descending into the tranquil lakeside valley of Pokhara.",
      activities: ["Morning departure via scenic highway", "Boating on the serene Phewa Lake", "Sunset view of the Annapurna mountain range"]
    },
    {
      dayNumber: 3,
      title: "Sunrise at Sarangkot & Mountain Trails",
      description: "Witness golden morning light igniting the towering fishtail peak of Machhapuchhre before stepping onto pristine lower foothill trails.",
      activities: ["Early morning sunrise hike to Sarangkot viewpoint", "Guided foothill trek through traditional Gurung villages", "Relaxing evening by the lakeside promenade"]
    }
  ],
  budgetBreakdown: [
    { category: "Accommodation", amount: 250, currency: "USD" },
    { category: "Guides & Permits", amount: 150, currency: "USD" },
    { category: "Food & Transport", amount: 200, currency: "USD" }
  ],
  difficulty: "Moderate"
};

export async function generateJourney(prompt: string): Promise<JourneyPlan> {
  // If no API key is present, instantly return the fallback plan gracefully
  if (!apiKey) {
    console.warn("Gemini API key is missing. Using fallback dummy journey plan.");
    return DUMMY_FALLBACK_JOURNEY;
  }

  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash"
  });

  const fullPrompt = `
    You are an elite travel architect for Nepal. 
    Return ONLY a valid JSON object matching this exact schema, with no markdown code blocks, backticks, or extra conversational text.
    {
      "title": "A captivating title",
      "days": [{ "dayNumber": 1, "title": "Day title", "description": "Storytelling description", "activities": ["Activity 1"] }],
      "budgetBreakdown": [{ "category": "Accommodation", "amount": 100, "currency": "USD" }],
      "difficulty": "Moderate"
    }
    
    Based on the user's input: ${prompt}
  `;

  try {
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    let text = response.text().trim();
    
    text = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "");

    return JSON.parse(text) as JourneyPlan;
  } catch (error) {
    console.warn("AI Generation encountered an error, falling back to dummy plan:", error);
    // Gracefully fallback to the dummy plan instead of crashing the UI
    return DUMMY_FALLBACK_JOURNEY;
  }
  
}
// Add this to the bottom of your src/lib/gemini.ts file

/**
 * Helper utility to convert a File object into the Base64 generative part format
 */
async function fileToGenerativePart(file: File) {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  
  return {
    inlineData: { 
      data: await base64EncodedDataPromise, 
      mimeType: file.type 
    },
  };
}

/**
 * Analyzes an image for cultural context and route planning
 */
export async function analyzeTrekImage(file: File, customPrompt?: string): Promise<string> {
  if (!apiKey) throw new Error("Gemini API key is missing.");
  
  // gemini-1.5-flash natively supports multimodal (text + image) inputs!
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const imagePart = await fileToGenerativePart(file);
  
  const systemPrompt = customPrompt || `
    You are an elite Himalayan trekking guide and cultural historian. 
    Analyze this image carefully. 
    1. Identify the mountain, landmark, or cultural artifact if possible.
    2. Provide rich cultural or historical context.
    3. If it's a trail or mountain, estimate the elevation and provide quick route/safety advice.
    Keep the response highly engaging, formatted nicely with short paragraphs, and incredibly helpful for a trekker.
  `;

  try {
    const result = await model.generateContent([systemPrompt, imagePart]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Vision AI Error:", error);
    throw new Error("The fog is too thick. Could not analyze the image.");
  }
}