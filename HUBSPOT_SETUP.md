# HubSpot Integration Setup - ReshapeX AI Readiness Assessment

This assessment integrates with HubSpot to automatically submit responses and route leads based on readiness scores.

## Quick Setup

### 1. Add HubSpot Token to Environment Variables

Add the following line to your `.env` file:

```bash
HUBSPOT_ACCESS_TOKEN=your_private_app_token_here
```

**Security Note**: Never commit your actual token to version control. This value should remain private and only be stored in:
- Local development: `.env` file (already in `.gitignore`)
- Production: Cloudflare Workers environment variables

**How to get your token**:
1. Go to HubSpot → Settings → Integrations → Private Apps
2. Create a new private app or use an existing one
3. Copy the access token (starts with `pat-na1-`)
4. Add it to your `.env` file

### 2. Create Custom Properties in HubSpot

Create the following custom **Contact Properties**:

1. **company_name** (Single-line text)
2. **company_size** (Dropdown)
   - Options: 1-49 / 50-199 / 200-499 / 500+
3. **annual_revenue** (Dropdown)
   - Options: <$10M / $10-50M / $50-200M / $200-500M / >$500M
4. **role_title** (Single-line text)
5. **primary_pain** (Multi-line text)
   - Stores comma-separated list of pain points
6. **existing_automation** (Multi-line text)
   - Stores yes/no + details if applicable
7. **tech_stack** (Multi-line text)
   - Stores semicolon-separated list of systems
8. **estimated_ai_budget_2026** (Dropdown)
   - Options: None / <25k / 25k-50k / 50k-150k / >150k
9. **decision_timeline** (Dropdown)
   - Options: Now / 0-3 months / 3-6 months / 6-12 months / No budget
10. **open_ended_pain** (Multi-line text)
11. **readiness_score** (Number)
    - Range: 0-100
12. **assess_band** (Dropdown)
    - Options: Low / Medium / High / Hot
13. **assessment_form_completed_at** (Date picker)
14. **is_corporate_email** (Dropdown)
    - Options: Yes / No

### 3. HubSpot Private App Permissions

Your private app needs the following scopes:
- `crm.objects.contacts.read`
- `crm.objects.contacts.write`
- `crm.objects.companies.read`
- `crm.objects.companies.write`

## How It Works

### Assessment Flow

1. **User Completes 12 Questions** covering:
   - Company details (name, size, revenue)
   - Contact info (email, role)
   - Operational challenges and pain points
   - Current automation state
   - Technology stack
   - Budget and timeline
   - Biggest automation challenge
   - Consent

2. **Score Calculation** (0-100 scale)
   - Company size >49: +10 points
   - Annual revenue >$10M: +10 points
   - High-value pain points (quoting, orders, support): +15 points
   - Existing automation: +5 to +10 points
   - Tech stack (ERP/CRM): +10 points
   - Budget $50k-$150k: +10 points, >$150k: +20 points
   - Timeline (now/0-3mo): +15 points, 3-6mo: +10 points
   - Measurable pain description: +10 points

3. **Band Assignment**
   - **0-39**: Low
   - **40-59**: Medium
   - **60-79**: High
   - **80-100**: Hot

4. **Automatic Routing**
   - **Hot (80-100)**: Auto-assign to Chris Ross IF secondary signal present:
     - Company size >49 employees OR
     - Budget >$50k OR
     - Timeline <3 months
   - **High (60-79)**: Create SDR task, send case study + booking link
   - **Medium (40-59)**: Add to nurture, send budget checklist + webinar
   - **Low (0-39)**: Add to nurture sequence, send foundational resources

## Score Bands & Actions

### Hot (80-100)
**HubSpot Tag**: `Assess:Hot`

**Actions**:
- Auto-assign to Chris Ross (if secondary signal present)
- Otherwise, route to SDR review queue
- Send automated email with discovery booking link
- SLA: Contact within 24 hours

**Result Page CTA**:
- Book 30-45 minute Full Assessment (Calendly link)

**Email Template**:
```
Subject: Quick follow-up on your AI Readiness Score

Hi {firstName},

Thanks for completing the assessment. Your score: {readiness_score} (High). 

We recommend a short full assessment to validate systems and build a 
prioritized implementation plan. 

Book a 30-minute discovery: {CalendlyLink}

If you prefer, reply and Chris Ross (chris@reshapex.com) will reach out.

Best,
ReshapeX Team
```

### High (60-79)
**HubSpot Tag**: `Assess:High`

**Actions**:
- Create SDR task (reach out within 3 business days)
- Send case study + booking link
- Add to high-priority nurture

**Result Page CTA**:
- Book Discovery Call
- Download Case Study

**Email Template**:
```
Subject: Ready to validate your AI opportunities?

Hi {firstName},

Your assessment shows strong potential. Here's a short case study and a 
link to book a discovery: {CalendlyLink}

Best,
ReshapeX Team
```

### Medium (40-59)
**HubSpot Tag**: `Assess:Medium`

**Actions**:
- Send Budget Planning Checklist
- Invite to webinar
- Add to marketing nurture

**Result Page CTA**:
- Download Budget Checklist
- Join Webinar

**Email Template**:
```
Subject: Budget checklist & next steps

Hi {firstName},

Thanks for completing the assessment. 

Download our Budget Planning Checklist: {ChecklistLink}
Join our upcoming webinar on AI budget planning: {WebinarLink}

Best,
ReshapeX Team
```

### Low (0-39)
**HubSpot Tag**: `Assess:Low`

**Actions**:
- Add to long-term nurture
- Send foundational resources
- Re-engage in 90 days

