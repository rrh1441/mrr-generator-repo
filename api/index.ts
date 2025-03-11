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
    // Only allow POST
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
    }

    const {
      skills,
      interests,
      budget,
      riskTolerance,
      businessModel,
    } = req.body as BusinessIdeaRequestBody;

    // Configure openai@3.3.0 with named imports
    const configuration = new Configuration({ apiKey });
    const openaiClient = new OpenAIApi(configuration);

    // Note the new structure for "howToBuild"
    const systemInstruction = `
You are a helpful business idea generator. The user will give you their skills, interests, budget, risk tolerance, and a preferred business model. Provide a single compelling business idea in the following JSON format:

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
  "howToBuild": {
    "description": string,
    "aiPrompt": string
  }
}

The "howToBuild" field should be an object. 
- "description" is a general explanation of how to build or implement the idea. 
- "aiPrompt" is a specialized prompt that a developer can paste into ChatGPT (or another AI) to start coding or implementing the solution. 
Do not include any fields or text beyond these.
    `.trim();

    const userPrompt = `
Skills: ${skills}
Interests: ${interests}
Budget: ${budget}
Risk Tolerance: ${riskTolerance}
Preferred Business Model: ${businessModel}

Generate exactly that JSON. 
Ensure "howToBuild" is an object with "description" and "aiPrompt".
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
        howToBuild: {
          description: "N/A",
          aiPrompt: "N/A",
        },
      });
    }

    return res.status(200).json(idea);
  } catch (error) {
    console.error("OpenAI call error:", error);
    return res.status(500).json({ error: "OpenAI request failed" });
  }
}