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

    // Retrieve the OpenAI key from environment variables
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
    }

    // Destructure form data
    const { skills, interests, budget, riskTolerance, businessModel } =
      req.body as BusinessIdeaRequestBody;

    // Configure openai@3.3.0 with named imports
    const configuration = new Configuration({ apiKey });
    const openaiClient = new OpenAIApi(configuration);

    /**
     * Revised system instruction: produce "howToBuild" and "aiPrompt" as separate strings.
     * "aiPrompt" must reflect best practices for iterative dev, security, testing, etc.
     */
    const systemInstruction = `
You are a highly experienced software architect and business consultant. 
Return exactly one JSON object with these fields:

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

Constraints:
1) "howToBuild": a concise string describing the recommended approach, libraries, environment setup, etc.
2) "aiPrompt": a best-practice-based advanced prompt for ChatGPT or other AI. 
   - Emphasize an iterative dev approach, version control, environment variables, security, performance, testing, etc.
   - Provide just enough detail to help a developer jumpstart coding. 
3) Do not add extra fields or commentary beyond these. 
4) Output only valid JSON in the final message, no additional text.
    `.trim();

    const userPrompt = `
Skills: ${skills}
Interests: ${interests}
Budget: ${budget}
Risk Tolerance: ${riskTolerance}
Preferred Business Model: ${businessModel}

Return a single JSON object with "howToBuild" and "aiPrompt" as separate string fields. 
They must incorporate strong best practices for building the recommended project.
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

    // Grab the text from the completion
    const rawText = response.data.choices?.[0]?.message?.content?.trim() || "";

    let idea;
    try {
      idea = JSON.parse(rawText);
    } catch (error) {
      console.error("Failed to parse GPT response:", error);
      console.error("Raw content:", rawText);
      // If JSON parse fails, provide fallback
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

    // Return the final structured idea
    return res.status(200).json(idea);
  } catch (error) {
    console.error("OpenAI call error:", error);
    return res.status(500).json({ error: "OpenAI request failed" });
  }
}