# HubSpot Properties Mapping

This document details the mapping between the AI Readiness Assessment questions and HubSpot contact properties in the "AI Readiness Assessment" group.

**Last Updated:** Wed Nov 26 2025  
**Status:** ✅ Aligned with HubSpot properties

---

## Properties Retrieved from HubSpot

All assessment properties are in the **"AI Readiness Assessment"** group in HubSpot.

### Standard Contact Properties

| Field | Question | HubSpot Property | Type |
|-------|----------|------------------|------|
| Email | Work Email | `email` | email |
| First Name | First Name | `firstname` | text |
| Last Name | Last Name | `lastname` | text |
| Company | Company Name | `company` | text |

### Assessment Question Properties

| Question # | Question | HubSpot Property | Type | Field Type |
|-----------|----------|------------------|------|------------|
| Q1 | What best describes your company's operations? | `assessment_q1_response` | enumeration | checkbox (multi-select) |
| Q2 | What's your current process for handling complex customer requests? | `assessment_automation_level` | enumeration | radio (single select) |
| Q3 | Which of these operational challenges do you face? | `assessment_q3_response` | enumeration | checkbox (multi-select) |
| Q4 | How much time does your team spend on repetitive, manual tasks each week? | `assessment_manual_task_hours` | enumeration | radio (single select) |
| Q5 | What systems does your company currently use? | `assessment_systems_used` | enumeration | checkbox (multi-select) |
| Q6 | Who would be involved in evaluating an AI automation solution? | `assessment_decision_makers` | enumeration | checkbox (multi-select) |
| Q7 | What's your timeline for implementing operational improvements? | `assessment_q7_response` | enumeration | radio (single select) |
| Q8 | What would successful AI automation look like for your company? | `assessment_q9_response` | enumeration | checkbox (multi-select) |

### Score & Metadata Properties

| Property | HubSpot Property Name | Type | Field Type |
|----------|----------------------|------|------------|
| AI Readiness Score | `ai_readiness_score` | number | number |
| Assessment Completed Date | `assessment_completed_date` | date | date |
| AE Hot Flag | `ae_hot_flag` | enumeration | checkbox |

---

## Question Details with Options

### Q1: What best describes your company's operations?
**Property:** `assessment_q1_response` (checkbox - multiple select)  
**Points:** Multiple options can be selected

- `complex_sales` - We handle complex technical sales or custom quotes (15 pts)
- `high_volume_support` - We manage high-volume customer inquiries or support (15 pts)
- `rfps_proposals_contracts` - We process RFPs, proposals, or contracts regularly (15 pts)
- `multi_step_projects_or_services` - We coordinate multi-step projects or service delivery (10 pts)
- `tech_docs_or_kbs` - We manage technical documentation or knowledge bases (10 pts)
- `other` - Other (5 pts)

**Max Points:** 70 (if all selected)

---

### Q2: What's your current process for handling complex customer requests?
**Property:** `assessment_automation_level` (radio - single select)

- `fully_manual` - Fully manual (email, phone, documents) (0 pts)
- `mostly_manual` - Some tools, but lots of manual steps (5 pts)
- `semi_automated` - Semi-automated with workflows (10 pts)
- `mostly_automated` - Mostly automated but not AI-powered (15 pts)
- `fully_automated` - Already using AI/automation extensively (20 pts)

**Max Points:** 20

---

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

**Max Points:** 85 (if all selected)

---

### Q4: How much time does your team spend on repetitive, manual tasks each week?
**Property:** `assessment_manual_task_hours` (radio - single select)

- `5_less_hours` - Less than 5 hours per person (0 pts)
- `5_10_hours` - 5-10 hours per person (5 pts)
- `10_20_hours` - 10-20 hours per person (10 pts)
- `20_plus_hours` - More than 20 hours per person (20 pts)
- `not_sure` - Not sure (0 pts)

**Max Points:** 20

---

### Q5: What systems does your company currently use?
**Property:** `assessment_systems_used` (checkbox - multiple select)

- `crm` - CRM (Salesforce, HubSpot, etc.) (10 pts)
- `erp` - ERP (SAP, Oracle, NetSuite, etc.) (10 pts)
- `project_management` - Project Management (Asana, Monday, Jira, etc.) (5 pts)
- `support_ticketing` - Support/Ticketing (Zendesk, Intercom, etc.) (5 pts)
- `custom_databases` - Custom databases or systems (5 pts)
- `spreadsheets_docs` - Mostly spreadsheets and documents (0 pts)
- `other` - Other (0 pts)

**Max Points:** 35 (if all selected)

---

### Q6: Who would be involved in evaluating an AI automation solution?
**Property:** `assessment_decision_makers` (checkbox - multiple select)

- `primary` - I'm the primary decision maker (20 pts)
- `ceo_pres` - CEO/President (15 pts)
- `cfa_fin` - CFO/Finance (10 pts)
- `coo_vp_ops` - COO/VP Operations (15 pts)
- `ctp_vp_tech` - CTO/VP Technology (10 pts)
- `dep_heads` - Department heads (5 pts)
- `not_sure` - Not sure yet (0 pts)

