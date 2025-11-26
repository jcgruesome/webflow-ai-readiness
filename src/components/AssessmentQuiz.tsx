import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Award, ArrowRight, ArrowLeft, RotateCcw, Loader2, ExternalLink, BookOpen, Video } from 'lucide-react';
import { baseUrl } from '../lib/base-url';
import { assessmentConfig, getResultEmailLine } from '../lib/assessment-config';

interface Question {
  id: string;
  question: string;
  type: 'text' | 'email' | 'single' | 'multiple' | 'textarea';
  options?: { value: string; label: string; points?: number }[];
  required: boolean;
  placeholder?: string;
}

// Questions mapped to actual HubSpot properties from "AI Readiness Assessment" group
const questions: Question[] = [
  {
    id: 'assessment_q1_response',
    question: 'What best describes your company\'s operations?',
    type: 'multiple',
    required: true,
    options: [
      { value: 'complex_sales', label: 'We handle complex technical sales or custom quotes', points: 15 },
      { value: 'high_volume_support', label: 'We manage high-volume customer inquiries or support', points: 15 },
      { value: 'rfps_proposals_contracts', label: 'We process RFPs, proposals, or contracts regularly', points: 15 },
      { value: 'multi_step_projects_or_services', label: 'We coordinate multi-step projects or service delivery', points: 10 },
      { value: 'tech_docs_or_kbs', label: 'We manage technical documentation or knowledge bases', points: 10 },
      { value: 'other', label: 'Other', points: 5 },
    ],
  },
  {
    id: 'assessment_automation_level',
    question: 'What\'s your current process for handling complex customer requests?',
    type: 'single',
    required: true,
    options: [
      { value: 'fully_manual', label: 'Fully manual (email, phone, documents)', points: 0 },
      { value: 'mostly_manual', label: 'Some tools, but lots of manual steps', points: 5 },
      { value: 'semi_automated', label: 'Semi-automated with workflows', points: 10 },
      { value: 'mostly_automated', label: 'Mostly automated but not AI-powered', points: 15 },
      { value: 'ai_but_needs_tuning', label: 'Using AI but need help tuning and maintaining it', points: 20 },
      { value: 'fully_automated', label: 'Already using AI/automation extensively', points: 15 },
    ],
  },
  {
    id: 'assessment_q3_response',
    question: 'Which of these operational challenges do you face?',
    type: 'multiple',
    required: true,
    options: [
      { value: 'slow_response', label: 'Slow response times to customer inquiries', points: 10 },
      { value: 'inconsistent_answers', label: 'Inconsistent answers across team members', points: 10 },
      { value: 'slow_info', label: 'Difficulty accessing the right information quickly', points: 10 },
      { value: 'manual_data_entry', label: 'Manual data entry and system updates', points: 10 },
      { value: 'complex_pricing', label: 'Complex pricing or configuration processes', points: 15 },
      { value: 'handoff_delays', label: 'Handoff delays between teams', points: 10 },
      { value: 'slow_onboarding', label: 'Training new team members takes too long', points: 5 },
      { value: 'difficulty_scaling', label: 'Difficulty scaling operations without adding headcount', points: 15 },
    ],
  },
  {
    id: 'assessment_manual_task_hours',
    question: 'How much time does your team spend on repetitive, manual tasks each week?',
    type: 'single',
    required: true,
    options: [
      { value: '5_less_hours', label: 'Less than 5 hours per person', points: 0 },
      { value: '5_10_hours', label: '5-10 hours per person', points: 5 },
      { value: '10_20_hours', label: '10-20 hours per person', points: 10 },
      { value: '20_plus_hours', label: 'More than 20 hours per person', points: 20 },
      { value: 'not_sure', label: 'Not sure', points: 0 },
    ],
  },
  {
    id: 'assessment_systems_used',
    question: 'What systems does your company currently use?',
    type: 'multiple',
    required: true,
    options: [
      { value: 'crm', label: 'CRM (Salesforce, HubSpot, etc.)', points: 10 },
      { value: 'erp', label: 'ERP (SAP, Oracle, NetSuite, etc.)', points: 10 },
      { value: 'project_management', label: 'Project Management (Asana, Monday, Jira, etc.)', points: 5 },
      { value: 'support_ticketing', label: 'Support/Ticketing (Zendesk, Intercom, etc.)', points: 5 },
      { value: 'custom_databases', label: 'Custom databases or systems', points: 5 },
      { value: 'spreadsheets_docs', label: 'Mostly spreadsheets and documents', points: 0 },
      { value: 'other', label: 'Other', points: 0 },
    ],
  },
  {
    id: 'assessment_decision_makers',
    question: 'Who would be involved in evaluating an AI automation solution at your company?',
    type: 'multiple',
    required: true,
    options: [
      { value: 'primary', label: 'I\'m the primary decision maker', points: 20 },
      { value: 'ceo_pres', label: 'CEO/President', points: 15 },
      { value: 'cfa_fin', label: 'CFO/Finance', points: 10 },
      { value: 'coo_vp_ops', label: 'COO/VP Operations', points: 15 },
      { value: 'ctp_vp_tech', label: 'CTO/VP Technology', points: 10 },
      { value: 'dep_heads', label: 'Department heads', points: 5 },
      { value: 'not_sure', label: 'Not sure yet', points: 0 },
    ],
  },
  {
    id: 'assessment_q7_response',
    question: 'What\'s your timeline for implementing operational improvements?',
    type: 'single',
    required: true,
    options: [
      { value: 'evaluating', label: 'Actively evaluating solutions now (next 30 days)', points: 20 },
      { value: '90_days', label: 'Planning for Q1 2026 (next 90 days)', points: 15 },
      { value: '6_months', label: 'Planning for 2026 (next 6 months)', points: 10 },
      { value: 'more_than_6_months', label: 'Just researching for now (6+ months)', points: 5 },
      { value: 'no_timeline', label: 'No specific timeline', points: 0 },
    ],
  },
  {
    id: 'assessment_q9_response',
    question: 'What outcomes matter most for your operations?',
    type: 'multiple',
    required: true,
    options: [
      { value: 'faster_revenue', label: 'Faster revenue generation and sales cycles', points: 15 },
      { value: 'better_outcomes', label: 'Better customer outcomes and satisfaction', points: 15 },
      { value: 'smarter_agents', label: 'Smarter agents that learn and improve over time', points: 15 },
      { value: 'ability_to_scale', label: 'Ability to scale without adding headcount', points: 15 },
      { value: 'reduced_cost', label: 'Reduced operational costs', points: 10 },
      { value: 'faster_response', label: 'Faster response times to customers', points: 10 },
      { value: 'consistent_service', label: 'More consistent service quality', points: 10 },
      { value: 'improved_accuracy', label: 'Improved accuracy and fewer errors', points: 10 },
    ],
  },
  // Contact info questions at the end
  {
    id: 'firstname',
    question: 'First Name',
    type: 'text',
    required: true,
    placeholder: 'John'
  },
  {
    id: 'lastname',
    question: 'Last Name',
    type: 'text',
    required: true,
    placeholder: 'Doe'
  },
  {
    id: 'email',
    question: 'Work Email',
    type: 'email',
    required: true,
    placeholder: 'john@company.com'
  },
  {
    id: 'company',
    question: 'Company Name',
    type: 'text',
    required: true,
    placeholder: 'Acme Inc.'
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
    return answer !== undefined && answer !== '' && answer !== null;
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

    // Calculate score based on points
    let totalScore = 0;
    let maxScore = 0;

    questions.forEach(q => {
      if (q.options) {
        const answer = answers[q.id];
        
        if (q.type === 'multiple' && Array.isArray(answer)) {
          // For multiple choice, add points for each selected option
          answer.forEach(val => {
            const option = q.options?.find(opt => opt.value === val);
            if (option?.points) {
              totalScore += option.points;
            }
          });
          // Max score is sum of all option points
          const allPoints = q.options.reduce((sum, opt) => sum + (opt.points || 0), 0);
          maxScore += allPoints;
        } else if (q.type === 'single') {
          // For single choice, add points for the selected option
          const option = q.options.find(opt => opt.value === answer);
          if (option?.points) {
            totalScore += option.points;
          }
          // Max score is the highest point value
          const maxOptionPoints = Math.max(...q.options.map(opt => opt.points || 0));
          maxScore += maxOptionPoints;
        }
      }
    });

    // Convert to 0-100 scale
    const normalizedScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
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

  // Show context before contact questions
  const isContactStep = currentStep >= questions.length - 4 && currentStep < questions.length - 1;
  const isLastContactStep = currentStep === questions.length - 1;

  // Results Screen
  if (showResults) {
    const bandConfig = assessmentConfig.scoreBands[scoreBand];
    const userEmail = answers.email || '';

    return (
      <div className="w-full space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Score Card */}
        <Card className="w-full border-2 rx-border-slate relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="rx-animated-gradient w-full h-full"></div>
          </div>
          <CardHeader className="text-center pb-4 sm:pb-6 relative z-10">
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
                {scoreBand === 'hot' && "Excellent! You're ready for smarter AI agents that deliver better outcomes and faster revenue. Our full assessment will identify exactly where we can build, tune, and maintain AI solutions for your operations."}
                {scoreBand === 'high' && "Great readiness level! You have solid foundations for implementing smarter AI agents. Our full assessment will show you how to achieve better outcomes and faster revenue with AI that we build, tune, and maintain."}
                {scoreBand === 'medium' && "Good start! You're building your foundation. Focus on addressing key gaps, then consider our full assessment to discover how smarter AI agents can improve outcomes and accelerate revenue."}
                {scoreBand === 'low' && "Early stage exploration. Build your foundation first, then explore how ReshapeX can help you implement smarter AI agents that deliver better outcomes and faster revenue."}
              </p>
            </div>

            {userEmail && (
              <div className="text-center p-3 sm:p-4 rounded-lg rx-bg-deep-space border rx-border-slate">
                <p className="text-xs sm:text-sm rx-text-steel">
                  📧 {getResultEmailLine(userEmail)}
                </p>
              </div>
            )}

            {/* CTA Based on Score Band */}
            <div className="space-y-4 pt-2 sm:pt-4">
              {scoreBand === 'hot' && (
                <div className="space-y-3">
                  <p className="text-center rx-text-steel font-semibold text-sm sm:text-base">🔥 You qualify for our Full Assessment</p>
                  <Button
                    className="w-full text-base sm:text-lg py-5 sm:py-6 rx-btn-primary font-bold min-h-[48px] sm:min-h-[56px]"
                    onClick={() => window.open(assessmentConfig.calendly.hotLeadUrl, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Book Your Full Assessment
                  </Button>
                  <p className="text-xs sm:text-sm text-center rx-text-steel">
                    Discover how we build, tune, and maintain smarter AI agents that deliver better outcomes and faster revenue
                  </p>
                </div>
              )}

              {scoreBand === 'high' && (
                <div className="space-y-3">
                  <p className="text-center rx-text-steel font-semibold text-sm sm:text-base">Let's explore how smarter agents can improve your outcomes</p>
                  <Button
                    className="w-full text-base sm:text-lg py-5 sm:py-6 rx-btn-primary font-bold min-h-[48px] sm:min-h-[56px]"
                    onClick={() => window.open(assessmentConfig.calendly.highLeadUrl, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Schedule a Discovery Call
                  </Button>
                  <p className="text-xs sm:text-sm text-center rx-text-steel">
                    Learn how we build, tune, and maintain AI agents tailored to your operations
                  </p>
                </div>
              )}

              {(scoreBand === 'medium' || scoreBand === 'low') && (
                <div className="space-y-3">
                  <p className="text-center rx-text-steel font-semibold text-sm sm:text-base">Build your foundation first</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="py-5 sm:py-6 min-h-[48px] sm:min-h-[56px] rx-btn-secondary border-rx-border-slate rx-text-steel hover:border-[#73B400] hover:text-white"
                      onClick={() => window.open(assessmentConfig.resources.foundationalResourcesPage, '_blank')}
                    >
                      <BookOpen className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Access Resources
                    </Button>
                    <Button
                      variant="outline"
                      className="py-5 sm:py-6 min-h-[48px] sm:min-h-[56px] rx-btn-secondary border-rx-border-slate rx-text-steel hover:border-[#73B400] hover:text-white"
                      onClick={() => window.open(assessmentConfig.events.webinarRegistrationUrl, '_blank')}
                    >
                      <Video className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Join Webinar
                    </Button>
                  </div>
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
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl font-bold mb-6">
              <span className="rx-gradient-text rx-gc-green-blue">What's Next?</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div className="space-y-3 rx-text-steel">
              <p className="flex items-start gap-3 text-sm sm:text-base">
                <span className="rx-text-green font-bold flex-shrink-0">1.</span>
                <span>Our team will review your assessment within {bandConfig.sla}</span>
              </p>
              <p className="flex items-start gap-3 text-sm sm:text-base">
                <span className="rx-text-blue font-bold flex-shrink-0">2.</span>
                <span>You'll receive personalized recommendations showing where smarter AI agents can deliver better outcomes and faster revenue</span>
              </p>
              <p className="flex items-start gap-3 text-sm sm:text-base">
                <span className="rx-text-green font-bold flex-shrink-0">3.</span>
                <span>
                  {scoreBand === 'hot' || scoreBand === 'high' 
                    ? "We'll reach out to schedule a full assessment where we'll identify how to build, tune, and maintain AI agents for your operations"
                    : "You'll get access to resources about building smarter AI agents that improve outcomes and accelerate revenue"}
                </span>
              </p>
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
          <CardTitle id={`question-${currentStep}`} className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight mb-4">
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
              placeholder={currentQuestion.placeholder}
              className="text-sm sm:text-base p-3 sm:p-4 rx-bg-deep-space text-white border-2 rx-border-slate focus:border-[#73B400] focus:ring-2 focus:ring-[rgba(115,180,0,0.2)] transition-all"
            />
          )}

          {/* Textarea */}
          {currentQuestion.type === 'textarea' && (
            <Textarea
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder={currentQuestion.placeholder}
              rows={4}
              className="text-sm sm:text-base p-3 sm:p-4 rx-bg-deep-space text-white border-2 rx-border-slate focus:border-[#73B400] focus:ring-2 focus:ring-[rgba(115,180,0,0.2)] transition-all resize-none"
            />
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
                <h3 className="text-base sm:text-lg font-bold text-white mb-1">Almost done!</h3>
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

