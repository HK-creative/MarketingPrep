// Test script to demonstrate AI-enhanced Task Master MCP features
const { spawn } = require('child_process');

async function testAIFeatures() {
  console.log('🤖 Task Master MCP with Google Gemini AI - Feature Test');
  console.log('=======================================================');
  
  // Start the MCP server
  const mcp = spawn('node', ['dist/index.js'], {
    stdio: ['pipe', 'pipe', 'inherit'],
    env: { ...process.env, GEMINI_API_KEY: 'AIzaSyA8mIuzOpcmO_dVmkAFn0xP3vdk0hNaMJA' }
  });
  
  let responseCount = 0;
  
  // Test 1: Create an AI-enhanced task
  console.log('\n✨ Test 1: Creating AI-enhanced task...');
  const createRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: {
      name: 'createTask',
      arguments: {
        task: 'build marketing website'
      }
    }
  };
  
  mcp.stdin.write(JSON.stringify(createRequest) + '\n');
  
  // Test 2: Get AI task analysis
  setTimeout(() => {
    console.log('\n🧠 Test 2: Getting AI task analysis...');
    const analysisRequest = {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: 'getTaskAnalysis',
        arguments: {}
      }
    };
    
    mcp.stdin.write(JSON.stringify(analysisRequest) + '\n');
  }, 3000);
  
  // Test 3: Get AI recommendations
  setTimeout(() => {
    console.log('\n🎯 Test 3: Getting AI recommendations...');
    const recommendationsRequest = {
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: 'getTaskRecommendations',
        arguments: {}
      }
    };
    
    mcp.stdin.write(JSON.stringify(recommendationsRequest) + '\n');
  }, 6000);
  
  // Handle responses
  mcp.stdout.on('data', (data) => {
    const response = data.toString();
    console.log('\n📨 AI Response:', response);
    responseCount++;
    
    if (responseCount >= 3) {
      setTimeout(() => {
        mcp.kill();
        console.log('\n🎉 AI Feature Test Completed!');
        console.log('\n🌟 Features demonstrated:');
        console.log('  • AI-enhanced task creation with smart categorization');
        console.log('  • Intelligent task analysis and insights');
        console.log('  • AI-powered recommendations for next actions');
        console.log('  • Powered by Google Gemini AI');
      }, 2000);
    }
  });
  
  mcp.on('error', (error) => {
    console.error('Error:', error);
  });
}

// Run the test
testAIFeatures().catch(console.error); 