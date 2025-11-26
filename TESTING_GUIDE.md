# Testing Guide - ReshapeX AI Readiness Assessment

## Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment


**Get your token from:** HubSpot → Settings → Integrations → Private Apps

### 3. Start Development Server
```bash
npm run dev
```

Open http://localhost:4321

---

## Test Scenarios

### Scenario 1: Hot Lead with Auto-Assignment
**Goal**: Score 80+, trigger Chris Ross assignment

```
Company Name: Acme Manufacturing Inc
Email: john.doe@acmemanufacturing.com
Role: VP of Operations
Company Size: 200-499 (+10 pts)
Annual Revenue: $50-200M (+10 pts)
Primary Pain: ☑ Manual order processing ☑ Support backlog (+15 pts)
Existing Automation: Yes (+10 pts)
  Details: "Some basic Excel macros"
Tech Stack: ☑ ERP ☑ CRM (+10 pts)
Budget: >$150k (+20 pts)
Timeline: Actively evaluating now (+15 pts)
Challenge: "We spend 40 hours per week on manual order entry" (+10 pts - measurable)
Consent: ☑ Yes

Expected Score: 100 (or close)
Expected Band: Hot
Expected Action: Auto-assign to Chris Ross (company size 200-499)
```

### Scenario 2: Hot Lead WITHOUT Auto-Assignment
**Goal**: Score 80+, but route to SDR review

```
Company Name: SmallTech Startup
Email: sarah@smalltech.io
Role: CEO
Company Size: 1-49 (0 pts - but high in other areas)
Annual Revenue: <$10M (0 pts)
Primary Pain: ☑ Slow quoting ☑ Manual order processing (+15 pts)
Existing Automation: Yes (+10 pts)
  Details: "Zapier integrations"
Tech Stack: ☑ CRM ☑ Helpdesk (+10 pts)
Budget: $25k-$50k (+5 pts)
Timeline: 0-3 months (+15 pts)
Challenge: "Quoting takes days instead of hours causing lost deals" (+10 pts)
Consent: ☑ Yes

Expected Score: ~65 (may be lower, depends on exact calc)
Expected Band: High or Hot
Expected Action: If Hot, route to SDR review (no auto-assign - small company + low budget + no timeline urgency)
```

### Scenario 3: High Lead
**Goal**: Score 60-79, create SDR task

```
Company Name: MidSize Corp
Email: alex@midsizecorp.com
Role: Director of IT
Company Size: 50-199 (+10 pts)
Annual Revenue: $10-50M (+10 pts)
Primary Pain: ☑ Reporting delays ☑ Inventory issues (+10 pts)
Existing Automation: Some (+10 pts)
  Details: "Basic ERP workflows"
Tech Stack: ☑ ERP ☑ WMS (+10 pts)
Budget: $50k-$150k (+10 pts)
Timeline: 3-6 months (+10 pts)
Challenge: "Manual reporting takes our team away from strategic work" (+10 pts)
Consent: ☑ Yes

Expected Score: 70-75
Expected Band: High
Expected Action: SDR task created, case study sent
```

### Scenario 4: Medium Lead
**Goal**: Score 40-59, nurture campaign

```
Company Name: GrowthCo
Email: manager@growthco.com
Role: Operations Manager
Company Size: 50-199 (+10 pts)
Annual Revenue: <$10M (0 pts)
Primary Pain: ☑ Data entry tasks (+15 pts - but only this one)
Existing Automation: No (+5 pts)
Tech Stack: ☑ CRM (+10 pts)
Budget: <$25k (+5 pts)
Timeline: 6-12 months (+5 pts)
Challenge: "Need to explore automation options" (0 pts - not measurable)
Consent: ☑ Yes

Expected Score: 45-50
Expected Band: Medium
Expected Action: Budget checklist sent, webinar invite
```

### Scenario 5: Low Lead
**Goal**: Score 0-39, long-term nurture

