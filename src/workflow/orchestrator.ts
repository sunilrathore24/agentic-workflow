
import { ResearcherAgent } from '../agents/researcher.agent';
import { AnalystAgent } from '../agents/analyst.agent';
import { SummarizerAgent } from '../agents/summarizer.agent';
import { EditorAgent } from '../agents/editor.agent';
import { PublisherAgent } from '../agents/publisher.agent';
import { AgentConfig } from '../types';

export class WorkflowOrchestrator {
  private config: AgentConfig;
  
  constructor(config: AgentConfig) {
    this.config = config;
  }

  async execute(): Promise<void> {
    console.log('🚀 Starting AI Content Curation Workflow powered by Sourcegraph Cody...\n');

    try {
      // Step 1: Research
      const researcher = new ResearcherAgent(this.config);
      const scrapedData = await researcher.execute();
      console.log('Step 1 completed ✅\n');

      // Step 2: Analysis with Cody
      const analyst = new AnalystAgent(this.config);
      const selectedArticle = await analyst.execute(scrapedData);
      console.log('Step 2 completed ✅\n');

      // Step 3: Summarization with Cody
      const summarizer = new SummarizerAgent(this.config);
      const summary = await summarizer.execute(selectedArticle);
      console.log('Step 3 completed ✅\n');

      // Step 4: Editing with Cody
      const editor = new EditorAgent(this.config);
      const editedContent = await editor.execute(summary);
      console.log('Step 4 completed ✅\n');

      // Step 5: Publishing
      const publisher = new PublisherAgent(this.config);
      const publishResult = await publisher.execute(editedContent);
      console.log('Step 5 completed ✅\n');

      if (publishResult.success) {
        console.log('🎉 Workflow completed successfully with Sourcegraph Cody!');
        console.log(`📝 Published Article: ${publishResult.medium_post_url}`);
      } else {
        console.log('⚠️ Workflow completed with publishing issues:');
        console.log(`❌ ${publishResult.message}`);
      }

    } catch (error) {
      console.error('💥 Workflow failed:', error);
      throw error;
    }
  }
}