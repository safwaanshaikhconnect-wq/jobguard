import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeWithGemini(job_text: string, job_url: string) {
  const prompt = `Analyze the following job posting for potential fraud or scams.
Job URL: ${job_url || 'Not provided'}
Job Description:
${job_text || 'Not provided'}

If both are empty, provide a generic mock response for a suspicious job.
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-lite-preview',
    contents: prompt,
    config: {
      systemInstruction: "You are an expert fraud investigator specializing in employment scams. Analyze the job posting and provide a structured risk assessment.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          verdict: { type: Type.STRING, enum: ['SAFE', 'SUSPICIOUS', 'HIGH RISK'] },
          fraud_score: { type: Type.INTEGER, description: "0 to 100, where 100 is definitely a scam" },
          checks: {
            type: Type.OBJECT,
            properties: {
              ai_pattern: { type: Type.BOOLEAN, description: "True if it passes the check (looks human/normal), False if it fails (looks like AI generated scam)" },
              company_verification: { type: Type.BOOLEAN, description: "True if company seems legit, False if unverified" },
              salary_sanity: { type: Type.BOOLEAN, description: "True if salary is realistic, False if too good to be true" },
              domain_age: { type: Type.BOOLEAN, description: "True if domain is old/established, False if newly registered or generic email" },
              address_validation: { type: Type.BOOLEAN, description: "True if address is real commercial, False if residential or fake" }
            },
            required: ['ai_pattern', 'company_verification', 'salary_sanity', 'domain_age', 'address_validation']
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

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
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

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: contents,
    config: {
      systemInstruction: "You are JobGuard Assistant, an expert in detecting employment scams, fake jobs, and recruitment fraud. Help users identify red flags in job postings and guide them on how to stay safe. Keep responses concise and helpful."
    }
  });

  return response.text;
}
