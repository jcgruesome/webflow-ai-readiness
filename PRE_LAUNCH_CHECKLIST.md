# Pre-Launch Checklist - ReshapeX AI Readiness Assessment

## 🎯 Critical Items (Must Complete Before Launch)

### 1. Environment Variables
- [ ] Add `HUBSPOT_ACCESS_TOKEN` to `.env` file (local development)
- [ ] Add `HUBSPOT_ACCESS_TOKEN` to Cloudflare Workers environment (production)
- [ ] Rotate the token after testing (current token is in chat history)

### 2. HubSpot Configuration
- [ ] Create all 14 custom contact properties (see QUICK_START.md)
- [ ] Create "AI Readiness Assessment" property group
- [ ] Set up 4 automated workflows:
  - [ ] Score Band Assignment workflow
  - [ ] Hot Lead Assignment workflow (to Chris Ross)
  - [ ] High Lead SDR Task workflow
  - [ ] Medium/Low Nurture workflows

### 3. Email Templates
Create in HubSpot:
- [ ] Hot Lead Follow-up email
- [ ] High Lead with Case Study email
- [ ] Medium Lead with Checklist email
- [ ] Low Lead with Resources email

### 4. Links & Resources
Update in `src/components/AssessmentQuiz.tsx`:
- [ ] Calendly booking link (line ~413, 432)
- [ ] Case study download link (line ~432)
- [ ] Budget checklist download link (line ~445)
- [ ] Webinar registration link (line ~451)
- [ ] Foundational resources link (line ~465)

Current placeholders are marked with `link: '#'`

### 5. Branding
Update in `src/pages/index.astro`:
- [ ] Replace text logo with actual ReshapeX logo
- [ ] Verify colors match brand guidelines
- [ ] Add favicon if needed

---

## 🧪 Testing (Before Launch)

### Test All Score Bands
- [ ] Score 85+ (Hot) with company_size "200-499" → Should auto-assign to Chris Ross
- [ ] Score 85+ (Hot) with company_size "1-49" → Should route to SDR review
- [ ] Score 70 (High) → Should create SDR task
- [ ] Score 50 (Medium) → Should send checklist
- [ ] Score 30 (Low) → Should send resources

### Test Data Quality Controls
- [ ] Submit with Gmail address → Should flag `is_corporate_email = No`
- [ ] Submit with corporate email → Should flag `is_corporate_email = Yes`
- [ ] Test open_ended_pain with measurable terms → Should add +10 points
- [ ] Test conditional question (automation details) → Should only show when "Yes" selected

### Test Form Functionality
- [ ] All 12 questions display correctly
- [ ] Can't proceed without answering required questions
- [ ] Previous/Next navigation works
- [ ] Progress bar updates correctly
- [ ] Multiple choice selections save
- [ ] "Other" text inputs work
- [ ] Email validation works
- [ ] Results page displays for all bands
- [ ] Results email sent to submitted address

### Test HubSpot Integration
- [ ] Contact created with all properties
- [ ] Company created and associated (if corporate email)
- [ ] Score calculated correctly
- [ ] Band assigned correctly
- [ ] Workflows triggered
- [ ] Tasks created for appropriate bands
- [ ] Emails sent automatically

### Test Mobile Experience
- [ ] All questions display correctly on mobile
- [ ] Form inputs are usable on mobile
- [ ] Results page displays correctly on mobile
- [ ] Progress bar visible on mobile
- [ ] Navigation buttons accessible on mobile

---

## 📊 Analytics & Monitoring Setup

### Set up tracking for:
- [ ] Google Analytics / Mixpanel event tracking
- [ ] Assessment started event
- [ ] Each question completion
- [ ] Assessment completed event
- [ ] Score band distribution
- [ ] Drop-off points
- [ ] Time to complete

### HubSpot Reporting Dashboard
Create cards for:
- [ ] Total submissions (daily/weekly/monthly)
- [ ] Score distribution (by band)
- [ ] Average readiness score
- [ ] Submissions by source/UTM
- [ ] Corporate vs. free email ratio
- [ ] Hot lead SLA compliance (24h target)
- [ ] High lead SLA compliance (3-day target)
- [ ] Conversion rates (Assessment → MQL → SQL)
- [ ] False positive rate

---

## 👥 Team Briefing

### Brief Chris Ross
- [ ] Hot lead assignment criteria explained
- [ ] 24-hour SLA communicated
- [ ] SDR checklist reviewed
- [ ] Sample Hot lead email reviewed

