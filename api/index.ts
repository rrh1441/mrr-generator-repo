import type { VercelRequest, VercelResponse } from '@vercel/node'
import openai from 'openai' // <-- default import

const { Configuration, OpenAIApi } = openai // destructure the classes from the default

interface BusinessIdeaRequestBody {
  skills: string
  interests: string
  budget: string
  riskTolerance: 'Low' | 'Medium' | 'High'
  businessModel: 'SaaS' | 'Marketplace' | 'E-commerce' | 'Services' | 'Content' | 'Mobile App' | 'Other'
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing OPENAI_API_KEY' })
    }

    const {
      skills,
      interests,
      budget,
      riskTolerance,
      businessModel,
    } = req.body as BusinessIdeaRequestBody

    // This should now be a valid constructor:
    const configuration = new Configuration({ apiKey })
    const openaiClient = new OpenAIApi(configuration)

    // System & user prompts
    const systemInstruction = `
      You are a helpful business idea generator...
      ...
    `.trim()

    const userPrompt = `
      Skills: ${skills}
      ...
    `.trim()

    const response = await openaiClient.createChatCompletion({
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: userPrompt },
      ],
    })

    const rawText = response.data.choices?.[0]?.message?.content?.trim() || ''
    let idea
    try {
      idea = JSON.parse(rawText)
    } catch (error) {
      console.error('Failed to parse GPT response:', error)
      console.error('Raw content:', rawText)
      return res.status(200).json({
        name: 'Error Parsing Idea',
        ...
      })
    }

    return res.status(200).json(idea)
  } catch (error) {
    console.error('OpenAI call error:', error)
    return res.status(500).json({ error: 'OpenAI request failed' })
  }
}