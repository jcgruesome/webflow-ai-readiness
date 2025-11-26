import type { APIRoute } from 'astro';
import { Client } from '@hubspot/api-client';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { answers, score } = body;

    // Get HubSpot token from environment
    const token = locals?.runtime?.env?.HUBSPOT_ACCESS_TOKEN || import.meta.env.HUBSPOT_ACCESS_TOKEN;
    
    if (!token) {
      console.error('❌ HubSpot token not found');
      return new Response(JSON.stringify({ error: 'HubSpot token not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const hubspotClient = new Client({ accessToken: token });

    // Extract contact info
    const email = answers.contact_email || answers.email;
    const companyName = answers.company_name || answers.company;
    const roleTitle = answers.role_title;

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('📝 Processing assessment submission for:', email);

    // Determine score band
    let scoreBand = 'Low';
    let hotFlag = false;
    
    if (score >= 80) {
      scoreBand = 'Hot';
      hotFlag = true;
    } else if (score >= 60) {
      scoreBand = 'High';
    } else if (score >= 40) {
      scoreBand = 'Medium';
    }

    // Check for secondary signals for Hot lead routing
    const companySize = answers.company_size;
    const budget = answers.estimated_AI_budget_2026;
    const timeline = answers.decision_timeline;
    
    const hasSecondarySignal = 
      (companySize && (companySize === '50-199' || companySize === '200-499' || companySize === '500+')) ||
      (budget && (budget === '50k_150k' || budget === 'over_150k')) ||
      (timeline && (timeline === 'now' || timeline === '0_3_months'));

    // Prepare contact properties - mapping to new HubSpot property names
    const contactProperties: Record<string, any> = {
      email,
      company_name: companyName,
      role_title: roleTitle || null,
      
      // Assessment responses - mapped to exact HubSpot property names
      company_size: companySize || null,
      annual_revenue: answers.annual_revenue || null,
      primary_pain: Array.isArray(answers.primary_pain) ? answers.primary_pain.join(', ') : (answers.primary_pain || null),
      existing_automation: answers.existing_automation || null,
      tech_stack: Array.isArray(answers.tech_stack) ? answers.tech_stack.join(', ') : (answers.tech_stack || null),
      estimated_AI_budget_2026: budget || null,
      decision_timeline: timeline || null,
      open_ended_pain: answers.open_ended_pain || null,
      
      // Conditional question (existing_automation follow-up)
      existing_automation_details: answers[`existing_automation_conditional`] || null,
      
      // Score and metadata
      readiness_score: score,
      assessment_form_completed_at: new Date().toISOString(),
      assess_band: scoreBand,
    };

    // Set AE Hot Flag if score is 80+ AND has secondary signal
    if (hotFlag && hasSecondarySignal) {
      contactProperties.ae_hot_flag = 'true';
    }

    console.log('📊 Score:', score, '| Band:', scoreBand, '| Hot Flag:', hotFlag, '| Secondary Signal:', hasSecondarySignal);

    // Create or update contact
    let contactId: string;
    
    try {
      // Try to find existing contact by email
      const searchResponse = await hubspotClient.crm.contacts.searchApi.doSearch({
        filterGroups: [{
          filters: [{
            propertyName: 'email',
            operator: 'EQ',
            value: email
          }]
        }],
        properties: ['email', 'firstname', 'lastname'],
        limit: 1
      });

      if (searchResponse.results && searchResponse.results.length > 0) {
        // Update existing contact
        contactId = searchResponse.results[0].id;
        console.log('🔄 Updating existing contact:', contactId);
        
        await hubspotClient.crm.contacts.basicApi.update(contactId, {
          properties: contactProperties
        });
        
        console.log('✅ Contact updated successfully');
      } else {
        // Create new contact
        console.log('➕ Creating new contact');
        
        const createResponse = await hubspotClient.crm.contacts.basicApi.create({
          properties: contactProperties
        });
        
        contactId = createResponse.id;
        console.log('✅ Contact created successfully:', contactId);
      }

      // If company name provided, create/update company with company properties
      if (companyName) {
        try {
          console.log('🏢 Processing company:', companyName);
          
          // Search for existing company
          const companySearchResponse = await hubspotClient.crm.companies.searchApi.doSearch({
            filterGroups: [{
              filters: [{
                propertyName: 'name',
                operator: 'EQ',
                value: companyName
              }]
            }],
            properties: ['name', 'company_size', 'annual_revenue'],
            limit: 1
          });

          let companyId: string;
          const companyProperties: Record<string, any> = {
            name: companyName,
          };

          // Update company properties if provided
          if (companySize) {
            companyProperties.company_size = companySize;
          }
          if (answers.annual_revenue) {
            companyProperties.annual_revenue = answers.annual_revenue;
          }

          if (companySearchResponse.results && companySearchResponse.results.length > 0) {
            companyId = companySearchResponse.results[0].id;
            console.log('🔄 Found existing company:', companyId);
            
            // Update company properties
            await hubspotClient.crm.companies.basicApi.update(companyId, {
              properties: companyProperties
            });
            console.log('✅ Company updated');
          } else {
            // Create new company
            const createCompanyResponse = await hubspotClient.crm.companies.basicApi.create({
              properties: companyProperties
            });
            companyId = createCompanyResponse.id;
            console.log('✅ Company created:', companyId);
          }

          // Associate contact with company
          await hubspotClient.crm.contacts.associationsApi.create(
            contactId,
            'company',
            companyId,
            [{
              associationCategory: 'HUBSPOT_DEFINED',
              associationTypeId: 280 // Contact to Company association type
            }]
          );
          
          console.log('✅ Contact associated with company');
        } catch (companyError: any) {
          console.error('⚠️ Error handling company:', companyError.message);
          // Don't fail the entire request if company handling fails
        }
      }

      return new Response(JSON.stringify({ 
        success: true,
        contactId,
        score,
        scoreBand
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (hubspotError: any) {
      console.error('❌ HubSpot API Error:', hubspotError.message);
      
      if (hubspotError.body) {
        console.error('Error details:', JSON.stringify(hubspotError.body, null, 2));
      }

      return new Response(JSON.stringify({ 
        error: 'Failed to submit to HubSpot',
        details: hubspotError.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error: any) {
    console.error('❌ Server error:', error.message);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
