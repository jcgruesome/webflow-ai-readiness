# Quick Start - ReshapeX AI Readiness Assessment

## Get Up and Running in 3 Steps

### Step 1: Add HubSpot Token
Add this line to your `.env` file:

```bash
HUBSPOT_ACCESS_TOKEN=your_private_app_token_here
```

**How to get your token:**
1. Go to HubSpot → Settings → Integrations → Private Apps
2. Create a new app with scopes: `crm.objects.contacts` and `crm.objects.companies` (read & write)
3. Copy the access token (starts with `pat-na1-`)
4. Add it to `.env`

⚠️ **Security Note**: Never commit tokens to version control. The `.env` file is already in `.gitignore`.

### Step 2: Create HubSpot Properties

Log into HubSpot and create these **14 contact properties** in the "AI Readiness Assessment" property group:

| Property Name | Type | Options |
|--------------|------|---------|
| `company_name` | Single-line text | - |
| `company_size` | Dropdown | 1-49 / 50-199 / 200-499 / 500+ |
| `annual_revenue` | Dropdown | <$10M / $10-50M / $50-200M / $200-500M / >$500M |
| `role_title` | Single-line text | - |
| `primary_pain` | Multi-line text | - |
| `existing_automation` | Multi-line text | - |
| `tech_stack` | Multi-line text | - |
| `estimated_ai_budget_2026` | Dropdown | None / <25k / 25k-50k / 50k-150k / >150k |
| `decision_timeline` | Dropdown | Now / 0-3mo / 3-6mo / 6-12mo / No budget |
| `open_ended_pain` | Multi-line text | - |
| `readiness_score` | Number | Range: 0-100 |
| `assess_band` | Dropdown | Low / Medium / High / Hot |
| `assessment_form_completed_at` | Date picker | - |
| `is_corporate_email` | Dropdown | Yes / No |

### Step 3: Run the App

```bash
npm run dev
```

Open http://localhost:4321 and complete a test assessment!

---

## What Happens Next

### Score Bands (Automatic Routing)

**🔴 Hot (80-100)**
- Auto-assigned to Chris Ross (if company >49 employees OR budget >$50k OR timeline <3mo)
- SLA: Contact within 24 hours
- CTA: Book Full Assessment

**🟠 High (60-79)**
- SDR task created (3-day SLA)
- Sent case study + booking link
- CTA: Schedule Discovery Call

**🟡 Medium (40-59)**
- Sent Budget Planning Checklist
- Webinar invitation
- CTA: Download Resources

**⚪ Low (0-39)**
- Foundational resources sent
- 90-day re-engagement
- CTA: Educational Content

---

## Before Going Live

### Update These Placeholders

In `src/components/AssessmentQuiz.tsx`, replace `#` with actual links:

```typescript
// Hot/High leads - Calendly booking link
link: 'https://calendly.com/reshapex/discovery'

// Case study download
link: 'https://reshapex.com/resources/case-study.pdf'

// Budget checklist
link: 'https://reshapex.com/resources/budget-checklist.pdf'

// Webinar registration
link: 'https://reshapex.com/webinar'

// Foundational resources
link: 'https://reshapex.com/resources'
```

### Add ReshapeX Logo

Replace the text logo in `src/pages/index.astro` with actual logo:

```html
<!-- Current: -->
<div class="text-4xl font-bold">ReshapeX</div>

<!-- Replace with: -->
<img src="/logo.svg" alt="ReshapeX" class="h-16" />
```

---

## Testing Checklist

Run test submissions for:

- [ ] Hot lead (score 80+) with large company
- [ ] Hot lead with small company (verify no auto-assignment)
- [ ] High lead (score 60-79)
- [ ] Medium lead (score 40-59)
- [ ] Low lead (score 0-39)
- [ ] Free email domain (Gmail, etc.) - verify flag
- [ ] Conditional question (automation details)
- [ ] "Other" option with text input
- [ ] All 4 result pages display correctly

---

## HubSpot Workflows to Configure

### 1. Score Band Assignment
```
Trigger: readiness_score is known
Actions:
- If 0-39: Set assess_band = "Low"
- If 40-59: Set assess_band = "Medium"
- If 60-79: Set assess_band = "High"
- If 80-100: Set assess_band = "Hot"
```

### 2. Hot Lead Assignment
```
Trigger: assess_band = "Hot"
Condition: company_size ≠ "1-49" OR budget ≥ "$50k-150k" OR timeline ≤ "0-3mo"
Actions:
- Assign to Chris Ross
- Create task: "Contact within 24h"
- Send automated email
```

### 3. High Lead SDR Task
```
Trigger: assess_band = "High"
Actions:
- Create task for SDR (due: 3 days)
- Send case study email
```

### 4. Medium/Low Nurture
```
Trigger: assess_band IN ["Medium", "Low"]
Actions:
- Add to nurture list
- Send resources email
- Set re-engagement (30d or 90d)
```

---

## Quick Reference: Scoring Weights

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

---

## Support

- **Full Documentation**: See `HUBSPOT_SETUP.md`
- **Implementation Details**: See `BUILD_GUIDE_IMPLEMENTATION.md`
- **Technical Issues**: Check console logs and HubSpot error messages
- **Contact**: chris@reshapex.com

---

**Ready to go?** Run `npm run dev` and start testing! 🚀
