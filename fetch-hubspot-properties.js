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

async function fetchProperties() {
  try {
    const hubspotClient = new Client({ accessToken: token });
    
    console.log('🔍 Fetching HubSpot contact properties...\n');
    
    // Fetch all contact properties
    const response = await hubspotClient.crm.properties.coreApi.getAll('contacts');
    
    // Filter for "AI Readiness Assessment" group
    const assessmentProperties = response.results.filter(prop => 
      prop.groupName === 'AI Readiness Assessment' || 
      prop.groupName === 'ai_readiness_assessment'
    );
    
    console.log(`Found ${assessmentProperties.length} properties in "AI Readiness Assessment" group:\n`);
    
    assessmentProperties.forEach(prop => {
      console.log(`\n📌 ${prop.label}`);
      console.log(`   Internal Name: ${prop.name}`);
      console.log(`   Type: ${prop.type}`);
      console.log(`   Field Type: ${prop.fieldType}`);
      
      if (prop.options && prop.options.length > 0) {
        console.log(`   Options:`);
        prop.options.forEach(opt => {
          console.log(`      - ${opt.label} (value: ${opt.value})`);
        });
      }
      
      if (prop.description) {
        console.log(`   Description: ${prop.description}`);
      }
    });
    
    // Output as JSON for easier parsing
    console.log('\n\n📄 JSON Output:\n');
    console.log(JSON.stringify(assessmentProperties.map(prop => ({
      label: prop.label,
      name: prop.name,
      type: prop.type,
      fieldType: prop.fieldType,
      options: prop.options?.map(opt => ({ label: opt.label, value: opt.value })) || []
    })), null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.body) {
      console.error('Details:', JSON.stringify(error.body, null, 2));
    }
  }
}

fetchProperties();
