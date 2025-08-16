import { BaseAgent, ScraperOutput, AnalystOutput, AgentConfig } from '../types';
import { SourcegraphClient } from '../workflow/utils/sourcegraph-client';

export class AnalystAgent extends BaseAgent {
  private sourcegraph: SourcegraphClient;

  constructor(config: AgentConfig) {
    super(config);
    this.sourcegraph = new SourcegraphClient(config.sourcegraphApiUrl, config.codyApiKey);
  }

  async execute(input: ScraperOutput): Promise<AnalystOutput> {
    console.log('📊 Analyst Agent: Analyzing articles with Cody...');

    if (!input.results || input.results.length === 0) {
      throw new Error('No articles to analyze');
    }

    try {
      const systemPrompt = `You are Cody, an AI-powered content analyst created by Sourcegraph. Analyze the provided articles and select the most relevant one for AI developers. You MUST respond with only valid JSON format.`;

      const articlesText = input.results.map((article, index) => 
        `${index + 1}. Title: ${article.title}\n   URL: ${article.url}\n   Snippet: ${article.snippet}\n`
      ).join('\n');

      const prompt = `Analyze these AI-related articles and select the most relevant one for developers:

${articlesText}

Select the best article. Respond with ONLY this JSON format (no other text):
{
  "selected": {
    "title": "selected article title",
    "url": "selected article url", 
    "reason": "explanation for selection"
  }
}`;

      const response = await this.sourcegraph.sendPrompt(prompt, systemPrompt);
      
      // Try to extract JSON from the response
      let analysis;
      try {
        // First try parsing as pure JSON
        analysis = JSON.parse(response);
      } catch (jsonError) {
        // If that fails, try to extract JSON from the response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Could not extract valid JSON from response');
        }
      }

      console.log(`✅ Selected article: ${analysis.selected.title}`);
      return analysis;
    } catch (error) {
      console.error('❌ Analyst Agent Error:', error);
      
      // Fallback selection
      const selected = input.results[0];
      return {
        selected: {
          title: selected.title,
          url: selected.url,
          reason: 'Selected first article as fallback due to analysis error'
        }
      };
    }
  }
}