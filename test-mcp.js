// Simple test script to demonstrate Task Master MCP functionality
const { spawn } = require('child_process');

async function testMCPServer() {
  console.log('🚀 Task Master MCP Server Test');
  console.log('================================');
  
  // Start the MCP server
  const mcp = spawn('node', ['dist/index.js'], {
    stdio: ['pipe', 'pipe', 'inherit']
  });
  
  // Test listTasks
  console.log('\n📋 Testing listTasks...');
  const listRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: {
      name: 'listTasks',
      arguments: {}
    }
  };
  
  mcp.stdin.write(JSON.stringify(listRequest) + '\n');
  
  // Test createTask
  console.log('\n✅ Testing createTask...');
  const createRequest = {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/call',
    params: {
      name: 'createTask',
      arguments: {
        task: 'Test task from script',
        category: 'Testing',
        priority: 'high'
      }
    }
  };
  
  mcp.stdin.write(JSON.stringify(createRequest) + '\n');
  
  // Handle responses
  mcp.stdout.on('data', (data) => {
    const response = data.toString();
    console.log('📨 Response:', response);
  });
  
  // Close after 5 seconds
  setTimeout(() => {
    mcp.kill();
    console.log('\n🏁 Test completed');
  }, 5000);
}

// Run the test
testMCPServer().catch(console.error); 