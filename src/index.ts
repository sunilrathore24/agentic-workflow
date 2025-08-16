import * as dotenv from 'dotenv';
import { WorkflowOrchestrator } from './workflow/orchestrator';

// Load environment variables
dotenv.config();

async function main() {
  console.log('🤖 Starting AI Content Workflow powered by Sourcegraph Cody...\n');
  
  const config = {
    codyApiKey: process.env.CODY_ACCESS_TOKEN || 'demo-key',
    sourcegraphApiUrl: process.env.SOURCEGRAPH_API_URL || 'https://laxtst-insg-001.office.cyberu.com/.api/completions/stream?api-version=1&client-name=web&client-version=0.0.1',
    mediumApiKey: process.env.MEDIUM_API_KEY || 'demo-key', 
    mediumUserId: process.env.MEDIUM_USER_ID || 'demo-user'
  };

  const orchestrator = new WorkflowOrchestrator(config);
  await orchestrator.execute();
}

if (require.main === module) {
  main().catch(console.error);
}

export type { AgentConfig } from './types';
export { WorkflowOrchestrator } from './workflow/orchestrator';