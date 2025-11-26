# HubSpot Properties Mapping

This document details the mapping between the AI Readiness Assessment questions and HubSpot contact properties in the "AI Readiness Assessment" group.

## Properties Retrieved from HubSpot

All properties are in the **"AI Readiness Assessment"** group in HubSpot.

### Assessment Question Properties

| Question | HubSpot Property Name | Type | Field Type |
|----------|----------------------|------|------------|
| What best describes your company's operations? | `assessment_q1_response` | enumeration | checkbox |
| What's your current process for handling complex customer requests? | `assessment_automation_level` | enumeration | radio |
| Which of these operational challenges do you face? | `assessment_q3_response` | enumeration | checkbox |
| How much time does your team spend on repetitive, manual tasks each week? | `assessment_manual_task_hours` | enumeration | radio |
| What systems does your company currently use? | `assessment_systems_used` | enumeration | checkbox |
| Who would be involved in evaluating an AI automation solution at your company? | `assessment_decision_makers` | enumeration | checkbox |
| What's your timeline for implementing operational improvements? | `assessment_q7_response` | enumeration | radio |
| What would successful AI automation look like for your company? | `assessment_q9_response` | enumeration | checkbox |

### Score & Metadata Properties

| Property | HubSpot Property Name | Type | Field Type |
|----------|----------------------|------|------------|
| AI Readiness Score | `ai_readiness_score` | number | number |
| Assessment Completed Date | `assessment_completed_date` | date | date |
| AE Hot Flag | `ae_hot_flag` | enumeration | checkbox |

### Contact Information Properties (Standard HubSpot)

| Property | HubSpot Property Name | Type |
|----------|----------------------|------|
| First Name | `firstname` | text |
| Last Name | `lastname` | text |
| Email | `email` | email |
| Company | `company` | text |

## Question Details with Options

### Q1: What best describes your company's operations?
**Property:** `assessment_q1_response` (checkbox - multiple select)

- `complex_sales` - We handle complex technical sales or custom quotes (15 pts)
- `high_volume_support` - We manage high-volume customer inquiries or support (15 pts)
- `rfps_proposals_contracts` - We process RFPs, proposals, or contracts regularly (15 pts)
- `multi_step_projects_or_services` - We coordinate multi-step projects or service delivery (10 pts)
- `tech_docs_or_kbs` - We manage technical documentation or knowledge bases (10 pts)
- `other` - Other (5 pts)

### Q2: What's your current process for handling complex customer requests?
**Property:** `assessment_automation_level` (radio - single select)

- `fully_manual` - Fully manual (email, phone, documents) (0 pts)
- `mostly_manual` - Some tools, but lots of manual steps (5 pts)
- `semi_automated` - Semi-automated with workflows (10 pts)
- `mostly_automated` - Mostly automated but not AI-powered (15 pts)
- `fully_automated` - Already using AI/automation extensively (20 pts)

### Q3: Which of these operational challenges do you face?
**Property:** `assessment_q3_response` (checkbox - multiple select)

- `slow_response` - Slow response times to customer inquiries (10 pts)
- `inconsistent_answers` - Inconsistent answers across team members (10 pts)
- `slow_info` - Difficulty accessing the right information quickly (10 pts)
- `manual_data_entry` - Manual data entry and system updates (10 pts)
- `complex_pricing` - Complex pricing or configuration processes (15 pts)
- `handoff_delays` - Handoff delays between teams (10 pts)
- `slow_onboarding` - Training new team members takes too long (5 pts)
- `difficulty_scaling` - Difficulty scaling operations without adding headcount (15 pts)

### Q4: How much time does your team spend on repetitive, manual tasks each week?
**Property:** `assessment_manual_task_hours` (radio - single select)

- `5_less_hours` - Less than 5 hours per person (0 pts)
- `5_10_hours` - 5-10 hours per person (5 pts)
- `10_20_hours` - 10-20 hours per person (10 pts)
- `20_plus_hours` - More than 20 hours per person (20 pts)
- `not_sure` - Not sure (0 pts)