```
Company Name: Early Stage Inc
Email: founder@earlystage.com
Role: Founder
Company Size: 1-49 (0 pts)
Annual Revenue: <$10M (0 pts)
Primary Pain: ☑ Other: "Just exploring" (+5 pts)
Existing Automation: No (+5 pts)
Tech Stack: ☑ Other: "Spreadsheets" (0 pts)
Budget: None (0 pts)
Timeline: No timeline/budget (0 pts)
Challenge: "Want to learn about AI" (0 pts)
Consent: ☑ Yes

Expected Score: 10
Expected Band: Low
Expected Action: Foundational resources sent
```

### Scenario 6: Free Email Domain Flag
**Goal**: Test email validation

```
Company Name: Test Company
Email: testuser@gmail.com ← Free email domain
Role: Manager
[Complete other fields with medium-level responses]

Expected: is_corporate_email = "No"
Should flag for manual review in HubSpot
```

### Scenario 7: Conditional Question Logic
**Goal**: Test automation details conditional question

**Test A - Should Show**:
```
Existing Automation: Yes (+10 pts)
→ Next screen should show "Which systems or processes are automated?"
```

**Test B - Should NOT Show**:
```
Existing Automation: No (+5 pts)
→ Should skip automation details question
→ Go directly to tech stack question
```

### Scenario 8: "Other" Option with Text Input
**Goal**: Test "Other" handling

```
Primary Pain: ☑ Other
→ Should show text input: "Please specify..."
→ Enter: "Custom workflow delays"
→ Should save as: "Other: Custom workflow delays"
```

---

## Validation Checklist

### Functional Tests

**Navigation**
- [ ] Can't click "Next" without answering required questions
- [ ] "Previous" button works correctly
- [ ] "Previous" is disabled on first question
- [ ] Progress bar updates correctly
- [ ] Question counter shows correct numbers

**Input Validation**
- [ ] Email field validates email format
- [ ] Text fields accept input
- [ ] Single-choice radio buttons work
- [ ] Multiple-choice checkboxes work
- [ ] "Other" text input appears when selected
- [ ] Can't submit without answering all required questions

**Conditional Logic**
- [ ] Automation details question only shows when "Yes" selected
- [ ] Skips automation details when "No" selected
- [ ] Total question count adjusts correctly

**Score Calculation**
- [ ] Hot scenario scores 80-100
- [ ] High scenario scores 60-79
- [ ] Medium scenario scores 40-59
- [ ] Low scenario scores 0-39
- [ ] Measurable terms in challenge add +10 points
- [ ] High-value pain points add +15 points

**Result Pages**
- [ ] Correct band displayed for each score range
- [ ] Hot page shows correct message and CTA
- [ ] High page shows correct message and CTA
- [ ] Medium page shows correct message and CTA
- [ ] Low page shows correct message and CTA
- [ ] Email address displayed in results
- [ ] "Take Assessment Again" resets form

**HubSpot Integration**
- [ ] Contact created in HubSpot
- [ ] All properties populated correctly
- [ ] Company created (if corporate email)
- [ ] Company associated with contact
- [ ] readiness_score calculated correctly
- [ ] assess_band assigned correctly
- [ ] is_corporate_email set correctly
- [ ] assessment_form_completed_at has timestamp

---

## Browser Testing

Test in these browsers:

### Desktop
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Mobile responsive at 375px width
- [ ] Mobile responsive at 768px width

### Checks
- [ ] All questions readable on mobile
- [ ] Form inputs usable on mobile
- [ ] Buttons not cut off
- [ ] Progress bar visible
- [ ] Result cards stack properly on mobile

---

## Performance Testing

### Load Times
- [ ] Initial page load <3s
- [ ] Question transitions smooth
- [ ] No lag when selecting options
- [ ] Submit button shows loading state
- [ ] Results appear within 2-3s of submit

### Error Handling
- [ ] Network error shows user-friendly message
- [ ] HubSpot API error shows retry option
- [ ] Invalid email shows validation error
- [ ] Form doesn't break on unexpected input

---

## HubSpot Verification

### Contact Properties
After each test submission, verify in HubSpot:

