const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000';

async function runTests() {
  let token = '';
  let allPassed = true;

  console.log('--- TEST 1: Login ---');
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'demo@creatorverse.ai', password: 'demo123' })
    });
    const data = await res.json();
    console.log('Response:', data);
    if (res.ok && data.token) {
      token = data.token;
      console.log('✅ PASS\n');
    } else {
      console.log('❌ FAIL: No token in response or status not OK\n');
      allPassed = false;
    }
  } catch (err) {
    console.log('❌ FAIL:', err.message, '\n');
    allPassed = false;
  }

  console.log('--- TEST 2: AI Chat ---');
  try {
    const res = await fetch(`${BASE_URL}/api/ai/chat`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message: 'what should I post today?' })
    });
    
    // Read raw text first in case it's not JSON
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
      console.log('Response:', data);
    } catch (e) {
      console.log('Response (Raw Text):', text);
      throw new Error('Response was not valid JSON');
    }

    if (res.ok && data.success && data.reply) {
      console.log('✅ PASS\n');
    } else {
      console.log('❌ FAIL: Missing success/reply in response or status not OK\n');
      allPassed = false;
    }
  } catch (err) {
    console.log('❌ FAIL:', err.message, '\n');
    allPassed = false;
  }

  console.log('--- TEST 3: AI Recommendations ---');
  try {
    const res = await fetch(`${BASE_URL}/api/ai/recommendations`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    });
    
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
      console.log('Response:', data);
    } catch (e) {
      console.log('Response (Raw Text):', text);
      throw new Error('Response was not valid JSON');
    }

    if (res.ok && data.success && data.recommendations) {
      console.log('✅ PASS\n');
    } else {
      console.log('❌ FAIL: Missing recommendations or status not OK\n');
      allPassed = false;
    }
  } catch (err) {
    console.log('❌ FAIL:', err.message, '\n');
    allPassed = false;
  }

  console.log('--- TEST 4: Health Check ---');
  try {
    const res = await fetch(`${BASE_URL}/health`);
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
      console.log('Response:', data);
    } catch (e) {
      console.log('Response (Raw Text):', text);
      throw new Error('Response was not valid JSON');
    }
    
    // Let's accept `{ status: "ok" }` or any JSON with a success message for health, just in case
    if (res.ok) {
      console.log('✅ PASS\n');
    } else {
      console.log('❌ FAIL: Status not ok\n');
      allPassed = false;
    }
  } catch (err) {
    console.log('❌ FAIL:', err.message, '\n');
    allPassed = false;
  }
}

runTests();
