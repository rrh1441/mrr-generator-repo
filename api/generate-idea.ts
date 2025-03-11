import { Configuration, OpenAIApi } from "openai";

/**
 * The shape of data you expect from your front-end form.
 */
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

/**
 * Vercel serverless function signature:
 * This means it's purely server side, so your OPENAI_API_KEY won't be exposed.
 */
export default async function handler(req: any, res: any) {
  try {
    // Only allow POST requests
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    // Retrieve your secret OpenAI key from an environment variable
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
    }

    // Parse request body
    const {
      skills,
      interests,
      budget,
      riskTolerance,
      businessModel,
    } = req.body as BusinessIdeaRequestBody;

    // Configure openai@3.3.0 (or whichever version you have installed)
    const configuration = new Configuration({ apiKey });
    const openaiClient = new OpenAIApi(configuration);

    // Build system instructions
    const systemInstruction = `
You are a helpful business idea generator. Return a single JSON object with:
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
The "aiPrompt" must be advanced enough to help the developer start building with best practices.
No extra keys or commentary.
    `.trim();

    const userPrompt = `
Skills: ${skills}
Interests: ${interests}
Budget: ${budget}
Risk Tolerance: ${riskTolerance}
Preferred Business Model: ${businessModel}

Generate that JSON, focusing on a thorough "aiPrompt" 
with security, testing, iterative dev, environment, etc.
    `.trim();

    // ChatGPT call
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
      // Provide fallback if GPT's JSON fails to parse
      console.error("Failed to parse GPT response:", error);
      console.error("Raw content:", rawText);
      return res.status(200).json({
        name: "Error Parsing Idea",
        problem: "Could not parse AI output.",
        solution: "N/A",
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

    // Return final structured response
    return res.status(200).json(idea);
  } catch (error) {
    console.error("OpenAI call error:", error);
    return res.status(500).json({ error: "OpenAI request failed" });
  }
}