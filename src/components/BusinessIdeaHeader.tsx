import React from 'react';

const BusinessIdeaHeader: React.FC = () => {
  return (
    <header className="text-center mb-12 animate-slide-down">
      <div className="inline-block mb-3">
        <span className="subtle-chip">MRR Generator</span>
      </div>
      <h1 className="text-4xl font-semibold mb-3 tracking-tight">
        Find Your Perfect Business Idea
      </h1>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        A free tool to actually help you start making money online
      </p>
    </header>
  );
};

export default BusinessIdeaHeader;