**Result Page CTA**:
- Access Foundational Resources

**Email Template**:
```
Subject: Thanks — here are some resources to get started

Hi {firstName},

Thanks for completing the assessment. Here are a few resources to help 
you get started: {ResourceLinks}

We'll check in again in 90 days.

Best,
ReshapeX Team
```

## Anti-Fraud & Quality Controls

The system automatically flags:

1. **Free Email Domains**
   - Gmail, Yahoo, Hotmail, Outlook, AOL
   - Flagged in `is_corporate_email` property as "No"
   - Requires manual review

2. **Low-Quality Submissions**
   - Missing `open_ended_pain` response
   - Completion time <10 seconds (implement via Typeform/workflow)

## HubSpot Workflows to Create

### 1. Score Band Workflow
```
Trigger: Contact property "readiness_score" is known
Actions:
- If score 0-39: Set assess_band = "Low", add tag "Assess:Low"
- If score 40-59: Set assess_band = "Medium", add tag "Assess:Medium"
- If score 60-79: Set assess_band = "High", add tag "Assess:High"
- If score 80-100: Set assess_band = "Hot", add tag "Assess:Hot"
```

### 2. Hot Lead Assignment Workflow
```
Trigger: assess_band = "Hot"
Conditions: 
- company_size ≠ "1-49" OR
- estimated_ai_budget_2026 IN ["50k-150k", ">150k"] OR
- decision_timeline IN ["now", "0-3mo"]
Actions:
- Assign to Chris Ross
- Send internal notification
- Create task: "Contact Hot lead within 24h"
```

### 3. High Lead SDR Task Workflow
```
Trigger: assess_band = "High"
Actions:
- Create task for SDR team
- Set due date: 3 business days
- Send email: case study + booking link
```

### 4. Medium/Low Nurture Workflows
```
Trigger: assess_band IN ["Medium", "Low"]
Actions:
- Add to appropriate nurture list
- Send relevant resources
- Set re-engagement reminder (Medium: 30 days, Low: 90 days)
```

## Follow-up SLAs

### Hot Leads
- **Target**: Contact within 24 hours
- **Goal**: ≥90% compliance
- **Owner**: Chris Ross (if secondary signal) or SDR team

### High Leads
- **Target**: Initial outreach within 3 business days
- **Goal**: ≥85% compliance
- **Owner**: SDR team

### Medium/Low Leads
- **Target**: Automated nurture sequence
- **Manual Review**: Monthly

## SDR Checklist for Hot Leads

When following up on Hot leads:

1. ✅ Confirm contact details are valid
2. ✅ Quick LinkedIn check (verify role/company)
3. ✅ Review tech stack from submission
4. ✅ Confirm decision timeline is accurate
5. ✅ Note specific pain points mentioned
6. ✅ Schedule discovery call if still qualified
7. ✅ Update HubSpot with call notes

## Reporting & Tracking

Create dashboard cards for:

1. **Assessment Metrics**
   - Completion rate
   - Average time to complete
   - Drop-off points

2. **Score Distribution**
   - Breakdown by band (Low/Medium/High/Hot)
   - Average score by week/month

3. **Conversion Metrics**
   - Assessment → MQL rate
   - Assessment → SQL rate
   - Assessment → Booking rate

4. **Quality Metrics**
   - Corporate vs. free email ratio
   - False positive rate
   - Lead quality scores

5. **SLA Compliance**
   - Hot lead contact time (target: 24h)
   - High lead contact time (target: 3 days)
   - Response rate

6. **Channel Attribution**
   - Submissions by UTM source
   - Conversion by channel
   - Best performing channels

## Testing Checklist

Before launch:

- [ ] All custom properties created in HubSpot
- [ ] All workflows configured and tested
- [ ] Email templates created and approved
- [ ] Calendly link updated in result pages
- [ ] Download links for resources added
- [ ] Run 50 test submissions with various scenarios
- [ ] Verify score calculations are accurate
- [ ] Test all 4 band result pages
- [ ] Verify Hot lead assignment logic
- [ ] Test email delivery for all bands
- [ ] Verify company association works
- [ ] Check data quality flags work
- [ ] Review dashboard reporting

## Production Deployment

When deploying to production:

1. Add `HUBSPOT_ACCESS_TOKEN` to Cloudflare Workers environment variables:
   ```bash
   # In Cloudflare dashboard
   Workers & Pages → Your App → Settings → Environment Variables
   # Add: HUBSPOT_ACCESS_TOKEN = your_token_here
   ```

2. Update all placeholder links (Calendly, downloads, webinar)
3. Configure email sending domain
4. Set up monitoring for form submissions
5. Brief SDR team on follow-up process
6. Brief Chris Ross on Hot lead criteria
7. Schedule weekly review of lead quality

## Security Best Practices

⚠️ **Critical Security Notes**:

1. **Never commit tokens to Git**
   - The `.env` file is already in `.gitignore`
   - Never add tokens to documentation or code comments
   - Never share tokens in Slack, email, or tickets

2. **Use environment variables only**
   - Local: `.env` file
   - Production: Cloudflare Workers environment variables
   - The app automatically uses: `locals?.runtime?.env?.HUBSPOT_ACCESS_TOKEN || import.meta.env.HUBSPOT_ACCESS_TOKEN`

3. **Rotate tokens regularly**
   - Rotate every 90 days as a best practice
   - Immediately rotate if compromised

4. **Limit token scope**
   - Only grant necessary permissions (contacts & companies read/write)
   - Create separate tokens for dev/staging/production if possible

5. **Monitor token usage**
   - Review HubSpot API logs monthly
   - Set up alerts for unusual activity
