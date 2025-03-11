import type { VercelRequest, VercelResponse } from "@vercel/node";
import openai from "openai";

const { Configuration, OpenAIApi } = openai;

/**
 * Interface describing the shape of data you expect from the client.
 * This matches your form fields in the React code.
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Only allow POST
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    // Retrieve the OpenAI key from environment variables.
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
    }

    // Parse input data from request body, ensuring TypeScript checks shape.
    const {
      skills,
      interests,
      budget,
      riskTolerance,
      businessModel,
    } = req.body as BusinessIdeaRequestBody;

    // Configure OpenAI
    const configuration = new Configuration({ apiKey });
    const openaiClient = new OpenAIApi(configuration);

    // Construct the system instruction and user prompt
    const systemInstruction = `
You are a helpful business idea generator. The user will give you their skills, interests, budget, risk tolerance, and a preferred business model. Provide a single compelling business idea that includes these fields in JSON:
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
  "howToBuild": string
}
Only respond with valid JSON, no extra commentary or keys.
    `.trim();

    const userPrompt = `
Skills: ${skills}
Interests: ${interests}
Budget: ${budget}
Risk Tolerance: ${riskTolerance}
Preferred Business Model: ${businessModel}

Generate a single idea that fits these constraints.
    `.trim();

    // Make the request to ChatGPT
    const response = await openaiClient.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: userPrompt },
      ],
    });

    // Extract text from the completion
    const rawText = response.data.choices?.[0]?.message?.content?.trim() || "";

    // Attempt to parse the JSON
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
      });
    }

    // Return the parsed idea
    return res.status(200).json(idea);
  } catch (error) {
    console.error("OpenAI call error:", error);
    return res.status(500).json({ error: "OpenAI request failed" });
  }
}