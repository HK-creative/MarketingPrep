#!/usr/bin/env node

// Task Master MCP Server - AI Features Demo
// This script demonstrates the AI-enhanced capabilities powered by Google Gemini

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function demoAIFeatures() {
  console.log('🚀 Task Master MCP Server - AI Features Demo');
  console.log('============================================');
  console.log('🤖 Powered by Google Gemini AI\n');

  try {
    // Check if server is running
    console.log('🔍 Checking server status...');
    const healthCheck = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Server is healthy:', healthCheck.data);
    
    await delay(1000);

    // Demo 1: Show current task statistics
    console.log('\n📊 Current Task Statistics:');
    console.log('----------------------------');
    const stats = await axios.get(`${BASE_URL}/stats`);
    console.log(`📋 Total Tasks: ${stats.data.total}`);
    console.log(`⏳ Pending: ${stats.data.pending}`);
    console.log(`🚧 Started: ${stats.data.started}`);
    console.log(`✅ Done: ${stats.data.done}`);
    
    await delay(2000);

    // Demo 2: AI-powered task analysis
    console.log('\n🧠 AI-Powered Task Analysis:');
    console.log('------------------------------');
    const analysis = await axios.get(`${BASE_URL}/analysis`);
    console.log('📝 Summary:', analysis.data.summary);
    console.log('\n🎯 Next Actions:');
    analysis.data.nextActions.forEach((action, index) => {
      console.log(`   ${index + 1}. ${action}`);
    });
    
    await delay(2000);

    // Demo 3: AI recommendations
    console.log('\n💡 AI Recommendations:');
    console.log('----------------------');
    const recommendations = await axios.get(`${BASE_URL}/recommendations`);
    recommendations.data.recommendations.forEach((rec, index) => {
      console.log(`   🎯 ${index + 1}. ${rec}`);
    });
    
    await delay(2000);

    console.log('\n🎉 Demo completed successfully!');
    console.log('\n🌟 Key AI Features Demonstrated:');
    console.log('   ✨ Smart task analysis with contextual insights');
    console.log('   🧠 AI-powered recommendations for productivity');
    console.log('   📊 Intelligent task statistics and patterns');
    console.log('   🤖 Natural language processing for task management');
    
    console.log('\n🔧 To test task creation with AI enhancement:');
    console.log('   Use the MCP tools through Cursor or Claude Desktop');
    console.log('   Example: "Create a task to build a marketing website"');
    console.log('   The AI will automatically enhance, categorize, and prioritize!');
    
  } catch (error) {
    console.error('❌ Error during demo:', error.message);
    console.log('\n🔧 Make sure the server is running:');
    console.log('   bun run start:http');
  }
}

// Run the demo
demoAIFeatures(); 