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

    // Destructure incoming request data
    const { skills, interests, budget, riskTolerance, businessModel } =
      req.body as BusinessIdeaRequestBody;

    // Configure OpenAI (using openai@3.3.0)
    const configuration = new Configuration({ apiKey });
    const openaiClient = new OpenAIApi(configuration);

    // Define system instruction with detailed guidance for generating the "aiPrompt"
    const systemInstruction = `
You are an expert software architect and business consultant.
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
1) "howToBuild": Provide a concise, step-by-step guide outlining the recommended implementation strategy. Include suggestions for project structure, dependency management, and deployment considerations.
2) "aiPrompt": Generate a detailed, actionable prompt that a developer can copy and paste into an LLM (such as ChatGPT) to receive further code scaffolding and project setup instructions. Your prompt must include concrete guidance, for example:
   - "Set up a Django project with built-in user authentication."
   - "Create models for tracking emissions data and user goals."
   - "Implement algorithms to calculate carbon footprint based on user inputs."
   - "Develop a recommendation system using machine learning to suggest sustainability actions."
   - "Write end-to-end tests to ensure accurate tracking and recommendations."
   - Also, mention best practices for version control, configuring environment variables, security measures, and iterative development.
3) Do not include any extra fields or commentary—output only a valid JSON object.
    `.trim();

    const userPrompt = `
Skills: ${skills}
Interests: ${interests}
Budget: ${budget}
Risk Tolerance: ${riskTolerance}
Preferred Business Model: ${businessModel}

Return a single JSON object with "howToBuild" and "aiPrompt" as separate string fields, following the instructions above.
    `.trim();

    // Call ChatGPT
    const response = await openaiClient.createChatCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: userPrompt },
      ],
    });

    // Extract the text from the completion
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