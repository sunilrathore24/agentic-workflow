
import { BaseAgent, SummarizerOutput, EditorOutput, AgentConfig  } from '../types';
import { SourcegraphClient } from '../workflow/utils/sourcegraph-client';

export class EditorAgent extends BaseAgent {
  private sourcegraph: SourcegraphClient;

  constructor(config: AgentConfig) {
    super(config);
    this.sourcegraph = new SourcegraphClient(config.sourcegraphApiUrl, config.codyApiKey);
  }

  async execute(input: SummarizerOutput): Promise<EditorOutput> {
    console.log('✏️ Editor Agent: Polishing content with Cody...');

    try {
      const systemPrompt = `You are Cody, an AI-powered content editor created by Sourcegraph. Polish and optimize content for maximum engagement while maintaining technical accuracy. You MUST respond with only valid JSON format.`;

      const prompt = `Polish this content for publication:

Title: ${input.title}
Description: ${input.description}

Improve the title and description for better engagement. Ensure the description is under 200 characters.

Respond with ONLY this JSON format (no other text):
{
  "final_title": "polished engaging title",
  "final_description": "optimized description under 200 chars"
}`;

      const response = await this.sourcegraph.sendPrompt(prompt, systemPrompt);
      
      // Try to extract JSON from the response
      let edited;
      try {
        // First try parsing as pure JSON
        edited = JSON.parse(response);
      } catch (jsonError) {
        // If that fails, try to extract JSON from the response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          edited = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Could not extract valid JSON from response');
        }
      }

      console.log(`✅ Content polished: ${edited.final_title}`);
      return edited;
    } catch (error) {
      console.error('❌ Editor Agent Error:', error);
      
      // Fallback editing
      let final_title = input.title;
      let final_description = input.description;

      if (!final_title.includes('🚀')) {
        final_title = `🚀 ${final_title}`;
      }

      if (final_description.length > 200) {
        final_description = final_description.substring(0, 197) + '...';
      }

      return { final_title, final_description };
    }
  }
}
