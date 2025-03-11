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
    // Only allow POST requests
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    // Retrieve the OpenAI API key from environment variables
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
    }

    // Parse the incoming request body
    const { skills, interests, budget, riskTolerance, businessModel } =
      req.body as BusinessIdeaRequestBody;

    // Configure OpenAI (openai@3.3.0)
    const configuration = new Configuration({ apiKey });
    const openaiClient = new OpenAIApi(configuration);

    // Revised system instruction:
    // • Return exactly one JSON object with the following fields (note that "techStack" is removed):
    //   - name, problem, solution, targetAudience, businessModel,
    //     monetization, challengesAndRisks, whyNow, howToBuild, aiPrompt
    // • "howToBuild" should be a concise, step-by-step approach that includes guidance on project structure,
    //   initial configuration, key component suggestions, and deployment considerations.
    // • "aiPrompt" should be a detailed prompt that instructs an AI (like ChatGPT) to provide additional scaffolding or
    //   concrete code guidance focusing on iterative development, security, testing, performance optimization, and environment configuration.
    // • Output only valid JSON, with no extra commentary or keys.
    const systemInstruction = `
You are a highly experienced software architect and business consultant.
Return exactly one JSON object with these fields:

{
  "name": string,
  "problem": string,
  "solution": string,
  "targetAudience": string,
  "businessModel": string,
  "monetization": string,
  "challengesAndRisks": string,
  "whyNow": string,
  "howToBuild": string,
  "aiPrompt": string
}

Constraints:
1) "howToBuild": Provide a concise, step-by-step approach detailing the recommended implementation strategy, including guidance on project structure, initial configuration, key components, and deployment considerations. Do not include tech stack recommendations.
2) "aiPrompt": Provide a detailed, best-practices-based prompt for ChatGPT that instructs it to generate additional code scaffolding and concrete implementation advice. Emphasize iterative development, version control, security, performance optimization, testing, and proper environment configuration.
3) Do not add any extra commentary or fields beyond these.
Output only a valid JSON object.
    `.trim();

    const userPrompt = `
Skills: ${skills}
Interests: ${interests}
Budget: ${budget}
Risk Tolerance: ${riskTolerance}
Preferred Business Model: ${businessModel}

Return a single JSON object with "howToBuild" and "aiPrompt" as separate string fields.
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