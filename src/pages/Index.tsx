
import React from 'react';
import BusinessIdeaHeader from '../components/BusinessIdeaHeader';
import BusinessIdeaForm from '../components/BusinessIdeaForm';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <BusinessIdeaHeader />
        <BusinessIdeaForm />
        
        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>MRR Generator &copy; {new Date().getFullYear()} • Discover your next business idea</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
