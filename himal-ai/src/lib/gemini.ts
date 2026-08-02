const groqApiKey = (import.meta as any).env.VITE_GROQ_API_KEY || '';

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
  if (!groqApiKey) {
    console.warn("Groq API key is missing. Using fallback dummy journey plan.");
    return DUMMY_FALLBACK_JOURNEY;
  }

  const fullPrompt = `
    You are an elite travel architect for Nepal. 
    Return ONLY a valid JSON object matching this exact schema, with no extra text:
    {
      "title": "A captivating title",
      "days": [{ "dayNumber": 1, "title": "Day title", "description": "Storytelling description", "activities": ["Activity 1"] }],
      "budgetBreakdown": [{ "category": "Accommodation", "amount": 100, "currency": "USD" }],
      "difficulty": "Moderate"
    }
    
    Based on the user's input: ${prompt}
  `;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: fullPrompt }],
        // Groq supports JSON mode to guarantee structured output
        response_format: { type: "json_object" }, 
        temperature: 0.7
      })
    });

    if (!response.ok) {
        throw new Error(`Groq API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.choices[0].message.content.trim();
    
    return JSON.parse(text) as JourneyPlan;
  } catch (error) {
    console.warn("AI Generation encountered an error, falling back to dummy plan:", error);
    // Gracefully fallback to the dummy plan instead of crashing the UI
    return DUMMY_FALLBACK_JOURNEY;
  }
}

/**
 * Helper utility to convert a File object into a standard Data URL (Base64)
 * which is required for the OpenAI/Groq Vision API payload.
 */
async function fileToDataURL(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Analyzes an image for cultural context and route planning
 */
export async function analyzeTrekImage(file: File, customPrompt?: string): Promise<string> {
  if (!groqApiKey) throw new Error("Groq API key is missing.");
  
  const systemPrompt = customPrompt || `
    You are an elite Himalayan trekking guide and cultural historian. 
    Analyze this image carefully. 
    1. Identify the mountain, landmark, or cultural artifact if possible.
    2. Provide rich cultural or historical context.
    3. If it's a trail or mountain, estimate the elevation and provide quick route/safety advice.
    Keep the response highly engaging, formatted nicely with short paragraphs, and incredibly helpful for a trekker.
  `;

  try {
    // Converts the file directly into a `data:image/...;base64,...` string
    const base64ImageUrl = await fileToDataURL(file);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.2-11b-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: systemPrompt },
              { type: "image_url", image_url: { url: base64ImageUrl } }
            ]
          }
        ],
        temperature: 0.5
      })
    });

    if (!response.ok) {
        throw new Error(`Groq Vision API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Vision AI Error:", error);
    throw new Error("The fog is too thick. Could not analyze the image.");
  }
}