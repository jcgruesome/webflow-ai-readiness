/**
 * Test script to verify assessment question mapping
 * This validates that our question IDs match the HubSpot property names
 */

import { readFileSync } from 'fs';

// Load the HubSpot properties from the fetch output
const hubspotPropsRaw = readFileSync('./hubspot-properties.json', 'utf-8');
const lines = hubspotPropsRaw.split('\n');
const jsonStartIndex = lines.findIndex(line => line.trim() === '[');
const jsonContent = lines.slice(jsonStartIndex).join('\n');
const hubspotProps = JSON.parse(jsonContent);

// Extract our question IDs from AssessmentQuiz.tsx
const assessmentQuizContent = readFileSync('./src/components/AssessmentQuiz.tsx', 'utf-8');
const questionIdMatches = assessmentQuizContent.match(/id:\s*['"]([^'"]+)['"]/g);
const ourQuestionIds = questionIdMatches
  .map(match => match.match(/id:\s*['"]([^'"]+)['"]/)[1])
  .filter(id => !['firstname', 'lastname', 'email', 'company'].includes(id)); // Exclude standard contact fields

// Get HubSpot assessment property names
const hubspotPropertyNames = hubspotProps
  .filter(prop => !['ae_hot_flag', 'ai_readiness_score', 'assessment_completed_date'].includes(prop.name))
  .map(prop => prop.name);

console.log('\n📋 Assessment Question Mapping Validation\n');
console.log('━'.repeat(60));

console.log('\n✅ Our Question IDs:');
ourQuestionIds.forEach(id => console.log(`   - ${id}`));

console.log('\n✅ HubSpot Property Names:');
hubspotPropertyNames.forEach(name => console.log(`   - ${name}`));

console.log('\n🔍 Validation Results:\n');

// Check for matches
const matched = [];
const missing = [];

ourQuestionIds.forEach(id => {
  if (hubspotPropertyNames.includes(id)) {
    matched.push(id);
    console.log(`   ✅ ${id} - MATCHED`);
  } else {
    missing.push(id);
    console.log(`   ❌ ${id} - NOT FOUND IN HUBSPOT`);
  }
});

// Check for extra HubSpot properties not used
const unused = hubspotPropertyNames.filter(name => !ourQuestionIds.includes(name));

if (unused.length > 0) {
  console.log('\n⚠️  HubSpot properties not used in assessment:');
  unused.forEach(name => console.log(`   - ${name}`));
}

console.log('\n━'.repeat(60));
console.log('\n📊 Summary:');
console.log(`   Questions mapped: ${matched.length}/${ourQuestionIds.length}`);
console.log(`   Missing mappings: ${missing.length}`);
console.log(`   Unused HubSpot properties: ${unused.length}`);

if (missing.length === 0 && unused.length === 0) {
  console.log('\n✅ Perfect! All questions are correctly mapped to HubSpot properties.\n');
} else if (missing.length === 0) {
  console.log('\n✅ All questions mapped, but some HubSpot properties are unused.');
  console.log('   This is okay if those properties are for internal use only.\n');
} else {
  console.log('\n❌ Some questions are not mapped to HubSpot properties!');
  console.log('   Please update the question IDs or create the properties in HubSpot.\n');
}
