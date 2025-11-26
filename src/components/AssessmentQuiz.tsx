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
      { value: 'fully_automated', label: 'Already using AI/automation extensively', points: 20 },
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
    question: 'What would successful AI automation look like for your company?',
    type: 'multiple',
    required: true,
    options: [
      { value: 'faster_response', label: 'Faster response times to customers', points: 10 },
      { value: 'consistent_service', label: 'More consistent service quality', points: 10 },
      { value: 'ability_to_scale', label: 'Ability to scale without adding headcount', points: 15 },
      { value: 'reduced_cost', label: 'Reduced operational costs', points: 15 },
      { value: 'better_use_of_time', label: 'Better use of existing team\'s time', points: 10 },
      { value: 'improved_accuracy', label: 'Improved accuracy and fewer errors', points: 10 },
      { value: '24_7_availability', label: '24/7 availability', points: 5 },
      { value: 'comp_advantage', label: 'Competitive advantage', points: 10 },
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
  const progress = ((currentStep + 1) / totalSteps) * 100;

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

  // Results Screen
  if (showResults) {
    const bandConfig = assessmentConfig.scoreBands[scoreBand];
    const userEmail = answers.email || '';

    return (
      <div className="w-full max-w-4xl mx-auto space-y-8">
        {/* Score Card */}
        <Card className="border-2 rx-border-slate relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="rx-animated-gradient w-full h-full"></div>
          </div>
          <CardHeader className="text-center pb-4 relative z-10">
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 rounded-full rx-gradient-green-yellow flex items-center justify-center">
                <div className="w-28 h-28 rounded-full rx-bg-slate flex items-center justify-center">
                  <Award className="w-16 h-16 rx-text-green" />
                </div>
              </div>
            </div>
            <CardTitle className="text-4xl md:text-5xl font-black mb-4">
              <span className={`${bandConfig.color}`}>{score}</span>
              <span className="rx-text-steel text-3xl">/100</span>
            </CardTitle>
            <CardDescription className="text-xl md:text-2xl font-bold rx-gradient-text rx-gc-green-blue">
              {bandConfig.label}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            <div className="text-center">
              <p className="text-base md:text-lg rx-text-steel leading-relaxed">
                {scoreBand === 'hot' && "Excellent! You're in a strong position to implement AI automation. Your infrastructure, timeline, and budget align well for a successful deployment."}
                {scoreBand === 'high' && "Great readiness level! You have solid foundations in place. A few strategic improvements will position you well for AI automation success."}
                {scoreBand === 'medium' && "Good start! You're building your foundation. Focus on addressing key gaps in processes and infrastructure to maximize AI automation ROI."}
                {scoreBand === 'low' && "Early stage exploration. Focus on foundational improvements in processes, systems, and team readiness before pursuing AI automation."}
              </p>
            </div>

            {userEmail && (
              <div className="text-center p-4 rounded-lg rx-bg-deep-space border rx-border-slate">
                <p className="text-sm rx-text-steel">
                  📧 {getResultEmailLine(userEmail)}
                </p>
              </div>
            )}

            {/* CTA Based on Score Band */}
            <div className="space-y-4 pt-4">
              {scoreBand === 'hot' && (
                <div className="space-y-3">
                  <p className="text-center rx-text-steel font-semibold">🔥 You qualify for our Full Assessment</p>
                  <Button
                    className="w-full text-lg py-6 rx-gradient-green-yellow hover:opacity-90"
                    onClick={() => window.open(assessmentConfig.calendly.hotLeadUrl, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Book Your 30-Min Full Assessment
                  </Button>
                  <p className="text-xs text-center rx-text-steel">
                    Get prioritized quick wins, infrastructure validation, and a tactical plan with cost estimates
                  </p>
                </div>
              )}

              {scoreBand === 'high' && (
                <div className="space-y-3">
                  <p className="text-center rx-text-steel font-semibold">Let's explore opportunities together</p>
                  <Button
                    className="w-full text-lg py-6 rx-btn-primary"
                    onClick={() => window.open(assessmentConfig.calendly.highLeadUrl, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-5 w-5" />
                    Schedule a Discovery Call
                  </Button>
                </div>
              )}

              {(scoreBand === 'medium' || scoreBand === 'low') && (
                <div className="space-y-3">
                  <p className="text-center rx-text-steel font-semibold">Build your foundation first</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="py-6"
                      onClick={() => window.open(assessmentConfig.resources.foundationalResourcesPage, '_blank')}
                    >
                      <BookOpen className="mr-2 h-5 w-5" />
                      Access Resources
                    </Button>
                    <Button
                      variant="outline"
                      className="py-6"
                      onClick={() => window.open(assessmentConfig.events.webinarRegistrationUrl, '_blank')}
                    >
                      <Video className="mr-2 h-5 w-5" />
                      Join Webinar
                    </Button>
                  </div>
                </div>
              )}

              <Button
                variant="ghost"
                className="w-full mt-6"
                onClick={handleRetake}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Retake Assessment
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* What's Next */}
        <Card className="rx-bg-slate border rx-border-slate">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              <span className="rx-gradient-text rx-gc-green-blue">What's Next?</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 rx-text-steel">
              <p className="flex items-start gap-3">
                <span className="rx-text-green font-bold">1.</span>
                <span>Our team will review your assessment within {bandConfig.sla}</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="rx-text-blue font-bold">2.</span>
                <span>You'll receive personalized recommendations based on your responses</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="rx-text-green font-bold">3.</span>
                <span>
                  {scoreBand === 'hot' || scoreBand === 'high' 
                    ? "We'll reach out to schedule a detailed consultation"
                    : "You'll get access to resources tailored to your readiness level"}
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
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold rx-text-steel">
            Question {currentStep + 1} of {totalSteps}
          </span>
          <span className="text-sm font-semibold rx-text-green">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="w-full h-3 rx-bg-slate rounded-full overflow-hidden">
          <div 
            className="h-full rx-gradient-green-yellow transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <Card className="border-2 rx-border-slate mb-6">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-4 mb-2">
            <CardTitle className="text-xl md:text-2xl font-bold rx-text-steel leading-tight flex-1">
              {currentQuestion.question}
            </CardTitle>
            {currentQuestion.required && (
              <span className="text-sm rx-text-green font-semibold whitespace-nowrap flex-shrink-0">Required</span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Single Choice */}
          {currentQuestion.type === 'single' && (
            <RadioGroup
              value={answers[currentQuestion.id] || ''}
              onValueChange={handleAnswer}
            >
              <div className="space-y-4">
                {currentQuestion.options?.map((option) => (
                  <div 
                    key={option.value}
                    className="flex items-center space-x-4 p-4 rounded-lg border-2 rx-border-slate hover:border-[#73B400] transition-all cursor-pointer"
                    onClick={() => handleAnswer(option.value)}
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label 
                      htmlFor={option.value} 
                      className="flex-1 cursor-pointer text-base rx-text-steel font-medium"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
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
                    className="flex items-center space-x-4 p-4 rounded-lg border-2 rx-border-slate hover:border-[#73B400] transition-all cursor-pointer"
                    onClick={() => handleMultipleChoice(option.value, !isChecked)}
                  >
                    <Checkbox
                      id={option.value}
                      checked={isChecked}
                      onCheckedChange={(checked) => handleMultipleChoice(option.value, checked as boolean)}
                    />
                    <Label 
                      htmlFor={option.value}
                      className="flex-1 cursor-pointer text-base rx-text-steel font-medium"
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
              className="text-base p-4 rx-bg-deep-space rx-text-steel border-2 rx-border-slate focus:border-[#73B400]"
            />
          )}

          {/* Email Input */}
          {currentQuestion.type === 'email' && (
            <Input
              type="email"
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder={currentQuestion.placeholder}
              className="text-base p-4 rx-bg-deep-space rx-text-steel border-2 rx-border-slate focus:border-[#73B400]"
            />
          )}

          {/* Textarea */}
          {currentQuestion.type === 'textarea' && (
            <Textarea
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder={currentQuestion.placeholder}
              rows={4}
              className="text-base p-4 rx-bg-deep-space rx-text-steel border-2 rx-border-slate focus:border-[#73B400]"
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex gap-4 justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="px-8 py-6 text-base"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Previous
        </Button>

        <Button
          onClick={handleNext}
          disabled={!isCurrentAnswered() || isSubmitting}
          className="px-8 py-6 text-base rx-btn-primary"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Calculating...
            </>
          ) : currentStep === totalSteps - 1 ? (
            <>
              View Results
              <Award className="ml-2 h-5 w-5" />
            </>
          ) : (
            <>
              Next
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
