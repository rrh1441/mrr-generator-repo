import React, { useEffect, useRef } from 'react';
import { BusinessIdea } from '../lib/business-ideas';

interface ResultCardProps {
  idea: BusinessIdea;
  onReset: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ idea, onReset }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Animate sections in sequence
  useEffect(() => {
    const sections = cardRef.current?.querySelectorAll('.result-section');
    sections?.forEach((section, index) => {
      setTimeout(() => {
        section.classList.add('animate-slide-up');
        section.classList.remove('opacity-0');
      }, 100 * index);
    });
  }, []);

  const renderSection = (title: string, content: string) => (
    <div className="result-section opacity-0 transition-all duration-500 mb-6">
      <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-1">{title}</h3>
      <p className="text-foreground">{content}</p>
    </div>
  );

  return (
    <div 
      ref={cardRef}
      className="w-full max-w-3xl mx-auto glass-panel rounded-xl p-8 shadow-lg border-t border-white/40"
    >
      <div className="flex justify-between items-center mb-8">
        <div className="inline-block">
          <span className="subtle-chip">Your Business Idea</span>
        </div>
        <button 
          onClick={onReset}
          className="secondary-button text-sm px-4 py-1.5"
        >
          Generate New Idea
        </button>
      </div>
      
      <div className="result-section opacity-0 transition-all duration-500 mb-8">
        <h2 className="text-3xl font-bold mb-2">{idea.name}</h2>
      </div>
      
      {renderSection("Problem It Solves", idea.problem)}
      {renderSection("Solution and How It Works", idea.solution)}
      {renderSection("Target Audience", idea.targetAudience)}
      {renderSection("Business Model", idea.businessModel)}
      {renderSection("Monetization Strategy", idea.monetization)}
      {renderSection("Challenges and Risks", idea.challengesAndRisks)}
      {renderSection("Why Now", idea.whyNow)}
      {renderSection("How to Build It", idea.howToBuild)}
      {renderSection("AI Prompt", idea.aiPrompt)}
      
      <div className="mt-10 pt-6 border-t border-border/50 flex justify-end space-x-4">
        <button 
          onClick={() => {
            navigator.clipboard.writeText(
              Object.entries(idea)
                .map(([key, value]) => `${key}: ${value}`)
                .join('\n\n')
            );
            alert('Business idea copied to clipboard!');
          }}
          className="secondary-button text-sm"
        >
          Copy to Clipboard
        </button>
        <button 
          onClick={onReset}
          className="primary-button"
        >
          Generate Another Idea
        </button>
      </div>
    </div>
  );
};

export default ResultCard;