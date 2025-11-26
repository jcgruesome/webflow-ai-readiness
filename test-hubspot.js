import { Client } from '@hubspot/api-client';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const token = process.env.HUBSPOT_ACCESS_TOKEN;

if (!token) {
  console.error('❌ Error: HUBSPOT_ACCESS_TOKEN not found in environment variables');
  console.error('   Please add HUBSPOT_ACCESS_TOKEN to your .env file');
  console.error('   Example: HUBSPOT_ACCESS_TOKEN=your_token_here');
  process.exit(1);
}

async function testHubSpot() {
  try {
    const hubspotClient = new Client({ accessToken: token });
    
    console.log('🔍 Testing HubSpot connection...\n');
    
    // Test 1: Get account info
    console.log('Test 1: Fetching account info...');
    try {
      const accountInfo = await hubspotClient.apiRequest({
        method: 'GET',
        path: '/account-info/v3/api-usage/daily'
      });
      console.log('✅ Successfully connected to HubSpot!');
      console.log('   Account verified\n');
    } catch (error) {
      console.error('❌ Failed to get account info:', error.message);
    }
    
    // Test 2: Test contact creation with sample data
    console.log('Test 2: Creating test contact...');
    const testEmail = `test-${Date.now()}@reshapex-test.com`;
    
    const contactProperties = {
      email: testEmail,
      firstname: 'Test',
      lastname: 'User',
      jobtitle: 'Test Manager',
      company: 'Test Company Inc',
      company_name: 'Test Company Inc',
      company_size: '50-249',
      annual_revenue: '$1M-$10M',
      role_title: 'Test Manager',
      primary_pain: 'Manual processes',
      existing_automation: 'No',
      tech_stack: 'Salesforce; Excel',
      estimated_ai_budget_2026: '$50k-$150k',
      decision_timeline: '3-6mo',
      open_ended_pain: 'Testing the integration',
      readiness_score: 75,
      assess_band: 'High',
      assessment_form_completed_at: new Date().toISOString(),
      is_corporate_email: 'No'
    };
    
    try {
      const contactResponse = await hubspotClient.crm.contacts.basicApi.create({
        properties: contactProperties,
        associations: []
      });
      
      console.log('✅ Test contact created successfully!');
      console.log(`   Contact ID: ${contactResponse.id}`);
      console.log(`   Email: ${testEmail}\n`);
      
      // Clean up - delete the test contact
      console.log('Cleaning up test contact...');
      await hubspotClient.crm.contacts.basicApi.archive(contactResponse.id);
      console.log('✅ Test contact deleted\n');
      
    } catch (error) {
      console.error('❌ Failed to create contact:', error.message);
      if (error.body) {
        console.error('   Details:', JSON.stringify(error.body, null, 2));
      }
    }
    
    console.log('🎉 HubSpot integration test complete!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testHubSpot();