### Brief SDR Team
- [ ] High/Medium/Low lead routing explained
- [ ] 3-day SLA for High leads communicated
- [ ] Follow-up process for each band
- [ ] Where to find lead data in HubSpot
- [ ] How to interpret readiness scores

### Brief Marketing Team
- [ ] Nurture sequence strategy
- [ ] Email templates and timing
- [ ] Resource links and content
- [ ] Re-engagement timeline (30d/90d)
- [ ] A/B testing plan

---

## 🚀 Deployment Steps

### 1. Local Testing Complete
```bash
# Verify everything works locally
npm run dev
# Complete 10+ test submissions
# Check console for errors
# Verify HubSpot submissions
```

### 2. Production Environment Variables
```bash
# In Cloudflare Workers dashboard:
# Add HUBSPOT_ACCESS_TOKEN
# Verify WEBFLOW_CMS_SITE_API_TOKEN (if using CMS)
```

### 3. Deploy to Production
```bash
npm run build
# Deploy via Webflow Apps or Cloudflare
```

### 4. Post-Deploy Verification
- [ ] Submit test assessment in production
- [ ] Verify HubSpot contact created
- [ ] Verify workflows triggered
- [ ] Verify emails sent
- [ ] Check all links work
- [ ] Test on multiple devices/browsers

---

## 📈 Week 1 Success Metrics

Track these KPIs:

| Metric | Target | Actual |
|--------|--------|--------|
| **Submissions** | 50+ | ___ |
| **Completion Rate** | >70% | ___% |
| **Corporate Email %** | >60% | ___% |
| **Hot Leads** | 10-20% | ___% |
| **Hot Lead 24h SLA** | >90% | ___% |
| **High Lead 3d SLA** | >85% | ___% |
| **Assessment → Booking** | >20% (Hot) | ___% |

---

## 🔧 Known Items to Update Post-Launch

### Immediate (within 1 week)
- [ ] Add actual logo image
- [ ] Update all resource links
- [ ] Create downloadable resources (checklist, case studies)
- [ ] Record webinar or schedule first session
- [ ] Set up Calendly if not already done

### Short-term (within 2 weeks)
- [ ] A/B test result page CTAs
- [ ] Optimize email templates based on open rates
- [ ] Adjust scoring weights based on lead quality
- [ ] Fine-tune Hot lead assignment criteria
- [ ] Add UTM tracking for campaigns

### Ongoing
- [ ] Weekly review of lead quality
- [ ] Monthly scoring calibration
- [ ] Quarterly review of questions
- [ ] Continuous optimization of workflows
- [ ] Regular SLA compliance monitoring

---

## 🆘 Troubleshooting

### Common Issues

**Submissions not appearing in HubSpot**
- Check HUBSPOT_ACCESS_TOKEN is set correctly
- Verify API permissions (contacts.write, companies.write)
- Check browser console for API errors
- Verify custom properties exist in HubSpot

**Workflows not triggering**
- Ensure workflows are "turned on" in HubSpot
- Check workflow enrollment criteria
- Verify contact meets all conditions
- Check workflow history for errors

**Emails not sending**
- Verify email templates exist
- Check email sending domain is configured
- Verify contacts are not on suppression list
- Check HubSpot email logs

**Score calculation seems wrong**
- Review scoring logic in AssessmentQuiz.tsx
- Check all question responses are being captured
- Verify normalization calculation
- Test with known input/output pairs

**Hot leads not assigning to Chris Ross**
- Check secondary signal conditions
- Verify company_size, budget, or timeline criteria
- Check Chris Ross user exists in HubSpot
- Review Hot Lead Assignment workflow

---

## 📞 Support Contacts

- **Technical Issues**: [Your Dev Team]
- **HubSpot Configuration**: [HubSpot Admin]
- **Sales Process**: Chris Ross (chris@reshapex.com)
- **Marketing/Content**: [Marketing Team Lead]

---

## ✅ Final Pre-Launch Sign-Off

Before making this live:

- [ ] All critical items completed
- [ ] 50+ test submissions completed successfully
- [ ] Team briefed and ready
- [ ] Monitoring/analytics configured
- [ ] Production environment tested
- [ ] Backup/rollback plan ready

**Sign-off Date**: ___________
**Approved By**: ___________

---

**Status**: 🟡 Ready for Configuration → 🟢 Ready to Launch
