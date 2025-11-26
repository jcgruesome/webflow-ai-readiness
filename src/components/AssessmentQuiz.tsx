import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Award, ArrowRight, ArrowLeft, RotateCcw, Loader2, ExternalLink } from 'lucide-react';
import { baseUrl } from '../lib/base-url';
import { assessmentConfig, getResultEmailLine } from '../lib/assessment-config';

interface Question {
  id: string;
  question: string;
  type: 'text' | 'email' | 'single' | 'multiple' | 'textarea' | 'checkbox';
  options?: { value: string; label: string; points?: number }[];
  required: boolean;
  placeholder?: string;
  conditionalQuestion?: { dependsOn: string; dependsValue: any; question: string; type: 'text' | 'textarea'; placeholder?: string };
}

// Questions mapped to updated scope requirements
const questions: Question[] = [
  {
    id: 'company_name',
    question: 'Company Name',
    type: 'text',
    required: true,
    placeholder: 'Acme Inc.'
  },
  {
    id: 'contact_email',
    question: 'Work Email',
    type: 'email',
    required: true,
    placeholder: 'john@company.com'
  },
  {
    id: 'role_title',
    question: 'Your Role/Title',
    type: 'text',
    required: true,
    placeholder: 'VP of Operations'
  },
  {
    id: 'company_size',
    question: 'How many employees does your company have?',
    type: 'single',
    required: true,
    options: [
      { value: '1-49', label: '1–49' },
      { value: '50-199', label: '50–199' },
      { value: '200-499', label: '200–499' },
      { value: '500+', label: '500+' },
    ],
  },
  {
    id: 'annual_revenue',
    question: 'What\'s your estimated annual revenue?',
    type: 'single',
    required: true,
    options: [
      { value: 'under_10m', label: 'Under $10M' },
      { value: '10m_50m', label: '$10M–$50M' },
      { value: '50m_200m', label: '$50M–$200M' },
      { value: '200m_500m', label: '$200M–$500M' },
      { value: 'over_500m', label: 'Over $500M' },
    ],
  },
  {
    id: 'primary_pain',
    question: 'Which of these operational challenges do you face? (Select all that apply)',
    type: 'multiple',
    required: true,
    options: [
      { value: 'quoting_delays', label: 'Quoting delays' },
      { value: 'manual_order_processing', label: 'Manual order processing' },
      { value: 'support_backlog', label: 'Support backlog' },
      { value: 'claims_processing', label: 'Claims processing delays' },
      { value: 'slow_response_times', label: 'Slow response times to customer inquiries' },
      { value: 'inconsistent_answers', label: 'Inconsistent answers across team members' },
      { value: 'difficulty_accessing_info', label: 'Difficulty accessing the right information quickly' },
      { value: 'manual_data_entry', label: 'Manual data entry and system updates' },
      { value: 'complex_pricing', label: 'Complex pricing or configuration processes' },
      { value: 'handoff_delays', label: 'Handoff delays between teams' },
      { value: 'slow_onboarding', label: 'Training new team members takes too long' },
      { value: 'difficulty_scaling', label: 'Difficulty scaling operations without adding headcount' },
      { value: 'other', label: 'Other (please specify)' },
    ],
  },
  {
    id: 'existing_automation',
    question: 'Do you currently have any automation in place?',
    type: 'single',
    required: true,
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ],
    conditionalQuestion: {
      dependsOn: 'existing_automation',
      dependsValue: 'yes',
      question: 'Which systems or processes are automated?',
      type: 'textarea',
      placeholder: 'Please describe your current automation...'
    }
  },
  {
    id: 'tech_stack',
    question: 'What systems does your company currently use? (Select all that apply)',
    type: 'multiple',
    required: true,
    options: [
      { value: 'erp', label: 'ERP (SAP, Oracle, NetSuite, etc.)' },
      { value: 'crm', label: 'CRM (Salesforce, HubSpot, etc.)' },
      { value: 'helpdesk', label: 'Helpdesk (Zendesk, Intercom, etc.)' },
      { value: 'wms', label: 'WMS (Warehouse Management System)' },
      { value: 'custom_db', label: 'Custom databases or systems' },
      { value: 'other', label: 'Other (please specify)' },
    ],
  },
  {
    id: 'estimated_AI_budget_2026',
    question: 'What\'s your estimated AI automation budget for 2026?',
    type: 'single',
    required: true,
    options: [
      { value: 'none', label: 'None' },
      { value: 'under_25k', label: 'Under $25k' },
      { value: '25k_50k', label: '$25k–$50k' },
      { value: '50k_150k', label: '$50k–$150k' },
      { value: 'over_150k', label: 'Over $150k' },
    ],
  },
  {
    id: 'decision_timeline',
    question: 'What\'s your timeline for implementing operational improvements?',
    type: 'single',
    required: true,
    options: [
      { value: 'now', label: 'Now' },
      { value: '0_3_months', label: '0–3 months' },
      { value: '3_6_months', label: '3–6 months' },
      { value: '6_12_months', label: '6–12 months' },
      { value: 'no_budget', label: 'No budget' },
    ],
  },
  {
    id: 'open_ended_pain',
    question: 'In one sentence, what\'s your biggest automation challenge?',
    type: 'textarea',
    required: true,
    placeholder: 'Describe your biggest automation challenge...'
  },
  {
    id: 'consent_checkbox',
    question: 'I consent to being contacted and having my data stored',
    type: 'checkbox',
    required: true,
    options: [
      { value: 'consent', label: 'Yes, I consent to being contacted and having my data stored' },
    ],
  },
];

