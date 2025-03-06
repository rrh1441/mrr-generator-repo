
export type BusinessIdeaParams = {
  skills: string;
  interests: string;
  budget: string;
  riskTolerance: 'Low' | 'Medium' | 'High';
  businessModel: 'SaaS' | 'Marketplace' | 'E-commerce' | 'Services' | 'Content' | 'Mobile App' | 'Other';
};

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
};

// This function simulates generating a business idea
// In a real app, this might call to an AI API
export const generateBusinessIdea = async (params: BusinessIdeaParams): Promise<BusinessIdea> => {
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // For demonstration purposes, return one of these pre-made ideas based on the business model
  const ideaTemplates: Record<string, BusinessIdea> = {
    'SaaS': {
      name: "TaskFlow AI",
      problem: "Professional teams waste hours managing tasks across disjointed tools and manually prioritizing their work.",
      solution: "An AI-powered task management platform that automatically prioritizes work, suggests optimal scheduling, and adapts to your team's workflow patterns over time.",
      targetAudience: "Mid-sized professional service firms (50-200 employees) particularly in consulting, legal, and creative industries.",
      businessModel: "SaaS subscription with tiered pricing based on team size and feature access.",
      techStack: "React/Next.js frontend, Node.js backend with Python for AI components, PostgreSQL database, and TensorFlow for machine learning models.",
      monetization: "Free tier for individuals, Team tier ($12/user/month) for core features, Enterprise tier ($29/user/month) with advanced analytics and integrations.",
      challengesAndRisks: "Market saturation in task management requires strong differentiation. Early AI performance may not meet user expectations. Mitigate with exceptional UX design and transparent AI confidence scores.",
      whyNow: "Remote work has increased the need for intelligent task management, while AI has matured enough to offer genuinely helpful insights rather than gimmicky features.",
      howToBuild: "Start by using Lovable AI to quickly create the React frontend with Tailwind CSS. For the backend, leverage Supabase for authentication, database, and real-time features. Use ChatGPT to help write smart database queries and Claude for crafting your AI prompt engineering. Add OpenAI's API for task prioritization algorithms. Deploy on Vercel for seamless CI/CD and scaling. Use GitHub Copilot to accelerate development cycles."
    },
    'Marketplace': {
      name: "SkillSwap",
      problem: "Professionals need to acquire new skills quickly, but traditional courses are expensive and often not tailored to specific needs.",
      solution: "A peer-to-peer marketplace where professionals exchange skills through 1:1 virtual sessions – teach what you know, learn what you don't.",
      targetAudience: "Career-oriented professionals aged 25-45 looking to upskill or transition to adjacent roles.",
      businessModel: "Two-sided marketplace taking a commission on paid skill exchanges.",
      techStack: "React Native for cross-platform mobile, Firebase for backend, WebRTC for video sessions, and machine learning for matching algorithm.",
      monetization: "15% commission on paid exchanges. Premium subscription ($19/month) for advanced features like skills assessment, certification, and unlimited exchanges.",
      challengesAndRisks: "Building initial liquidity is challenging. Cold start problem can be addressed by focusing on specific professional niches first and using targeted outreach to build supply before demand.",
      whyNow: "The half-life of professional skills is decreasing while the need for continuous learning is growing. Traditional educational institutions aren't adapting quickly enough.",
      howToBuild: "Use Lovable AI to rapidly prototype the marketplace UI. Implement user authentication and database with Supabase. Leverage ChatGPT to generate matching algorithms that pair teachers with students based on skill compatibility. Integrate Daily.co API (with help from Claude) for video sessions. Use OpenAI's API for skill taxonomy development and categorization. Deploy the application on Vercel for optimal performance and edge functions. Implement payments using Stripe's API."
    },
    'E-commerce': {
      name: "Capsule Essentials",
      problem: "Busy professionals waste time and mental energy deciding what to wear while wanting to maintain a professional, stylish appearance.",
      solution: "A personalized essential wardrobe service that delivers high-quality, mix-and-match basics tailored to individual style, body type, and profession.",
      targetAudience: "Urban professionals aged 28-45 with above-average income who prioritize quality and aesthetics but lack shopping time.",
      businessModel: "E-commerce with subscription option for wardrobe refreshes.",
      techStack: "Shopify Plus with custom React components, Node.js for personalization engine, and computer vision APIs for style matching.",
      monetization: "Premium pricing on high-quality basics ($60-150 per item). Optional quarterly subscription ($250/quarter) for seasonal refreshes. Style consultation services ($120).",
      challengesAndRisks: "Inventory management and ensuring fit without try-ons are major challenges. Address with generous return policy and detailed measurement guidance using AR features.",
      whyNow: "Work-from-anywhere policies have created demand for versatile, professional clothing that works across multiple contexts, while sustainability concerns drive interest in quality over quantity.",
      howToBuild: "Start with Lovable AI to build a responsive storefront interface. Use Supabase for customer profiles and preferences storage. Implement ChatGPT for style recommendations and personalization algorithms. Develop a style quiz with Claude's assistance for better user profiling. Use computer vision APIs (like Google Cloud Vision) for image analysis and style matching. Integrate Shopify or Medusa as your e-commerce backend. Deploy on Vercel for global CDN benefits and edge caching."
    },
    'Services': {
      name: "GreenSpace Redesign",
      problem: "Urban dwellers have limited access to nature, affecting wellbeing, while lacking knowledge to create and maintain indoor green spaces.",
      solution: "An end-to-end indoor plant design service that transforms living and working spaces into thriving biophilic environments, with ongoing care guidance.",
      targetAudience: "Urban professionals and families in premium apartments, and small businesses wanting to improve office environments.",
      businessModel: "Service-based with subscription component.",
      techStack: "Mobile app with AR visualization, IoT sensors for plant monitoring, and machine learning for care recommendations.",
      monetization: "Initial design and installation services ($500-2500). Monthly maintenance subscription ($45-120/month). Smart plant monitoring system ($199).",
      challengesAndRisks: "Seasonality and geographic limitations. Address by developing virtual consultation services and expanding into related wellness products.",
      whyNow: "Research increasingly shows the mental health benefits of biophilic design, while urbanization continues to separate people from nature.",
      howToBuild: "Create the initial mobile app UI with Lovable AI. Use Supabase for customer data, plant catalogs, and care schedules. Implement AR visualization features with ARKit/ARCore. Use ChatGPT to generate personalized plant care instructions. Develop recommendation algorithms with Claude's assistance. Create a Zapier integration for connecting with service providers. Add IoT functionality using serverless edge functions on Vercel. Handle appointment scheduling with Cal.com API or a custom solution built with AI assistance."
    },
    'Content': {
      name: "DeepDive",
      problem: "People are overwhelmed by shallow news and content but lack time to find and consume truly substantive material on topics they care about.",
      solution: "A curated platform delivering in-depth, expert analysis on specific topics tailored to users' interests, with audio, written, and video formats.",
      targetAudience: "Intellectually curious professionals aged 30-60 with disposable income and specific interest areas.",
      businessModel: "Premium content subscription with advertising for supplementary revenue.",
      techStack: "React frontend, Ruby on Rails backend, ElasticSearch for content discovery, and NLP for content analysis and personalization.",
      monetization: "Freemium model with limited access at no cost. Premium subscription ($15/month) for full access. Ultra-premium ($49/month) for exclusive expert sessions.",
      challengesAndRisks: "Content creation costs and maintaining quality at scale. Mitigate by starting with 3-5 carefully chosen verticals and using a hybrid approach of staff and freelance experts.",
      whyNow: "Growing distrust in mainstream media coincides with willingness to pay for quality content, as demonstrated by the success of specialized newsletters and podcasts.",
      howToBuild: "Use Lovable AI to build the content platform interface with responsive design. Implement Supabase for user authentication, profiles, and content storage. Leverage ChatGPT for content summarization and topic classification. Use Claude to help with content strategy and expert writer guidelines. Implement search functionality with Algolia or OpenSearch. Set up automatic content recommendations using ML models developed with AI assistance. Use OpenAI's API for automatic tagging and categorization. Deploy on Vercel with edge caching for optimal content delivery."
    },
    'Mobile App': {
      name: "Mindful Moments",
      problem: "People struggle to maintain mindfulness and mental health practices consistently despite good intentions.",
      solution: "A mobile app that uses behavioral science and micro-interventions to seamlessly integrate mindfulness into daily life through subtle prompts and ultra-short practices.",
      targetAudience: "Busy professionals aged 25-50 who are interested in mindfulness but struggle with consistency.",
      businessModel: "Freemium mobile app with subscription features.",
      techStack: "React Native, Firebase, TensorFlow Lite for on-device processing, and wearable device integrations.",
      monetization: "Free basic version. Premium features ($8.99/month) including advanced interventions, personalized programs, and progress insights.",
      challengesAndRisks: "High churn typical of wellness apps. Counter this with particularly strong onboarding, variable reward mechanisms, and social accountability features.",
      whyNow: "Mental health awareness is at an all-time high, while attention spans continue to decrease – creating demand for effective micro-interventions.",
      howToBuild: "Start by prototyping the app UI with Lovable AI. Build with React Native for cross-platform support. Use Supabase for user profiles, progress tracking, and content delivery. Implement ChatGPT for generating personalized mindfulness exercises. Use Claude to help craft effective micro-interventions based on cognitive behavioral therapy principles. Add gamification elements (designed with AI assistance) to improve retention. Implement push notifications using OneSignal. Deploy backend functions on Vercel edge functions for global low-latency access."
    },
    'Other': {
      name: "EcoTrack Sensor",
      problem: "Small businesses struggle to monitor and improve their environmental impact due to complex and expensive sustainability solutions.",
      solution: "Affordable IoT sensors and simplified dashboard that track energy use, water consumption, and waste production, providing actionable recommendations for sustainability improvements.",
      targetAudience: "Small to medium-sized businesses in retail, hospitality, and light manufacturing concerned about costs and environmental impact.",
      businessModel: "Hardware sales with SaaS component.",
      techStack: "IoT hardware running embedded Linux, cloud backend with AWS, React dashboard, and machine learning for optimization algorithms.",
      monetization: "Hardware starter kit ($499) with essential sensors. Monthly subscription ($29-99/month) for analytics and recommendations. Implementation consulting services as needed.",
      challengesAndRisks: "Hardware production and supply chain complexities. Address by partnering with established manufacturers and focusing initially on software with compatible third-party sensors.",
      whyNow: "Increasing regulatory pressure on businesses of all sizes to reduce environmental impact, while IoT technology has become affordable enough for small business applications.",
      howToBuild: "Create the dashboard UI with Lovable AI using React and real-time data visualization. Implement Supabase for device registration, telemetry data storage, and user management. Use ChatGPT to develop energy optimization algorithms and sustainability recommendations. Create device management interfaces with Claude's assistance. Leverage TensorFlow.js for on-device pattern recognition. Build an API layer using serverless functions on Vercel. Use AI-generated documentation to speed up hardware integration for third-party sensors."
    }
  };
  
  // Return the appropriate template or the SaaS one as fallback
  return ideaTemplates[params.businessModel] || ideaTemplates['SaaS'];
};
