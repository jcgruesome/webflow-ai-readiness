# Deployment Guide - ReshapeX AI Readiness Assessment

## Overview

This guide covers deploying the AI Readiness Assessment to production on Cloudflare Workers via Webflow Apps.

---

## Pre-Deployment Checklist

Before deploying, ensure you've completed:

### 1. Configuration
- [ ] Updated all links in `src/lib/assessment-config.ts`
  - Calendly booking URLs
  - Resource download links
  - Webinar registration URL
  - Actual logo path
- [ ] Added actual ReshapeX logo to `/public/logo.svg`
- [ ] Verified all copy matches brand guidelines

### 2. HubSpot Setup
- [ ] Created all 14 custom contact properties
- [ ] Set up 4 automated workflows
- [ ] Created 4 email templates
- [ ] Tested HubSpot integration locally
- [ ] Rotated access token (the one in chat is exposed)

### 3. Testing
- [ ] Completed 50+ test submissions
- [ ] Tested all 4 score bands
- [ ] Verified Hot lead assignment logic
- [ ] Tested on mobile devices
- [ ] Checked all browsers
- [ ] No console errors

### 4. Team Preparation
- [ ] Briefed Chris Ross on Hot lead criteria
- [ ] Briefed SDR team on follow-up process
- [ ] Created internal documentation
- [ ] Set up monitoring dashboards

---

## Deployment Steps

### Step 1: Update Configuration File

Edit `src/lib/assessment-config.ts`:

```typescript
export const assessmentConfig = {
  branding: {
    companyName: 'ReshapeX',
    logoUrl: '/logo.svg', // ← Update with actual path
    websiteUrl: 'https://reshapex.com',
    contactEmail: 'chris@reshapex.com',
  },

  calendly: {
    hotLeadUrl: 'https://calendly.com/reshapex/full-assessment', // ← UPDATE
    highLeadUrl: 'https://calendly.com/reshapex/discovery', // ← UPDATE
  },

  resources: {
    caseStudyPdf: 'https://reshapex.com/resources/case-study.pdf', // ← UPDATE
    budgetChecklistPdf: 'https://reshapex.com/resources/budget-planning-checklist.pdf', // ← UPDATE
    foundationalResourcesPage: 'https://reshapex.com/resources', // ← UPDATE
  },

  events: {
    webinarRegistrationUrl: 'https://reshapex.com/webinar/ai-budget-planning', // ← UPDATE
  },
  
  // ... rest of config
};
```

### Step 2: Build for Production

```bash
# Install dependencies
npm install

# Run type check
npx astro check

# Build for production
npm run build
```

Expected output:
```
✓ 57 modules transformed
✓ Built in XXXms
```

### Step 3: Set Environment Variables

#### For Cloudflare Workers (Production)

1. Go to Cloudflare Workers dashboard
2. Select your worker
3. Go to Settings → Variables
4. Add:

```
HUBSPOT_ACCESS_TOKEN=<your_new_token_here>
```

