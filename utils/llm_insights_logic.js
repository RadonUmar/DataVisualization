// NOTE: This file is pure JavaScript and does not require React imports.

/**
 * Implements an exponential backoff retry mechanism for API calls.
 */
async function retryFetch(fn, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  /**
   * Calls the Gemini API to generate structured insights based on the CSV data.
   * The prompt dynamically uses the user's column names to ensure relevant recommendations.
   * @param {Array<{ [key: string]: string | number }>} csvData - The parsed CSV data array.
   * @returns {Promise<Object>} The generated insights (structured JSON object).
   */
  export async function generateInsights(csvData) {
    if (!csvData || csvData.length === 0) {
      throw new Error("No data provided to generate insights.");
    }
    
    // Use a small sample (first 15 rows) to keep the API call fast and within token limits.
    const sampleData = csvData.slice(0, 15); 
    const sampleDataString = JSON.stringify(sampleData, null, 2);
    const columnNames = Object.keys(csvData[0] || {}).join(', '); // Dynamically gets all columns
  
    const prompt = `
      You are an expert Formula 1/Racecar Telemetry Analyst.
      The user has uploaded a CSV file containing raw telemetry data.
  
      **Available Columns:** ${columnNames}
  
      **Task 1: Visualization Recommendations (MUST BE IN JSON)**
      Provide a list of 3-4 most relevant (X-Axis, Y-Axis) pairs for time-series line graphs. You MUST use the exact column names from the 'Available Columns' list above. Prioritize a 'Time' column (like 'adjusted_time_ms' or 'TimeStamp') for the X-Axis, and key performance metrics (speed, torque, voltage) for the Y-Axis.
  
      **Task 2: Data Anomaly/Range Analysis (MUST BE IN MARKDOWN)**
      Analyze the provided data sample and provide a concise, structured analysis using Markdown. Identify any potential anomalies, interesting data ranges, or critical performance observations (e.g., voltage drop, speed spike). Mention the specific column names and numerical ranges when describing observations.
  
      Here is a small sample of the data rows:
      ---
      ${sampleDataString}
      ---
    `;
  
    const systemPrompt = "Act as a specialized Racecar Telemetry Analyst. Your entire response MUST be a single JSON object that strictly adheres to the provided JSON schema. Do not include any text outside the JSON object.";
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
  
    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: {
            parts: [{ text: systemPrompt }]
        },
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "OBJECT",
                properties: {
                    "recommendations": {
                        type: "ARRAY",
                        description: "A list of recommended axis pairs for visualization.",
                        items: {
                            type: "OBJECT",
                            properties: {
                                "xAxis": { "type": "STRING", description: "The recommended column name for the X-Axis." },
                                "yAxis": { "type": "STRING", description: "The recommended column name for the Y-Axis." },
                                "reason": { "type": "STRING", description: "A brief explanation (one sentence) why this visualization is important." }
                            },
                            "propertyOrdering": ["xAxis", "yAxis", "reason"]
                        }
                    },
                    "analysis": { 
                        "type": "STRING", 
                        description: "The detailed Markdown text analysis for anomalies and observations." 
                    }
                },
                "propertyOrdering": ["recommendations", "analysis"]
            }
        }
    };
  
    try {
        const response = await retryFetch(async () => {
            const fetchResponse = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
  
            if (!fetchResponse.ok) {
                const errorText = await fetchResponse.text();
                throw new Error(`API call failed with status ${fetchResponse.status}: ${errorText}`);
            }
            return fetchResponse.json();
        });
  
        const jsonText = response.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!jsonText) {
            throw new Error("LLM response was empty or malformed.");
        }
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error(`Could not fetch insights: ${error.message}`);
    }
  }