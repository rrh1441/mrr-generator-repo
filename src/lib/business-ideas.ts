/**
 * This file no longer calls OpenAI directly. Instead, it just declares
 * types and a helper function to call your new `/api` endpoint.
 */

/**
 * The shape of the form data.
 */
export type BusinessIdeaParams = {
  skills: string
  interests: string
  budget: string
  riskTolerance: 'Low' | 'Medium' | 'High'
  businessModel: 'SaaS' | 'Marketplace' | 'E-commerce' | 'Services' | 'Content' | 'Mobile App' | 'Other'
}

/**
 * The shape of the final business idea object returned by ChatGPT.
 */
export type BusinessIdea = {
  name: string
  problem: string
  solution: string
  targetAudience: string
  businessModel: string
  techStack: string
  monetization: string
  challengesAndRisks: string
  whyNow: string
  howToBuild: string
}

/**
 * Makes a POST request to the serverless API route at /api.
 * The serverless function (api/index.ts) calls OpenAI securely
 * so your key isn't exposed in the browser.
 */
export async function fetchBusinessIdea(params: BusinessIdeaParams): Promise<BusinessIdea> {
  const response = await fetch('/api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }

  const data = (await response.json()) as BusinessIdea
  return data
}