export default function AssessmentQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scoreBand, setScoreBand] = useState<'hot' | 'high' | 'medium' | 'low'>('low');

  const currentQuestion = questions[currentStep];
  const totalSteps = questions.length;
  const progress = (currentStep / totalSteps) * 100;

  // Check if current question is answered
  const isCurrentAnswered = () => {
    const answer = answers[currentQuestion.id];
    if (!currentQuestion.required) return true;
    
    if (currentQuestion.type === 'multiple') {
      return Array.isArray(answer) && answer.length > 0;
    }
    if (currentQuestion.type === 'checkbox') {
      return answer === true || answer === 'consent';
    }
    return answer !== undefined && answer !== '' && answer !== null;
  };

  // Check if conditional question should be shown
  const shouldShowConditional = () => {
    if (!currentQuestion.conditionalQuestion) return false;
    const dependsOnAnswer = answers[currentQuestion.conditionalQuestion.dependsOn];
    return dependsOnAnswer === currentQuestion.conditionalQuestion.dependsValue;
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      calculateAndSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAnswer = (value: any) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleMultipleChoice = (value: string, checked: boolean) => {
    setAnswers(prev => {
      const current = prev[currentQuestion.id] || [];
      if (checked) {
        return { ...prev, [currentQuestion.id]: [...current, value] };
      } else {
        return { ...prev, [currentQuestion.id]: current.filter((v: string) => v !== value) };
      }
    });
  };

  const calculateAndSubmit = async () => {
    setIsSubmitting(true);

    // Calculate score based on new scope rules
    let totalScore = 0;
    const maxPossibleScore = 100; // Normalized max

    // Company size: >50 = +10
    const companySize = answers.company_size;
    if (companySize === '50-199' || companySize === '200-499' || companySize === '500+') {
      totalScore += 10;
    }

    // Annual revenue: >$10M = +10
    const revenue = answers.annual_revenue;
    if (revenue === '10m_50m' || revenue === '50m_200m' || revenue === '200m_500m' || revenue === 'over_500m') {
      totalScore += 10;
    }

    // Primary pain: match to high-value problems (quoting, claims, order processing) = +15
    const primaryPain = answers.primary_pain || [];
    const highValuePains = ['quoting_delays', 'manual_order_processing', 'support_backlog', 'claims_processing'];
    const hasHighValuePain = primaryPain.some((pain: string) => highValuePains.includes(pain));
    if (hasHighValuePain) {
      totalScore += 15;
    }

    // Existing automation: none = +5 (higher need), some = +10 (higher readiness)
    const existingAutomation = answers.existing_automation;
    if (existingAutomation === 'no') {
      totalScore += 5;
    } else if (existingAutomation === 'yes') {
      totalScore += 10;
    }

    // Tech stack presence (ERP/CRM) = +10
    const techStack = answers.tech_stack || [];
    const hasErpOrCrm = techStack.includes('erp') || techStack.includes('crm');
    if (hasErpOrCrm) {
      totalScore += 10;
    }

    // Estimated budget: 50k–150k = +10, >150k = +20
    const budget = answers.estimated_AI_budget_2026;
    if (budget === '50k_150k') {
      totalScore += 10;
    } else if (budget === 'over_150k') {
      totalScore += 20;
    }

    // Decision timeline: now/0–3mo = +15, 3–6mo = +10
    const timeline = answers.decision_timeline;
    if (timeline === 'now' || timeline === '0_3_months') {
      totalScore += 15;
    } else if (timeline === '3_6_months') {
      totalScore += 10;
    }

    // Open-ended pain (qualitative): presence of specific measurable pain = +10
    const openEndedPain = (answers.open_ended_pain || '').toLowerCase();
    const measurableTerms = assessmentConfig.measurableTerms;
    const hasMeasurablePain = measurableTerms.some(term => openEndedPain.includes(term));
    if (hasMeasurablePain) {
      totalScore += 10;
    }

    // Normalize to 0-100 (already using 0-100 scale, but cap at 100)
    const normalizedScore = Math.min(100, totalScore);
    setScore(normalizedScore);

    // Determine score band
    let band: 'hot' | 'high' | 'medium' | 'low' = 'low';
    if (normalizedScore >= 80) band = 'hot';
    else if (normalizedScore >= 60) band = 'high';
    else if (normalizedScore >= 40) band = 'medium';
    setScoreBand(band);

    // Submit to HubSpot
    try {
      const response = await fetch(`${baseUrl}/api/hubspot/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          score: normalizedScore,
        }),
      });

      if (!response.ok) {
        console.error('Failed to submit to HubSpot');
      }
    } catch (error) {
      console.error('Error submitting to HubSpot:', error);
    }

    setIsSubmitting(false);
    setShowResults(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentStep(0);
    setShowResults(false);
    setScore(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Contact questions are now at the beginning, so no special context card needed
  const isContactStep = false;
  const isLastContactStep = false;

  // Results Screen
  if (showResults) {
    const bandConfig = assessmentConfig.scoreBands[scoreBand];
    const userEmail = answers.contact_email || answers.email || '';

    return (
      <div className="w-full space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Score Card */}
        <Card className="w-full border-2 rx-border-slate relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="rx-animated-gradient w-full h-full"></div>
          </div>
          <CardHeader className="text-center pb-4 sm:pb-6 relative z-10 flex flex-col items-center w-full">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full rx-gradient-green-yellow flex items-center justify-center p-1 shadow-lg">
                <div className="w-full h-full rounded-full rx-bg-slate flex items-center justify-center">
                  <Award className="w-12 h-12 sm:w-16 sm:h-16 rx-text-green" />
                </div>
              </div>
            </div>
            <CardTitle className="text-3xl sm:text-4xl md:text-5xl font-black mb-6">
              <span className={`${bandConfig.color}`}>{score}</span>
              <span className="rx-text-steel text-2xl sm:text-3xl">/100</span>
            </CardTitle>
            <CardDescription className="text-lg sm:text-xl md:text-2xl font-bold rx-gradient-text rx-gc-green-blue mb-6">
              {bandConfig.label}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 relative z-10">
            <div className="text-center">
              <p className="text-sm sm:text-base md:text-lg rx-text-steel leading-relaxed px-2">
                {scoreBand === 'hot' && `Your AI Readiness Score: ${score} — High. You show strong potential in data access and repetitive operational tasks. This assessment is a diagnostic — to turn these opportunities into prioritized quick wins and a costed implementation plan we recommend a short full assessment. Book a 30‑minute discovery with our team to reserve a slot and get a tailored implementation plan.`}
                {scoreBand === 'high' && `Your AI Readiness Score: ${score} — High. We see meaningful opportunities. Book a discovery to get a prioritized plan.`}
                {scoreBand === 'medium' && `Your AI Readiness Score: ${score} — Medium. We recommend starting with the Budget Planning Checklist and a webinar.`}
                {scoreBand === 'low' && `Your AI Readiness Score: ${score} — Low. We recommend exploring some foundational automation resources and re-checking in 90 days.`}
              </p>
            </div>

            {/* CTA Based on Score Band */}
            <div className="space-y-4 pt-2 sm:pt-4">
              {(scoreBand === 'hot' || scoreBand === 'high') && (
                <div className="space-y-3">
                  <Button
                    className="w-full text-base sm:text-lg py-5 sm:py-6 rx-btn-primary font-bold min-h-[48px] sm:min-h-[56px]"
                    onClick={() => window.open(assessmentConfig.calendly.hotLeadUrl, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Book a 30-45 min Full Assessment
                  </Button>
                </div>
              )}

              {scoreBand === 'medium' && (
                <div className="space-y-3">
                  <Button
                    className="w-full text-base sm:text-lg py-5 sm:py-6 rx-btn-primary font-bold min-h-[48px] sm:min-h-[56px]"
                    onClick={() => window.open(assessmentConfig.resources.budgetChecklistPdf, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Download Budget Planning Checklist
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-base sm:text-lg py-5 sm:py-6 rx-btn-secondary border-rx-border-slate rx-text-steel hover:border-[#73B400] hover:text-white min-h-[48px] sm:min-h-[56px]"
                    onClick={() => window.open(assessmentConfig.events.webinarRegistrationUrl, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Join Webinar
                  </Button>
                </div>
              )}

              {scoreBand === 'low' && (
                <div className="space-y-3">
                  <p className="text-center rx-text-steel text-sm sm:text-base">
                    Explore foundational automation resources and we'll check in again in 90 days.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full text-base sm:text-lg py-5 sm:py-6 rx-btn-secondary border-rx-border-slate rx-text-steel hover:border-[#73B400] hover:text-white min-h-[48px] sm:min-h-[56px]"
                    onClick={() => window.open(assessmentConfig.resources.foundationalResourcesPage, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    View Resources
                  </Button>
                </div>
              )}


              <Button
                variant="ghost"
                className="w-full mt-4 sm:mt-6 rx-text-steel hover:text-white hover:bg-[rgba(115,180,0,0.1)]"
                onClick={handleRetake}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Retake Assessment
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* What's Next */}
        <Card className="w-full rx-bg-slate border rx-border-slate">
          <CardHeader className="flex flex-col items-start w-full pb-6">
            <CardTitle className="text-xl sm:text-2xl font-bold mb-6 w-full">
              <span className="rx-gradient-text rx-gc-green-blue">What's Next?</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-5">
            <div className="space-y-4 sm:space-y-5 rx-text-steel">
              {scoreBand === 'hot' && (
                <>
                  <p className="flex items-start gap-3 text-sm sm:text-base leading-relaxed">
                    <span className="rx-text-green font-bold flex-shrink-0">1.</span>
                    <span>Our team will review your assessment within 24 hours</span>
                  </p>
                  <p className="flex items-start gap-3 text-sm sm:text-base leading-relaxed">
                    <span className="rx-text-blue font-bold flex-shrink-0">2.</span>
                    <span>You'll receive personalized recommendations showing where smarter AI agents can deliver better outcomes and faster revenue</span>
                  </p>
                  <p className="flex items-start gap-3 text-sm sm:text-base leading-relaxed">
                    <span className="rx-text-green font-bold flex-shrink-0">3.</span>
                    <span>We'll reach out to schedule a full assessment where we'll identify how to build, tune, and maintain AI agents for your operations</span>
                  </p>
                </>
              )}
              {scoreBand === 'high' && (
                <>
                  <p className="flex items-start gap-3 text-sm sm:text-base leading-relaxed">
                    <span className="rx-text-green font-bold flex-shrink-0">1.</span>
                    <span>Our team will review your assessment within 3 business days</span>
                  </p>
                  <p className="flex items-start gap-3 text-sm sm:text-base leading-relaxed">
                    <span className="rx-text-blue font-bold flex-shrink-0">2.</span>
                    <span>You'll receive a case study and booking link for a discovery call</span>
                  </p>
                  <p className="flex items-start gap-3 text-sm sm:text-base leading-relaxed">
                    <span className="rx-text-green font-bold flex-shrink-0">3.</span>
                    <span>We'll reach out to schedule a discovery call to discuss your opportunities</span>
                  </p>
                </>
              )}
              {scoreBand === 'medium' && (
                <>
                  <p className="flex items-start gap-3 text-sm sm:text-base leading-relaxed">
                    <span className="rx-text-green font-bold flex-shrink-0">1.</span>
                    <span>Download the Budget Planning Checklist to help plan for 2026</span>
                  </p>
                  <p className="flex items-start gap-3 text-sm sm:text-base leading-relaxed">
                    <span className="rx-text-blue font-bold flex-shrink-0">2.</span>
                    <span>Join our upcoming webinar on AI budget planning</span>
                  </p>
                  <p className="flex items-start gap-3 text-sm sm:text-base leading-relaxed">
                    <span className="rx-text-green font-bold flex-shrink-0">3.</span>
                    <span>You'll receive monthly newsletter updates with AI insights</span>
                  </p>
                </>
              )}
              {scoreBand === 'low' && (
                <>
                  <p className="flex items-start gap-3 text-sm sm:text-base leading-relaxed">
                    <span className="rx-text-green font-bold flex-shrink-0">1.</span>
                    <span>Explore foundational automation resources</span>
                  </p>
                  <p className="flex items-start gap-3 text-sm sm:text-base leading-relaxed">
                    <span className="rx-text-blue font-bold flex-shrink-0">2.</span>
                    <span>Subscribe to our newsletter for AI insights</span>
                  </p>
                  <p className="flex items-start gap-3 text-sm sm:text-base leading-relaxed">
                    <span className="rx-text-green font-bold flex-shrink-0">3.</span>
                    <span>We'll check in again in 90 days to see if your situation has changed</span>
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quiz Screen
  return (
    <div className="w-full">
      {/* Screen reader announcement */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        Question {currentStep + 1} of {totalSteps}. {Math.round(progress)}% complete.
      </div>
      
      {/* Progress Bar */}
      <div className="mb-6 sm:mb-8" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Assessment progress">
        <div className="flex justify-between items-center mb-2 sm:mb-3">
          <span className="text-xs sm:text-sm font-semibold rx-text-steel">
            Question {currentStep + 1} of {totalSteps}
          </span>
          <span className="text-xs sm:text-sm font-semibold rx-text-green">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="w-full h-2 sm:h-3 rx-bg-slate rounded-full overflow-hidden">
          <div 
            className="h-full rx-gradient-green-yellow transition-all duration-500 ease-out rounded-full shadow-sm"
            style={{ width: `${progress}%` }}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Question Card */}
      <Card className="w-full border-2 rx-border-slate mb-6 sm:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-300" role="region" aria-labelledby={`question-${currentStep}`}>
        <CardHeader className="pb-6 text-left flex flex-col items-start w-full">
          <CardTitle id={`question-${currentStep}`} className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight mb-6">
            {currentQuestion.question}
          </CardTitle>
          {currentQuestion.required && (
            <div className="mb-3">
              <span className="text-xs sm:text-sm rx-text-green font-semibold" aria-label="Required question">Required</span>
            </div>
          )}
          {/* Question Type Indicator */}
          {currentQuestion.type === 'multiple' && (
            <div className="flex items-center gap-2 text-xs sm:text-sm rx-text-steel mb-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>Select all that apply</span>
            </div>
          )}
          {currentQuestion.type === 'single' && (
            <div className="flex items-center gap-2 text-xs sm:text-sm rx-text-steel mb-3">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
              <span>Select one</span>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Single Choice */}
          {currentQuestion.type === 'single' && (
            <RadioGroup
              value={answers[currentQuestion.id] || ''}
              onValueChange={handleAnswer}
            >
              {currentQuestion.options?.map((option) => {
                const isSelected = answers[currentQuestion.id] === option.value;
                return (
                  <div 
                    key={option.value}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 rx-bg-slate transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-[#73B400] bg-[rgba(115,180,0,0.05)] shadow-sm' 
                        : 'border-[rgba(139,154,173,0.15)] hover:border-[rgba(115,180,0,0.5)] hover:bg-[rgba(115,180,0,0.02)]'
                    }`}
                    onClick={() => handleAnswer(option.value)}
                  >
                    <RadioGroupItem 
                      value={option.value} 
                      id={option.value} 
                      className="flex-shrink-0 pointer-events-none mt-0.5" 
                    />
                    <Label 
                      htmlFor={option.value} 
                      className={`flex-1 cursor-pointer text-base font-medium leading-normal pointer-events-none ${
                        isSelected ? 'text-white' : 'rx-text-steel'
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {option.label}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          )}

          {/* Multiple Choice */}
          {currentQuestion.type === 'multiple' && (
            <div className="space-y-4">
              {currentQuestion.options?.map((option) => {
                const isChecked = (answers[currentQuestion.id] || []).includes(option.value);
                return (
                  <div 
                    key={option.value}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 rx-bg-slate transition-all cursor-pointer ${
                      isChecked 
                        ? 'border-[#73B400] bg-[rgba(115,180,0,0.05)] shadow-sm' 
                        : 'border-[rgba(139,154,173,0.15)] hover:border-[rgba(115,180,0,0.5)] hover:bg-[rgba(115,180,0,0.02)]'
                    }`}
                    onClick={() => handleMultipleChoice(option.value, !isChecked)}
                  >
                    <Checkbox
                      id={option.value}
                      checked={isChecked}
                      onCheckedChange={(checked) => handleMultipleChoice(option.value, checked as boolean)}
                      className="flex-shrink-0 pointer-events-none mt-0.5"
                    />
                    <Label 
                      htmlFor={option.value}
                      className={`flex-1 cursor-pointer text-base font-medium leading-normal pointer-events-none ${
                        isChecked ? 'text-white' : 'rx-text-steel'
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {option.label}
                    </Label>
                  </div>
                );
              })}
            </div>
          )}

          {/* Text Input */}
          {currentQuestion.type === 'text' && (
            <Input
              type="text"
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && isCurrentAnswered() && !isSubmitting) {
                  e.preventDefault();
                  handleNext();
                }
              }}
              placeholder={currentQuestion.placeholder}
              className="text-sm sm:text-base p-3 sm:p-4 rx-bg-deep-space text-white border-2 rx-border-slate focus:border-[#73B400] focus:ring-2 focus:ring-[rgba(115,180,0,0.2)] transition-all"
            />
          )}

          {/* Email Input */}
          {currentQuestion.type === 'email' && (
            <Input
              type="email"
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && isCurrentAnswered() && !isSubmitting) {
                  e.preventDefault();
                  handleNext();
                }
              }}
              placeholder={currentQuestion.placeholder}
              className="text-sm sm:text-base p-3 sm:p-4 rx-bg-deep-space text-white border-2 rx-border-slate focus:border-[#73B400] focus:ring-2 focus:ring-[rgba(115,180,0,0.2)] transition-all"
            />
          )}

          {/* Textarea */}
          {currentQuestion.type === 'textarea' && (
            <Textarea
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && isCurrentAnswered() && !isSubmitting) {
                  e.preventDefault();
                  handleNext();
                }
              }}
              placeholder={currentQuestion.placeholder}
              rows={4}
              className="text-sm sm:text-base p-3 sm:p-4 rx-bg-deep-space text-white border-2 rx-border-slate focus:border-[#73B400] focus:ring-2 focus:ring-[rgba(115,180,0,0.2)] transition-all resize-none"
            />
          )}

          {/* Checkbox (for consent) */}
          {currentQuestion.type === 'checkbox' && (
            <div className="space-y-4">
              {currentQuestion.options?.map((option) => {
                const isChecked = answers[currentQuestion.id] === true || answers[currentQuestion.id] === option.value;
                return (
                  <div 
                    key={option.value}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 rx-bg-slate transition-all cursor-pointer ${
                      isChecked 
                        ? 'border-[#73B400] bg-[rgba(115,180,0,0.05)] shadow-sm' 
                        : 'border-[rgba(139,154,173,0.15)] hover:border-[rgba(115,180,0,0.5)] hover:bg-[rgba(115,180,0,0.02)]'
                    }`}
                    onClick={() => handleAnswer(isChecked ? false : option.value)}
                  >
                    <Checkbox
                      id={option.value}
                      checked={isChecked}
                      onCheckedChange={(checked) => handleAnswer(checked ? option.value : false)}
                      className="flex-shrink-0 pointer-events-none mt-0.5"
                    />
                    <Label 
                      htmlFor={option.value}
                      className={`flex-1 cursor-pointer text-base font-medium leading-normal pointer-events-none ${
                        isChecked ? 'text-white' : 'rx-text-steel'
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {option.label}
                    </Label>
                  </div>
                );
              })}
            </div>
          )}

          {/* Conditional Question (e.g., existing_automation follow-up) */}
          {shouldShowConditional() && currentQuestion.conditionalQuestion && (
            <div className="mt-6 pt-6 border-t border-[rgba(139,154,173,0.15)]">
              <Label className="text-base font-semibold text-white mb-4 block">
                {currentQuestion.conditionalQuestion.question}
              </Label>
              {currentQuestion.conditionalQuestion.type === 'textarea' ? (
                <Textarea
                  value={answers[`${currentQuestion.id}_conditional`] || ''}
                  onChange={(e) => setAnswers(prev => ({ ...prev, [`${currentQuestion.id}_conditional`]: e.target.value }))}
                  placeholder={currentQuestion.conditionalQuestion.placeholder}
                  rows={4}
                  className="text-sm sm:text-base p-3 sm:p-4 rx-bg-deep-space text-white border-2 rx-border-slate focus:border-[#73B400] focus:ring-2 focus:ring-[rgba(115,180,0,0.2)] transition-all resize-none"
                />
              ) : (
                <Input
                  type="text"
                  value={answers[`${currentQuestion.id}_conditional`] || ''}
                  onChange={(e) => setAnswers(prev => ({ ...prev, [`${currentQuestion.id}_conditional`]: e.target.value }))}
                  placeholder={currentQuestion.conditionalQuestion.placeholder}
                  className="text-sm sm:text-base p-3 sm:p-4 rx-bg-deep-space text-white border-2 rx-border-slate focus:border-[#73B400] focus:ring-2 focus:ring-[rgba(115,180,0,0.2)] transition-all"
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Context Card Before Contact Questions */}
      {isContactStep && !isLastContactStep && (
        <Card className="rx-bg-slate border-2 border-[rgba(115,180,0,0.3)] mb-6 sm:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full rx-bg-slate border border-[rgba(115,180,0,0.3)] flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 rx-text-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-3">Almost done!</h3>
                <p className="text-sm sm:text-base rx-text-steel">We'll send your personalized results to your email.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between pb-4 sm:pb-0">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base min-h-[48px] sm:min-h-[56px] rx-btn-secondary border-rx-border-slate rx-text-steel hover:border-[#73B400] hover:text-white disabled:opacity-30"
        >
          <ArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          Previous
        </Button>

        <Button
          onClick={handleNext}
          disabled={!isCurrentAnswered() || isSubmitting}
          className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base min-h-[48px] sm:min-h-[56px] rx-btn-primary font-bold"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
              Calculating...
            </>
          ) : currentStep === totalSteps - 1 ? (
            <>
              View Results
              <Award className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </>
          ) : (
            <>
              Next
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

