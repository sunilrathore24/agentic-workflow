import { AnalystOutput, SummarizerOutput, AgentConfig, BaseAgent } from '../types';
import { SourcegraphClient } from '../workflow/utils/sourcegraph-client';
import axios from 'axios';
import * as cheerio from 'cheerio';

export class SummarizerAgent extends BaseAgent {
  private sourcegraph: SourcegraphClient;

  constructor(config: AgentConfig) {
    super(config);
    this.sourcegraph = new SourcegraphClient(config.sourcegraphApiUrl, config.codyApiKey);
  }

  async execute(input: AnalystOutput): Promise<SummarizerOutput> {
    console.log('✍️ Summarizer Agent: Creating summary with Cody...');

    try {
      const articleContent = await this.scrapeArticleContent(input.selected.url);
      
      const systemPrompt = `You are Cody, an AI-powered content summarizer created by Sourcegraph. Create engaging titles and descriptions for technical articles. You MUST respond with only valid JSON format.`;

      const prompt = `Create an engaging title and description for this article:

Original Title: ${input.selected.title}
URL: ${input.selected.url}
Content Preview: ${articleContent}

Respond with ONLY this JSON format (no other text):
{
  "title": "engaging new title",
  "description": "compelling description (max 150 characters)"
}`;

      const response = await this.sourcegraph.sendPrompt(prompt, systemPrompt);
      
      // Try to extract JSON from the response
      let summary;
      try {
        // First try parsing as pure JSON
        summary = JSON.parse(response);
      } catch (jsonError) {
        // If that fails, try to extract JSON from the response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          summary = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Could not extract valid JSON from response');
        }
      }

      console.log(`✅ Generated summary: ${summary.title}`);
      return summary;
    } catch (error) {
      console.error('❌ Summarizer Agent Error:', error);
      
      // Fallback summary
      return {
        title: `AI Insights: ${input.selected.title}`,
        description: `Exploring ${input.selected.title} - valuable insights for developers working with AI and modern technology.`
      };
    }
  }

  private async scrapeArticleContent(url: string): Promise<string> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const $ = cheerio.load(response.data);
      const content = $('.crayons-article__body').text() || 
                     $('article').text() || 
                     $('.article-body').text() ||
                     $('main').text();
      
      return content.trim().substring(0, 500);
    } catch (error) {
      return `Content about: ${url}`;
    }
  }
}