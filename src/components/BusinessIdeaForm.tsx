import React, { useState } from 'react'
import { BusinessIdeaParams, BusinessIdea, fetchBusinessIdea } from '@/lib/business-ideas'
import Loader from './Loader'
import ResultCard from './ResultCard'

const BusinessIdeaForm: React.FC = () => {
  const [formData, setFormData] = useState<BusinessIdeaParams>({
    skills: '',
    interests: '',
    budget: '',
    riskTolerance: 'Medium',
    businessModel: 'SaaS',
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [businessIdea, setBusinessIdea] = useState<BusinessIdea | null>(null)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    setFormSubmitted(true)
    setBusinessIdea(null)

    try {
      // Calls the serverless route via fetchBusinessIdea(), which references /api/generate-idea
      const idea = await fetchBusinessIdea(formData)
      setBusinessIdea(idea)
    } catch (error) {
      console.error('Failed to fetch business idea:', error)
      // You could show an error UI here if desired.
    } finally {
      setIsGenerating(false)
    }
  }

  const handleReset = () => {
    setFormSubmitted(false)
    setBusinessIdea(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // If the user has submitted and we have a final business idea, show the result card
  if (formSubmitted && !isGenerating && businessIdea) {
    return (
      <div className="animate-fade-in">
        <ResultCard idea={businessIdea} onReset={handleReset} />
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto glass-panel rounded-xl p-8 animate-slide-up">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-input-wrapper">
          <label htmlFor="skills" className="form-label">
            What skills do you have?
          </label>
          <textarea
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            className="form-input min-h-24"
            placeholder="Programming, marketing, design, writing, etc."
            required
          />
        </div>

        <div className="form-input-wrapper">
          <label htmlFor="interests" className="form-label">
            What are your interests and passions?
          </label>
          <textarea
            id="interests"
            name="interests"
            value={formData.interests}
            onChange={handleChange}
            className="form-input min-h-24"
            placeholder="Technology, health, education, sustainability, etc."
            required
          />
        </div>

        <div className="form-input-wrapper">
          <label htmlFor="budget" className="form-label">
            What's your starting budget?
          </label>
          <input
            type="text"
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="form-input"
            placeholder="$100, $1,000, $5,000, etc."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-input-wrapper">
            <label htmlFor="riskTolerance" className="form-label">
              Risk Tolerance
            </label>
            <select
              id="riskTolerance"
              name="riskTolerance"
              value={formData.riskTolerance}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="form-input-wrapper">
            <label htmlFor="businessModel" className="form-label">
              Preferred Business Model
            </label>
            <select
              id="businessModel"
              name="businessModel"
              value={formData.businessModel}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="SaaS">SaaS</option>
              <option value="Marketplace">Marketplace</option>
              <option value="E-commerce">E-commerce</option>
              <option value="Services">Services</option>
              <option value="Content">Content</option>
              <option value="Mobile App">Mobile App</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="pt-4">
          <button type="submit" className="primary-button w-full" disabled={isGenerating}>
            {isGenerating ? 'Generating Idea...' : 'Generate Business Idea'}
          </button>
        </div>
      </form>

      {isGenerating && (
        <div className="mt-8">
          <Loader size="md" />
          <p className="text-center text-muted-foreground animate-pulse-subtle mt-4">
            Analyzing your profile and generating the perfect business idea...
          </p>
        </div>
      )}
    </div>
  )
}

export default BusinessIdeaForm