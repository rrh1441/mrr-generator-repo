import { Configuration, OpenAIApi } from "openai";

interface BusinessIdeaRequestBody {
  skills: string;
  interests: string;
  budget: string;
  riskTolerance: "Low" | "Medium" | "High";
  businessModel:
    | "SaaS"
    | "Marketplace"
    | "E-commerce"
    | "Services"
    | "Content"
    | "Mobile App"
    | "Other";
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
    }

    const { skills, interests, budget, riskTolerance, businessModel } =
      req.body as BusinessIdeaRequestBody;

    // Using openai@3.3.0 with named imports
    const configuration = new Configuration({ apiKey });
    const openaiClient = new OpenAIApi(configuration);

    /**
     * Revised instructions for "aiPrompt" to incorporate best practices
     */
    const systemInstruction = `
You are a highly experienced software architect and business consultant. 
The user will provide their skills, interests, budget, risk tolerance, and preferred business model. 
Return a single JSON with these fields:

{
  "name": string,
  "problem": string,
  "solution": string,
  "targetAudience": string,
  "businessModel": string,
  "techStack": string,
  "monetization": string,
  "challengesAndRisks": string,
  "whyNow": string,
  "howToBuild": string,
  "aiPrompt": string
}

- "aiPrompt" must be a high-quality, advanced prompt that a developer can copy/paste into ChatGPT or other AI to start building the recommended project. 
  1. It should include a short summary of the business idea context. 
  2. It should incorporate best practices (e.g., iterative dev approach, recommended frameworks/libraries, environment variables, version control). 
  3. It should emphasize security, testing, and performance considerations. 
  4. It must be concise but cover recommended next steps, possible feature expansions, and relevant code or architecture patterns. 
  5. Avoid extraneous commentary. Output only the JSON—no additional text.

Do not add extra fields or commentary beyond the specified JSON keys.
    `.trim();

    const userPrompt = `
Skills: ${skills}
Interests: ${interests}
Budget: ${budget}
Risk Tolerance: ${riskTolerance}
Preferred Business Model: ${businessModel}

Generate exactly the JSON described. 
Focus on providing a truly useful "aiPrompt" for developers to start building. 
    `.trim();

    const response = await openaiClient.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: userPrompt },
      ],
    });

    const rawText = response.data.choices?.[0]?.message?.content?.trim() || "";

    let idea;
    try {
      idea = JSON.parse(rawText);
    } catch (error) {
      console.error("Failed to parse GPT response:", error);
      console.error("Raw content:", rawText);
      return res.status(200).json({
        name: "Error Parsing Idea",
        problem: "Could not parse AI output.",
        solution: "Check logs for raw JSON string.",
        targetAudience: "N/A",
        businessModel: "N/A",
        techStack: "N/A",
        monetization: "N/A",
        challengesAndRisks: "N/A",
        whyNow: "N/A",
        howToBuild: "N/A",
        aiPrompt: "N/A",
      });
    }

    return res.status(200).json(idea);
  } catch (error) {
    console.error("OpenAI call error:", error);
    return res.status(500).json({ error: "OpenAI request failed" });
  }
}