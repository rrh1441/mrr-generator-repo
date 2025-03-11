/**
 * src/lib/business-ideas.ts
 * 
 * This file defines your front-end helper for calling the new `/api/generate-idea` 
 * serverless function (which safely hides your OPENAI_API_KEY).
 */

/**
 * The shape of the user form data your front end collects
 */
export type BusinessIdeaParams = {
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
};

/**
 * The final shape of the JSON your serverless route returns
 */
export type BusinessIdea = {
  name: string;
  problem: string;
  solution: string;
  targetAudience: string;
  businessModel: string;
  techStack: string;
  monetization: string;
  challengesAndRisks: string;
  whyNow: string;
  howToBuild: string;
  aiPrompt: string;
};

/**
 * Calls the new /api/generate-idea route with form data. 
 * The route does all the OpenAI logic, returning a BusinessIdea object.
 */
export async function fetchBusinessIdea(
  params: BusinessIdeaParams
): Promise<BusinessIdea> {
  // POST to the new serverless function
  const response = await fetch("/api/generate-idea", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  // The serverless route returns the parsed JSON
  const data = (await response.json()) as BusinessIdea;
  return data;
}