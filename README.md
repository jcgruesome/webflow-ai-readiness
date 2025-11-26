# ReshapeX AI Readiness Assessment

> A 2-minute diagnostic assessment that helps companies evaluate their AI automation readiness and qualify leads for full infrastructure assessments.

[![Status](https://img.shields.io/badge/status-ready_for_deployment-green)]()
[![Score](https://img.shields.io/badge/scoring-0--100_scale-blue)]()
[![Bands](https://img.shields.io/badge/bands-4_lead_tiers-orange)]()

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Architecture](#architecture)
- [Scoring System](#scoring-system)
- [Lead Routing](#lead-routing)
- [Development](#development)
- [Deployment](#deployment)
- [Support](#support)

---

## Overview

The AI Readiness Assessment is a conversion-focused diagnostic tool that:

1. **Qualifies leads** through 12 targeted questions
2. **Calculates readiness scores** on a 0-100 scale
3. **Routes leads automatically** to appropriate follow-up paths
4. **Integrates with HubSpot** for automated lead management
5. **Personalizes next steps** based on readiness level

**Purpose**: Frame this as a first step diagnostic that leads to booking a full 30-45 minute assessment with the ReshapeX team.

**Target Audience**: VP Operations, CTOs, Directors — decision-makers at companies evaluating AI automation.

---

## Features

### 🎯 Assessment Flow

- **12 Qualification Questions**
  - Company & contact information
  - Operational challenges
  - Current automation state
  - Technology stack
  - Budget & timeline
  - Biggest pain point

- **Smart Question Logic**
  - Conditional questions (automation details only if relevant)
  - "Other" option with text input
  - Progress tracking
  - Forward/backward navigation

- **0-100 Scoring Algorithm**
  - Weighted responses
  - Measurable pain point detection
  - High-value problem identification
  - Normalized to 100-point scale

### 🎨 User Experience

- ✅ Under 3 minutes to complete
- ✅ Mobile-responsive design
- ✅ Real-time validation
- ✅ Smooth animations
- ✅ Progress indicators
- ✅ Instant results

### 🔗 HubSpot Integration

- **Automatic Contact Creation**
  - All 14 custom properties populated
  - Corporate email validation
  - Company association
  - Timestamp tracking

- **Automated Workflows**
  - Score band assignment
  - Hot lead auto-assignment (Chris Ross)
  - SDR task creation
  - Nurture sequence enrollment

- **Lead Routing**
  - Hot (80-100): 24-hour SLA
  - High (60-79): 3-day SLA
  - Medium (40-59): Automated nurture
  - Low (0-39): 90-day re-engagement

### 📊 4-Band System

| Band | Score | Action | SLA |
|------|-------|--------|-----|
| 🔴 **Hot** | 80-100 | Auto-assign to Chris Ross* | 24 hours |
| 🟠 **High** | 60-79 | SDR task + case study | 3 days |
| 🟡 **Medium** | 40-59 | Checklist + webinar invite | Nurture |
| ⚪ **Low** | 0-39 | Foundational resources | 90 days |

*Auto-assignment requires secondary signal (company size >49 OR budget >$50k OR timeline <3mo)

---

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env` file:

```env
HUBSPOT_ACCESS_TOKEN=your_token_here
```

### 3. Update Configuration

Edit `src/lib/assessment-config.ts`:

```typescript
export const assessmentConfig = {
  calendly: {
    hotLeadUrl: 'https://calendly.com/your-link', // ← UPDATE
    highLeadUrl: 'https://calendly.com/your-link', // ← UPDATE
  },
  resources: {
    caseStudyPdf: 'https://your-site.com/case-study.pdf', // ← UPDATE
    budgetChecklistPdf: 'https://your-site.com/checklist.pdf', // ← UPDATE
    foundationalResourcesPage: 'https://your-site.com/resources', // ← UPDATE
  },
  events: {
    webinarRegistrationUrl: 'https://your-site.com/webinar', // ← UPDATE
  },
  // ...
};
```

### 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:4321

### 5. Set Up HubSpot

Create 14 custom contact properties (see `HUBSPOT_SETUP.md`)

---

## Documentation

### Core Guides

| Document | Purpose |
|----------|---------|
| **[QUICK_START.md](QUICK_START.md)** | Get up and running in 3 steps |
| **[HUBSPOT_SETUP.md](HUBSPOT_SETUP.md)** | Complete HubSpot configuration guide |
| **[TESTING_GUIDE.md](TESTING_GUIDE.md)** | Test scenarios and validation checklist |
| **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** | Production deployment steps |

### Reference Docs

| Document | Purpose |
|----------|---------|
| **[BUILD_GUIDE_IMPLEMENTATION.md](BUILD_GUIDE_IMPLEMENTATION.md)** | Implementation summary |
| **[ASSESSMENT_FLOW.md](ASSESSMENT_FLOW.md)** | Complete user journey & flow |
| **[PRE_LAUNCH_CHECKLIST.md](PRE_LAUNCH_CHECKLIST.md)** | Pre-launch verification |

---

## Architecture

### Tech Stack

- **Framework**: Astro 5.x
- **UI Library**: React 19 + shadcn/ui
- **Styling**: Tailwind CSS 4.x
- **Deployment**: Cloudflare Workers
- **CRM**: HubSpot (API integration)
- **Type Safety**: TypeScript

### Project Structure

```
src/
├── components/
│   ├── AssessmentQuiz.tsx      # Main assessment component
│   └── ui/                     # shadcn/ui components
├── pages/
│   ├── index.astro             # Landing page
│   └── api/
│       └── hubspot/
│           └── submit.ts       # HubSpot integration API
├── lib/
│   ├── assessment-config.ts    # Centralized configuration
│   ├── base-url.ts             # Base URL helper
│   └── utils.ts                # Utility functions
├── layouts/
│   └── main.astro              # Main layout
└── styles/
    └── global.css              # Global styles

generated/
├── webflow.css                 # Webflow design system
└── fonts.css                   # Font imports
```

### Data Flow

```
User Completes Assessment
    ↓
Calculate Score (0-100)
    ↓
POST to /api/hubspot/submit
    ↓
Create/Update Contact + Company
    ↓
Assign Score Band (Low/Med/High/Hot)
    ↓
Trigger Automated Workflows
    ↓
Route to Appropriate Follow-up
    ↓
Display Personalized Results
```

---

## Scoring System

### Point Allocation

| Factor | Points |
|--------|--------|
| Company >49 employees | +10 |
| Revenue >$10M | +10 |
| High-value pain point | +15 |
| Has automation | +5 to +10 |
| ERP or CRM | +10 |
| Budget $50k-$150k | +10 |
| Budget >$150k | +20 |
| Timeline: now/0-3mo | +15 |
| Timeline: 3-6mo | +10 |
| Measurable pain | +10 |

**Max Score**: 100 (normalized)

### High-Value Pain Points

These score +15 points (vs. +5-10 for others):
- Slow quoting/pricing processes
- Manual order processing
- Customer support backlog
- Repetitive data entry

### Measurable Terms Bonus

If the open-ended pain description contains these terms: **+10 points**

> hours, days, weeks, cost, revenue, delay, backlog, manual, slow, time, money, staff, employees, process

---

## Lead Routing

### Hot Leads (80-100)

**Auto-Assignment Criteria**:
```
Score >= 80 AND (
  company_size >= "50-199" OR
  budget >= "50k-150k" OR
  timeline <= "0-3mo"
)
→ Assign to Chris Ross
```

**Otherwise**: Route to SDR review queue

**Actions**:
- Send automated email with Calendly link
- Create task: "Contact within 24 hours"
- Add tag: `Assess:Hot`

**Result Page CTA**:
- [Book Full Assessment] → 30-45 min discovery call

---

### High Leads (60-79)

**Actions**:
- Create SDR task (3-day due date)
- Send case study + booking link
- Add to high-priority nurture
- Add tag: `Assess:High`

**Result Page CTAs**:
- [Book Discovery Call] → Discovery call
- [Download Case Study] → Case study PDF

---

### Medium Leads (40-59)

**Actions**:
- Send Budget Planning Checklist
- Invite to webinar
- Add to marketing nurture (30-day cycle)
- Add tag: `Assess:Medium`

**Result Page CTAs**:
- [Download Budget Checklist] → PDF download
- [Join Our Webinar] → Webinar registration

---

### Low Leads (0-39)

**Actions**:
- Send foundational resources
- Add to long-term nurture (90-day cycle)
- Add tag: `Assess:Low`

**Result Page CTA**:
- [Access Foundational Resources] → Resource hub

---

## Development

### Commands

```bash
# Development
npm run dev              # Start dev server (localhost:4321)
npm run build            # Build for production
npm run preview          # Preview production build

# Type Checking
npx astro check          # Check TypeScript types

# Deployment
npm run deploy           # Deploy to Cloudflare Workers
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `HUBSPOT_ACCESS_TOKEN` | Yes | HubSpot Private App token |
| `WEBFLOW_API_HOST` | No | Webflow API host (auto-set in prod) |

### Configuration

All external links and settings are in:

**`src/lib/assessment-config.ts`**

Update this file before deployment to set:
- Calendly URLs
- Resource download links
- Webinar registration URL
- Logo path
- Company branding

---

## Deployment

### Pre-Deployment Checklist

- [ ] Updated `src/lib/assessment-config.ts` with production links
- [ ] Created all 14 HubSpot custom properties
- [ ] Set up 4 automated workflows in HubSpot
- [ ] Created email templates
- [ ] Added actual logo to `/public/logo.svg`
- [ ] Rotated HubSpot access token (if exposed)
- [ ] Completed 50+ test submissions
- [ ] Tested all 4 score bands
- [ ] Briefed team on follow-up process

### Deploy to Production

```bash
# Build
npm run build

# Set environment variables in Cloudflare Workers dashboard
# Then deploy
npm run deploy
```

### Post-Deployment

1. Submit test assessment in production
2. Verify HubSpot contact created
3. Verify workflows triggered
4. Check all links work
5. Test on mobile devices

See **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** for complete instructions.

---

## Support

### Common Issues

**Submissions not reaching HubSpot**
→ Check token, verify custom properties exist, review API logs

**Workflows not triggering**
→ Ensure workflows are "On", check enrollment criteria

**Wrong score calculation**
→ Review scoring logic, check measurable terms detection

**Hot leads not assigning**
→ Verify secondary signal criteria, check Chris Ross user exists

See **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** for detailed troubleshooting.

### Documentation

- **Setup**: [QUICK_START.md](QUICK_START.md)
- **HubSpot**: [HUBSPOT_SETUP.md](HUBSPOT_SETUP.md)
- **Testing**: [TESTING_GUIDE.md](TESTING_GUIDE.md)
- **Deployment**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Flow Details**: [ASSESSMENT_FLOW.md](ASSESSMENT_FLOW.md)

### Contact

- **Technical**: [Your Dev Team]
- **HubSpot**: [HubSpot Admin]
- **Business**: Chris Ross (chris@reshapex.com)

---

## Key Metrics

### Target KPIs

| Metric | Target | Status |
|--------|--------|--------|
| Completion Rate | >70% | 📊 TBD |
| Corporate Email % | >60% | 📊 TBD |
| Hot Lead 24h SLA | >90% | 📊 TBD |
| High Lead 3d SLA | >85% | 📊 TBD |
| MQL Rate (60+) | >40% | 📊 TBD |
| Hot Lead Booking | >25% | 📊 TBD |

### Success Criteria

**Week 1**
- 50+ submissions
- All systems operational
- Team trained

**Month 1**
- 200+ submissions
- 40% MQL rate
- Documented optimizations

**Month 3**
- Consistent lead flow
- Optimized scoring
- Strong conversion rates

---

## Changelog

### [1.0.0] - 2024-11-21

**Added**
- Initial implementation matching Week 1 Build Guide
- 12-question assessment flow
- 0-100 normalized scoring system
- 4-band lead routing (Hot/High/Medium/Low)
- HubSpot integration with auto-assignment
- Corporate email validation
- Conditional question logic
- Mobile-responsive design
- Complete documentation suite

**Features**
- Secondary signal check for Hot lead assignment
- Measurable terms detection for bonus points
- Real-time progress tracking
- Personalized result pages
- Automated workflow triggers
- Company association in HubSpot

---

## License

© 2024 ReshapeX. All rights reserved.

---

## Next Steps

1. **Read**: [QUICK_START.md](QUICK_START.md) to get up and running
2. **Configure**: Update `src/lib/assessment-config.ts` with your links
3. **Test**: Follow [TESTING_GUIDE.md](TESTING_GUIDE.md)
4. **Deploy**: Use [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
5. **Monitor**: Track metrics and optimize

**Ready to launch?** 🚀

Start with `QUICK_START.md` and work through the documentation in order.
# ai-readiness-assessment
# webflow-ai-readiness
# webflow-ai-readiness
# webflow-ai-readiness
# webflow-ai-readiness