### Q5: What systems does your company currently use?
**Property:** `assessment_systems_used` (checkbox - multiple select)

- `crm` - CRM (Salesforce, HubSpot, etc.) (10 pts)
- `erp` - ERP (SAP, Oracle, NetSuite, etc.) (10 pts)
- `project_management` - Project Management (Asana, Monday, Jira, etc.) (5 pts)
- `support_ticketing` - Support/Ticketing (Zendesk, Intercom, etc.) (5 pts)
- `custom_databases` - Custom databases or systems (5 pts)
- `spreadsheets_docs` - Mostly spreadsheets and documents (0 pts)
- `other` - Other (0 pts)

### Q6: Who would be involved in evaluating an AI automation solution?
**Property:** `assessment_decision_makers` (checkbox - multiple select)

- `primary` - I'm the primary decision maker (20 pts)
- `ceo_pres` - CEO/President (15 pts)
- `cfa_fin` - CFO/Finance (10 pts)
- `coo_vp_ops` - COO/VP Operations (15 pts)
- `ctp_vp_tech` - CTO/VP Technology (10 pts)
- `dep_heads` - Department heads (5 pts)
- `not_sure` - Not sure yet (0 pts)

### Q7: What's your timeline for implementing operational improvements?
**Property:** `assessment_q7_response` (radio - single select)

- `evaluating` - Actively evaluating solutions now (next 30 days) (20 pts)
- `90_days` - Planning for Q1 2026 (next 90 days) (15 pts)
- `6_months` - Planning for 2026 (next 6 months) (10 pts)
- `more_than_6_months` - Just researching for now (6+ months) (5 pts)
- `no_timeline` - No specific timeline (0 pts)

### Q8: What would successful AI automation look like for your company?
**Property:** `assessment_q9_response` (checkbox - multiple select)

- `faster_response` - Faster response times to customers (10 pts)
- `consistent_service` - More consistent service quality (10 pts)
- `ability_to_scale` - Ability to scale without adding headcount (15 pts)
- `reduced_cost` - Reduced operational costs (15 pts)
- `better_use_of_time` - Better use of existing team's time (10 pts)
- `improved_accuracy` - Improved accuracy and fewer errors (10 pts)
- `24_7_availability` - 24/7 availability (5 pts)
- `comp_advantage` - Competitive advantage (10 pts)

## Scoring System

### Point Calculation
- Questions with multiple-choice checkboxes: Sum all selected option points
- Questions with single-choice radio: Add the selected option's points
- Maximum possible score: Sum of all possible points from all options
- Normalized score: `(totalPoints / maxPossiblePoints) * 100`

### Score Bands

| Band | Score Range | Tag | Action |
|------|-------------|-----|--------|
| Hot | 80-100 | Assess:Hot | Auto-set `ae_hot_flag` = true, 24hr SLA |
| High | 60-79 | Assess:High | Schedule discovery call, 3-day SLA |
| Medium | 40-59 | Assess:Medium | Automated nurture sequence |
| Low | 0-39 | Assess:Low | 90-day educational nurture |

## Data Flow

1. User completes assessment questions
2. Frontend calculates normalized score (0-100)
3. Submit to `/api/hubspot/submit` with answers + score
4. Backend maps answers to HubSpot property names
5. Search for existing contact by email
6. Create or update contact with all properties
7. Set `ae_hot_flag` if score >= 80
8. Create/associate company if company name provided
9. Return success response

## Testing

To test the integration:

```bash
# Run the dev server
npm run dev

# Complete the assessment at http://localhost:4321

# Check HubSpot contact properties after submission
```

## Notes

- All checkbox fields accept arrays of values (e.g., `["crm", "erp"]`)
- All radio fields accept single string values (e.g., `"evaluating"`)
- The `ae_hot_flag` is automatically set to `"true"` when score >= 80
- Contact properties are created/updated atomically
- Company association is best-effort (won't fail the submission if it errors)
