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
    const email = answers.email;
    const firstName = answers.firstname;
    const lastName = answers.lastname;
    const companyName = answers.company;

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('📝 Processing assessment submission for:', email);

    // Prepare contact properties - mapping to actual HubSpot property names
    const contactProperties: Record<string, any> = {
      email,
      firstname: firstName,
      lastname: lastName,
      company: companyName,
      
      // Assessment responses - mapped to exact HubSpot property names
      assessment_q1_response: answers.assessment_q1_response || null,
      assessment_automation_level: answers.assessment_automation_level || null,
      assessment_q3_response: answers.assessment_q3_response || null,
      assessment_manual_task_hours: answers.assessment_manual_task_hours || null,
      assessment_systems_used: answers.assessment_systems_used || null,
      assessment_decision_makers: answers.assessment_decision_makers || null,
      assessment_q7_response: answers.assessment_q7_response || null,
      assessment_q9_response: answers.assessment_q9_response || null,
      
      // Score and metadata
      ai_readiness_score: score,
      assessment_completed_date: new Date().toISOString().split('T')[0],
    };

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

    // Set AE Hot Flag if score is 80+
    if (hotFlag) {
      contactProperties.ae_hot_flag = 'true';
    }

    console.log('📊 Score:', score, '| Band:', scoreBand, '| Hot Flag:', hotFlag);

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

      // If company name provided, create/update company
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
            properties: ['name'],
            limit: 1
          });

          let companyId: string;

          if (companySearchResponse.results && companySearchResponse.results.length > 0) {
            companyId = companySearchResponse.results[0].id;
            console.log('🔄 Found existing company:', companyId);
          } else {
            // Create new company
            const createCompanyResponse = await hubspotClient.crm.companies.basicApi.create({
              properties: {
                name: companyName,
              }
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