**Max Points:** 75 (if all selected)

---

### Q7: What's your timeline for implementing operational improvements?
**Property:** `assessment_q7_response` (radio - single select)

- `evaluating` - Actively evaluating solutions now (next 30 days) (20 pts)
- `90_days` - Planning for Q1 2026 (next 90 days) (15 pts)
- `6_months` - Planning for 2026 (next 6 months) (10 pts)
- `more_than_6_months` - Just researching for now (6+ months) (5 pts)
- `no_timeline` - No specific timeline (0 pts)

**Max Points:** 20

---

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

**Max Points:** 85 (if all selected)

---

## Scoring System

### Point Calculation
- **Total Maximum Points:** 410 points (sum of all max points across all questions)
- Questions with multiple-choice checkboxes: Sum all selected option points
- Questions with single-choice radio: Add the selected option's points
- **Normalized Score:** `(totalPoints / 410) * 100`
- **Result:** 0-100 scale

### Score Bands

| Band | Score Range | Tag | HubSpot Property Value | Action |
|------|-------------|-----|----------------------|--------|
| Hot | 80-100 | Assess:Hot | `ae_hot_flag = 'true'` | 24hr SLA, Book full assessment |
| High | 60-79 | Assess:High | - | Schedule discovery call, 3-day SLA |
| Medium | 40-59 | Assess:Medium | - | Automated nurture sequence |
| Low | 0-39 | Assess:Low | - | 90-day educational nurture |

---

## Data Flow

1. User completes 12 assessment questions (4 contact info + 8 assessment)
2. Frontend calculates normalized score (0-100)
3. Submit to `/api/hubspot/submit` with `answers` + `score`
4. Backend maps answers to exact HubSpot property names
5. Multi-select values are joined with `;` separator
6. Search for existing contact by email
7. Create or update contact with all properties
8. Set `ae_hot_flag = 'true'` if score >= 80
9. Set `assessment_completed_date` to current date (YYYY-MM-DD)
10. Create/associate company if company name provided
11. Return success response

---

## Property Data Types in HubSpot

### Text Properties
- `firstname`, `lastname`, `company` - Plain text strings

### Email Properties
- `email` - Valid email address

### Enumeration Properties (Multi-select)
- `assessment_q1_response`
- `assessment_q3_response`
- `assessment_systems_used`
- `assessment_decision_makers`
- `assessment_q9_response`

**Format:** Multiple values separated by `;` (semicolon)  
**Example:** `"crm;erp;project_management"`

### Enumeration Properties (Single-select)
- `assessment_automation_level`
- `assessment_manual_task_hours`
- `assessment_q7_response`

**Format:** Single value  
**Example:** `"evaluating"`

### Number Properties
- `ai_readiness_score` - Integer (0-100)

### Date Properties
- `assessment_completed_date` - YYYY-MM-DD format

### Checkbox Properties
- `ae_hot_flag` - String `"true"` or omitted

---

## Testing

To test the integration:

```bash
# 1. Ensure token is set
echo $HUBSPOT_ACCESS_TOKEN

# 2. Verify properties exist
node fetch-hubspot-properties.js

# 3. Run dev server
npm run dev

# 4. Complete assessment at http://localhost:4321

# 5. Check HubSpot contact properties after submission
```

---

## Notes

- All checkbox/multi-select fields use `;` as separator when sending to HubSpot
- All radio/single-select fields send single string values
- The `ae_hot_flag` is automatically set to `"true"` when score >= 80
- Contact properties are created/updated atomically
- Company association is best-effort (won't fail the submission if it errors)
- Standard contact properties (`email`, `firstname`, `lastname`, `company`) are always included

---

## Property Mapping Quick Reference

| Quiz Question ID | HubSpot Property | Data Type |
|-----------------|------------------|-----------|
| `email` | `email` | email |
| `firstname` | `firstname` | text |
| `lastname` | `lastname` | text |
| `company` | `company` | text |
| `assessment_q1_response` | `assessment_q1_response` | multi-select (`;` separated) |
| `assessment_automation_level` | `assessment_automation_level` | single-select |
| `assessment_q3_response` | `assessment_q3_response` | multi-select (`;` separated) |
| `assessment_manual_task_hours` | `assessment_manual_task_hours` | single-select |
| `assessment_systems_used` | `assessment_systems_used` | multi-select (`;` separated) |
| `assessment_decision_makers` | `assessment_decision_makers` | multi-select (`;` separated) |
| `assessment_q7_response` | `assessment_q7_response` | single-select |
| `assessment_q9_response` | `assessment_q9_response` | multi-select (`;` separated) |
| (calculated) | `ai_readiness_score` | number |
| (calculated) | `assessment_completed_date` | date (YYYY-MM-DD) |
| (calculated) | `ae_hot_flag` | checkbox (`"true"` if score >= 80) |

---

**Status:** ✅ All properties verified and aligned with HubSpot  
**Last Verified:** Wed Nov 26 2025