⚠️ **Important**: Use a NEW token, not the one from chat (it's been exposed).

To create a new token:
1. Go to HubSpot → Settings → Integrations → Private Apps
2. Create new private app or regenerate token
3. Ensure scopes: `crm.objects.contacts.write`, `crm.objects.companies.write`

### Step 4: Deploy to Cloudflare

#### Option A: Via Webflow Apps (Recommended)

If this is set up as a Webflow App:

```bash
# Deploy via Webflow
webflow apps deploy
```

#### Option B: Direct Cloudflare Deploy

```bash
# Deploy to Cloudflare Workers
npm run deploy

# Or using Wrangler directly
npx wrangler deploy
```

### Step 5: Post-Deployment Verification

#### Test in Production

1. **Visit the live URL**
   - Verify page loads correctly
   - Check that logo displays
   - Verify styling is correct

2. **Submit Test Assessment**
   ```
   Company: Test Production Deploy
   Email: test+prod@yourcompany.com
   [Complete all questions]
   ```

3. **Verify HubSpot Integration**
   - Check contact was created
   - Verify all properties populated
   - Check workflows triggered
   - Confirm email was sent

4. **Test All Score Bands**
   - Submit one assessment for each band (Hot/High/Medium/Low)
   - Verify correct result pages
   - Verify correct CTAs and links
   - Verify correct HubSpot routing

5. **Mobile Testing**
   - Test on iOS Safari
   - Test on Android Chrome
   - Verify responsive design

#### Check Analytics

If you've set up analytics:

```javascript
// Verify tracking events are firing
// Check browser console for analytics calls
```

---

## Production Monitoring

### Set Up Monitoring

#### 1. Cloudflare Workers Dashboard
Monitor:
- Request count
- Error rate
- Response time
- Bandwidth usage

#### 2. HubSpot Reporting
Track:
- Daily submissions
- Score distribution
- Conversion rates
- SLA compliance

#### 3. Alert Setup

Create alerts for:
- Error rate >5%
- Zero submissions for 24h
- HubSpot API errors
- Failed workflow triggers

### Key Metrics to Monitor

| Metric | Target | Alert If |
|--------|--------|----------|
| Completion Rate | >70% | <60% |
| Corporate Email % | >60% | <50% |
| Hot Lead 24h SLA | >90% | <85% |
| High Lead 3d SLA | >85% | <80% |
| HubSpot API Success | >99% | <95% |
| Page Load Time | <3s | >5s |

---

## Rollback Plan

If you need to roll back:

### Quick Rollback

```bash
# If using Wrangler
wrangler rollback

# Or deploy previous version
git checkout <previous_commit>
npm run build
npm run deploy
```

### Emergency Hotfix

If critical issue found:

1. **Disable submission endpoint**
   ```typescript
   // In src/pages/api/hubspot/submit.ts
   export const POST: APIRoute = async () => {
     return new Response(JSON.stringify({ 
       error: 'Temporarily unavailable' 
     }), { status: 503 });
   };
   ```

2. **Deploy hotfix**
   ```bash
   npm run build && npm run deploy
   ```

3. **Show maintenance message**
   ```typescript
   // In AssessmentQuiz.tsx
   const [maintenance] = useState(true);
   
   if (maintenance) {
     return <div>Assessment temporarily unavailable...</div>
   }
   ```

---

## Post-Launch Optimization

### Week 1: Monitoring & Quick Fixes

- [ ] Monitor submission rate daily
- [ ] Check for console errors
- [ ] Review HubSpot data quality
- [ ] Verify workflows are triggering
- [ ] Check email delivery rates
- [ ] Review Hot lead assignment accuracy

### Week 2-4: Data-Driven Optimization

#### Analyze Drop-Off Points
```
Question with highest drop-off?
├─ Too complex?
├─ Too many options?
└─ Technical issue?
```

#### Review Score Distribution
```
Are scores distributed reasonably?
├─ Too many Hot leads? (>30% = adjust weights)
├─ Too many Low leads? (>50% = adjust weights)
└─ Expected distribution: Low 25%, Med 35%, High 25%, Hot 15%
```

#### A/B Testing Ideas
- Result page CTA copy
- Question wording
- Number of questions
- Progress bar visibility
- Button colors/text

### Month 2+: Advanced Optimization

1. **Scoring Refinement**
   - Analyze false positive rate
   - Adjust point values based on actual conversions
   - Add/remove measurable terms

2. **Question Optimization**
   - Remove questions with no predictive value
   - Add questions that correlate with conversions
   - Simplify confusing questions

3. **Workflow Optimization**
   - Tune Hot lead assignment criteria
   - Optimize email timing
   - Refine nurture sequences

---

## Troubleshooting Common Issues

### Issue: Submissions not reaching HubSpot

**Symptoms**: Form submits but no contact in HubSpot

**Debug**:
```bash
# Check Cloudflare logs
wrangler tail

# Check browser network tab
# Look for 500 errors from /api/hubspot/submit
```

**Solutions**:
- Verify HUBSPOT_ACCESS_TOKEN is set
- Check token permissions
- Verify custom properties exist
- Check HubSpot API rate limits

### Issue: Workflows not triggering

**Symptoms**: Contacts created but no follow-up actions

**Debug**:
1. Go to HubSpot → Automation → Workflows
2. Check workflow is "On"
3. Review workflow history for errors
4. Check enrollment criteria

**Solutions**:
- Turn workflow on
- Fix enrollment criteria
- Check property values match triggers
- Review workflow permissions

### Issue: Wrong score calculation

**Symptoms**: Scores seem off

**Debug**:
```typescript
// Add console logging to calculateScore()
console.log('Total Points:', totalPoints);
console.log('Question answers:', answers);
```

**Solutions**:
- Review scoring logic
- Check measurable terms detection
- Verify normalization calculation
- Test with known inputs

### Issue: Hot leads not assigning to Chris Ross

**Symptoms**: Hot leads created but not assigned

**Debug**:
1. Check secondary signal logic
2. Verify Chris Ross user exists
3. Review workflow history

**Solutions**:
- Check company_size/budget/timeline criteria
- Verify Chris Ross email in HubSpot
- Check workflow assignment action
- Review HubSpot user permissions

### Issue: Slow page load

**Symptoms**: Page takes >5s to load

**Debug**:
```bash
# Check bundle size
npm run build
# Look for large files

# Use Lighthouse audit
npx lighthouse <url> --view
```

**Solutions**:
- Optimize images
- Enable Cloudflare caching
- Minimize JavaScript bundle
- Use lazy loading

---

## Security Checklist

### Before Production

- [ ] Rotate HubSpot token (never use exposed tokens)
- [ ] Enable HTTPS only
- [ ] Set up CORS properly
- [ ] Sanitize all user inputs
- [ ] Rate limit API endpoints
- [ ] Enable Cloudflare DDoS protection
- [ ] Set up error monitoring (don't expose stack traces)
- [ ] Review environment variables (no secrets in code)

### Ongoing

- [ ] Rotate tokens quarterly
- [ ] Review access logs monthly
- [ ] Update dependencies regularly
- [ ] Monitor for suspicious submissions
- [ ] Review HubSpot permissions

---

## Support & Escalation

### Internal Contacts

**Technical Issues**
- Development Team: [Your Team]
- Escalation: [Tech Lead]

**HubSpot Issues**
- HubSpot Admin: [Name]
- Escalation: [HubSpot Support]

**Business Issues**
- Chris Ross: chris@reshapex.com
- Sales Lead: [Name]

### External Support

**Cloudflare Workers**
- Dashboard: https://dash.cloudflare.com
- Docs: https://developers.cloudflare.com/workers
- Support: support@cloudflare.com

**HubSpot**
- Dashboard: https://app.hubspot.com
- Docs: https://developers.hubspot.com
- Support: Via HubSpot dashboard

### Emergency Contacts

**P0 - Site Down**
1. Check Cloudflare status
2. Check Cloudflare logs: `wrangler tail`
3. Roll back if needed
4. Contact: [On-Call Dev]

**P1 - HubSpot Integration Broken**
1. Check API logs
2. Verify token is valid
3. Check HubSpot status
4. Contact: [HubSpot Admin]

**P2 - Incorrect Routing**
1. Check workflow logs
2. Verify assignment logic
3. Manual assignment if urgent
4. Contact: [Sales Ops]

---

## Success Metrics

### Launch Day Targets

- [ ] Zero deployment errors
- [ ] 10+ test submissions successful
- [ ] All 4 score bands tested
- [ ] 100% HubSpot sync rate
- [ ] <2s average page load
- [ ] Zero console errors

### Week 1 Targets

- [ ] 50+ submissions
- [ ] >70% completion rate
- [ ] >60% corporate emails
- [ ] Hot lead 24h SLA >90%
- [ ] High lead 3d SLA >85%

### Month 1 Targets

- [ ] 200+ submissions
- [ ] 40% MQL rate (score 60+)
- [ ] 25% Hot lead booking rate
- [ ] <5% false positive rate
- [ ] Documented optimizations

---

## Changelog

Track all production changes:

```
## [1.0.0] - 2024-11-21
### Added
- Initial production deployment
- 12-question assessment flow
- HubSpot integration
- 4-band scoring system
- Automated routing workflows

## [1.0.1] - YYYY-MM-DD
### Changed
- [Document changes here]

## [1.1.0] - YYYY-MM-DD
### Added
- [Document new features]
```

---

## Next Steps After Deployment

1. **Immediate (Day 1)**
   - [ ] Monitor first 10 submissions closely
   - [ ] Verify all systems working
   - [ ] Brief team on monitoring process

2. **Short-term (Week 1)**
   - [ ] Daily monitoring of metrics
   - [ ] Quick fixes for any issues
   - [ ] Gather initial feedback

3. **Medium-term (Month 1)**
   - [ ] Weekly review of data
   - [ ] First round of optimizations
   - [ ] A/B testing setup

4. **Long-term (Month 2+)**
   - [ ] Monthly performance review
   - [ ] Feature enhancements
   - [ ] Continuous optimization

---

**Ready to deploy?** Run through the checklist one more time, then execute! 🚀

**Questions?** Refer to other docs:
- Setup: `QUICK_START.md`
- Testing: `TESTING_GUIDE.md`
- HubSpot: `HUBSPOT_SETUP.md`
- Implementation: `BUILD_GUIDE_IMPLEMENTATION.md`
