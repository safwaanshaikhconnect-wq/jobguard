import { GoogleGenAI, Type } from '@google/genai';

const getApiKey = () => {
  return import.meta.env.VITE_GEMINI_API_KEY || '';
};

function getAI(): GoogleGenAI {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY is not configured in environment variables.");
  }
  return new GoogleGenAI({ apiKey });
}

export async function analyzeWithGemini(job_text: string, job_url: string) {
  const prompt = `Analyze the following job posting for potential fraud or scams.
Job URL: ${job_url || 'Not provided'}
Job Description:
${job_text || 'Not provided'}

If both are empty, provide a generic mock response for a suspicious job.
`;

  const response = await getAI().models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      systemInstruction: "You are an expert fraud investigator specializing in employment scams. Analyze the job posting and provide a structured risk assessment.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          verdict: { type: Type.STRING, enum: ['SAFE', 'SUSPICIOUS', 'HIGH RISK'] },
          checks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                status: { type: Type.STRING, enum: ['pass', 'fail', 'unknown'] },
                detail: { type: Type.STRING }
              },
              required: ['name', 'status', 'detail']
            }
          },
          red_flags: { type: Type.ARRAY, items: { type: Type.STRING } },
          green_flags: { type: Type.ARRAY, items: { type: Type.STRING } },
          summary: { type: Type.STRING, description: "2-line summary of the analysis" },
          company_name: { type: Type.STRING, description: "Extracted company name or UNKNOWN" },
          job_title: { type: Type.STRING, description: "Extracted job title or UNKNOWN" },
          salary: { type: Type.STRING, description: "Extracted salary or NOT SPECIFIED" },
          location: { type: Type.STRING, description: "Extracted location or UNKNOWN" },
          contact_email: { type: Type.STRING, description: "Extracted contact email or NONE" }
        },
        required: ['verdict', 'fraud_score', 'checks', 'red_flags', 'green_flags', 'summary', 'company_name', 'job_title', 'salary', 'location', 'contact_email']
      }
    }
  });

  let text = response.text;
  if (!text) throw new Error("No response from Gemini");
  // Clean potential markdown blocks
  text = text.replace(/^```json\n?/g, '').replace(/\n?```$/g, '').trim();
  
  return JSON.parse(text);
}

export async function chatWithGemini(history: { role: string, text: string }[], message: string) {
  const contents: any[] = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));

  contents.push({
    role: 'user',
    parts: [{ text: message }]
  });

  const response = await getAI().models.generateContent({
    model: 'gemini-2.0-flash',
    contents: contents,
    config: {
      systemInstruction: "You are JobGuard Assistant, an expert in detecting employment scams, fake jobs, and recruitment fraud. Help users identify red flags in job postings and guide them on how to stay safe. Keep responses concise and helpful."
    }
  });

  return response.text;
}
