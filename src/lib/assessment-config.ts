/**
 * ReshapeX AI Readiness Assessment Configuration
 * 
 * Update these values before deploying to production.
 * This centralizes all external links and configuration.
 */

export const assessmentConfig = {
  // Brand
  branding: {
    companyName: 'ReshapeX',
    logoUrl: '/logo.svg', // Update with actual logo path
    websiteUrl: 'https://reshapex.com',
    contactEmail: 'chris@reshapex.com',
  },

  // Booking & Scheduling
  calendly: {
    hotLeadUrl: 'https://calendly.com/reshapex/full-assessment', // 30-45 min Full Assessment
    highLeadUrl: 'https://calendly.com/reshapex/discovery', // Discovery call
  },

  // Resources & Downloads
  resources: {
    caseStudyPdf: 'https://reshapex.com/resources/case-study.pdf',
    budgetChecklistPdf: 'https://reshapex.com/resources/budget-planning-checklist.pdf',
    foundationalResourcesPage: 'https://reshapex.com/resources',
  },

  // Events
  events: {
    webinarRegistrationUrl: 'https://reshapex.com/webinar/ai-budget-planning',
  },

  // HubSpot
  hubspot: {
    // These are handled via environment variables, not here
    // HUBSPOT_ACCESS_TOKEN should be in .env
  },

  // Score Bands Configuration
  scoreBands: {
    hot: {
      min: 80,
      max: 100,
      tag: 'Assess:Hot',
      label: 'Hot Lead',
      color: 'text-red-600',
      sla: '24 hours',
    },
    high: {
      min: 60,
      max: 79,
      tag: 'Assess:High',
      label: 'High Readiness',
      color: 'text-orange-600',
      sla: '3 business days',
    },
    medium: {
      min: 40,
      max: 59,
      tag: 'Assess:Medium',
      label: 'Medium Readiness',
      color: 'text-yellow-600',
      sla: 'Automated nurture',
    },
    low: {
      min: 0,
      max: 39,
      tag: 'Assess:Low',
      label: 'Early Stage',
      color: 'text-gray-600',
      sla: '90-day nurture',
    },
  },

  // Secondary Signal Criteria for Hot Lead Auto-Assignment
  hotLeadCriteria: {
    autoAssignToChris: true, // Enable/disable auto-assignment
    secondarySignals: {
      companySizeThreshold: '50-199', // Assign if >= this size
      budgetThreshold: '50k-150k', // Assign if >= this budget
      timelineThreshold: '0-3mo', // Assign if <= this timeline
    },
    ownerEmail: 'chris@reshapex.com',
  },

  // Email Validation
  validation: {
    freeEmailDomains: [
      'gmail.com',
      'yahoo.com',
      'hotmail.com',
      'outlook.com',
      'aol.com',
      'icloud.com',
      'live.com',
      'msn.com',
      'mail.com',
      'protonmail.com',
    ],
  },

  // Measurable terms for bonus points in open-ended question
  measurableTerms: [
    'hours',
    'days',
    'weeks',
    'cost',
    'revenue',
    'delay',
    'backlog',
    'manual',
    'slow',
    'time',
    'money',
    'staff',
    'employees',
    'process',
  ],

  // Analytics
  analytics: {
    trackingEnabled: true,
    googleAnalyticsId: '', // Add GA4 ID if using
    mixpanelToken: '', // Add Mixpanel token if using
  },

  // Feature Flags
  features: {
    showProgressBar: true,
    allowRetake: true,
    sendEmailCopy: true, // Send results copy to user email
    enableConditionalQuestions: true,
    requireConsent: true,
  },

  // Copy & Messaging
  copy: {
    heroTitle: 'AI Readiness Assessment',
    heroSubtitle: 'This 2-minute AI Readiness Assessment provides a quick diagnostic and readiness score to help you decide whether a deeper infrastructure & operations assessment is right for your team.',
    heroDescription: 'The results show high-level opportunity areas. To get prioritized quick wins and a tactical plan, we will run a full assessment together.',
    
    whyFullAssessment: {
      title: 'Why a Full Assessment?',
      description: 'This quick assessment identifies high-level opportunities. To get prioritized quick wins, validate your infrastructure, and receive a tactical implementation plan with cost estimates, book a full 30-45 minute assessment with our team.',
    },
  },
};

// Type exports for TypeScript
export type ScoreBand = 'hot' | 'high' | 'medium' | 'low';

export type ScoreBandConfig = {
  min: number;
  max: number;
  tag: string;
  label: string;
  color: string;
  sla: string;
};

// Helper function to determine score band
export function getScoreBand(score: number): ScoreBand {
  if (score >= assessmentConfig.scoreBands.hot.min) return 'hot';
  if (score >= assessmentConfig.scoreBands.high.min) return 'high';
  if (score >= assessmentConfig.scoreBands.medium.min) return 'medium';
  return 'low';
}

// Helper function to check if email is corporate
export function isCorporateEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  return !assessmentConfig.validation.freeEmailDomains.includes(domain);
}

// Helper function to check for measurable terms
export function hasMeasurableTerms(text: string): boolean {
  const lowerText = text.toLowerCase();
  return assessmentConfig.measurableTerms.some(term => 
    lowerText.includes(term)
  );
}

// Helper function to format result email line
export function getResultEmailLine(email: string): string {
  return `A copy of your results has been sent to ${email}`;
}
