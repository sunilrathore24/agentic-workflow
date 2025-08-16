#!/usr/bin/env node
import { WorkflowOrchestrator } from './workflow.orchestrator';
import { AgentConfig } from './types';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function getInput(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  console.log('🤖 AI Content Workflow CLI\n');
  
  const openaiApiKey = await getInput('Enter your OpenAI API Key: ');
  const mediumApiKey = await getInput('Enter your Medium API Key: ');
  const mediumUserId = await getInput('Enter your Medium User ID: ');
  
  const config: AgentConfig = {
    openaiApiKey,
    mediumApiKey,
    mediumUserId
  };

  const orchestrator = new WorkflowOrchestrator(config);
  
  try {
    await orchestrator.execute();
    console.log('\n✅ Workflow completed successfully!');
  } catch (error) {
    console.error('\n❌ Workflow failed:', error);
  } finally {
    rl.close();
  }
}

if (require.main === module) {
  main();
}