```
Contact Record:
├─ email ✓
├─ firstname ✓
├─ lastname ✓
├─ jobtitle ✓
├─ company ✓
├─ company_name ✓
├─ company_size ✓
├─ annual_revenue ✓
├─ role_title ✓
├─ primary_pain ✓
├─ existing_automation ✓
├─ tech_stack ✓
├─ estimated_ai_budget_2026 ✓
├─ decision_timeline ✓
├─ open_ended_pain ✓
├─ readiness_score (0-100) ✓
├─ assess_band (Low/Med/High/Hot) ✓
├─ assessment_form_completed_at ✓
└─ is_corporate_email (Yes/No) ✓
```

### Workflow Triggers
Check that workflows fire:

**Hot Lead (Score 80+)**
- [ ] assess_band set to "Hot"
- [ ] Tag "Assess:Hot" added
- [ ] IF secondary signal: Assigned to Chris Ross
- [ ] IF secondary signal: Task created with 24h due
- [ ] Email sent automatically

**High Lead (Score 60-79)**
- [ ] assess_band set to "High"
- [ ] Tag "Assess:High" added
- [ ] SDR task created (3-day due)
- [ ] Email sent with case study

**Medium Lead (Score 40-59)**
- [ ] assess_band set to "Medium"
- [ ] Tag "Assess:Medium" added
- [ ] Email sent with checklist

**Low Lead (Score 0-39)**
- [ ] assess_band set to "Low"
- [ ] Tag "Assess:Low" added
- [ ] Email sent with resources

---

## Debugging Tips

### Check Console Logs
```javascript
// Browser console will show:
console.log('Submitting assessment...')
console.log('Score:', score)
console.log('Answers:', answers)
```

### Common Issues

**"Failed to submit" error**
- Check HUBSPOT_ACCESS_TOKEN in .env
- Verify token has correct permissions
- Check HubSpot custom properties exist
- Look at Network tab for API response

**Score seems wrong**
- Log totalPoints before normalization
- Check each question's point value
- Verify measurable terms detection
- Review primary_pain scoring logic

**Workflows not triggering**
- Verify workflows are "On" in HubSpot
- Check enrollment criteria
- Look at workflow history for errors
- Verify property values match triggers

**Company not associating**
- Check email domain extraction
- Verify is_corporate_email flag
- Look at API logs for company errors
- Check company already exists

**Conditional question not showing**
- Check answer state for previous question
- Verify conditionalOn logic
- Look at visibleQuestions filter

---

## Test Data Cleanup

After testing, clean up HubSpot:

```
1. Go to Contacts
2. Filter by "assessment_form_completed_at" = Today
3. Select all test contacts
4. Archive or delete
5. Check Companies tab
6. Archive/delete test companies
```

Or use specific test email pattern:
```
test+scenario1@company.com
test+scenario2@company.com
etc.
```

Then filter and bulk delete by email pattern.

---

## Automated Testing (Future)

Consider adding:

```bash
# Example test commands (not implemented yet)
npm run test:unit        # Unit tests for scoring logic
npm run test:integration # Integration tests for HubSpot
npm run test:e2e         # End-to-end Playwright tests
```

Test files to create:
- `src/components/AssessmentQuiz.test.tsx`
- `src/lib/scoring.test.ts`
- `tests/e2e/assessment-flow.spec.ts`

---

## Sign-Off Checklist

Before marking testing complete:

- [ ] All 8 test scenarios completed successfully
- [ ] All functional tests passed
- [ ] Tested in 4+ browsers
- [ ] Mobile responsive verified
- [ ] HubSpot properties all populate correctly
- [ ] All 4 workflows trigger correctly
- [ ] Email validation works
- [ ] Conditional logic works
- [ ] "Other" text inputs work
- [ ] Score calculations verified
- [ ] No console errors
- [ ] Performance is acceptable
- [ ] 50+ test submissions completed
- [ ] Test data cleaned up

**Tested By**: _______________
**Date**: _______________
**Status**: ⚪ Not Started / 🟡 In Progress / 🟢 Complete

---

## Next Steps After Testing

1. Document any issues found
2. Fix critical bugs
3. Optimize based on performance findings
4. Update scoring weights if needed
5. Proceed to PRE_LAUNCH_CHECKLIST.md
6. Schedule team training
7. Prepare for launch! 🚀
