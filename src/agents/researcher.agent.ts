import axios from 'axios';
import * as cheerio from 'cheerio';
import { BaseAgent, ScraperOutput, ScrapedResult, AgentConfig } from '../types';

export class ResearcherAgent extends BaseAgent {
  constructor(config: AgentConfig) {
    super(config);
  }

  async execute(): Promise<ScraperOutput> {
    try {
      console.log('🔍 Researcher Agent: Searching dev.to for AI content...');
      
      // Try the main dev.to feed with AI tag instead of search
      const feedUrl = 'https://dev.to/t/ai';
      const response = await axios.get(feedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        }
      });

      console.log(`Response status: ${response.status}`);
      console.log(`Response content length: ${response.data.length}`);
      
      const $ = cheerio.load(response.data);
      
      // Debug: Check what content we actually received
      const mainContent = $('#main-content, .crayons-layout__content, #substories').length;
      console.log(`Found main content containers: ${mainContent}`);
      
      // Count total articles found
      const totalArticles = $('.crayons-story').length;
      console.log(`Total crayons-story elements found: ${totalArticles}`);
      
      const results: ScrapedResult[] = [];

      $('.crayons-story').slice(0, 5).each((index, element) => {
        // Try multiple possible selectors for title
        let titleElement = $(element).find('h3.crayons-story__title a');
        if (titleElement.length === 0) {
          titleElement = $(element).find('.crayons-story__title a');
        }
        if (titleElement.length === 0) {
          titleElement = $(element).find('h2 a, h3 a').first();
        }
        
        const title = titleElement.text().trim();
        const relativeUrl = titleElement.attr('href');
        
        // Fix URL construction - avoid double prefix
        let url = '';
        if (relativeUrl) {
          if (relativeUrl.startsWith('http')) {
            url = relativeUrl;
          } else {
            url = `https://dev.to${relativeUrl.startsWith('/') ? '' : '/'}${relativeUrl}`;
          }
        }
        
        console.log(`Article ${index + 1}: Title="${title}", URL="${url}"`);
        
        // Get tags as snippet
        const tags = $(element).find('.crayons-story__tags .crayons-tag').map((i, el) => {
          return $(el).text().replace('#', '');
        }).get().join(', ');
        
        // Fallback to reading time info
        const readTime = $(element).find('.crayons-story__tertiary.fs-xs, .crayons-story__bottom .crayons-story__tertiary').text().trim();
        const snippet = tags || readTime || 'No preview available';

        if (title && url) {
          results.push({
            title,
            url,
            snippet: snippet.substring(0, 200) + (snippet.length > 200 ? '...' : '')
          });
        }
      });

      console.log(`✅ Found ${results.length} articles`);
      
      // If no results, let's try a fallback approach
      if (results.length === 0) {
        console.log('🔄 No results found, trying fallback approach...');
        return await this.fallbackScrape();
      }
      
      return { results };
    } catch (error) {
      console.error('❌ Researcher Agent Error:', error);
      throw new Error(`Failed to scrape dev.to: ${error}`);
    }
  }

  private async fallbackScrape(): Promise<ScraperOutput> {
    try {
      // Try the homepage and look for AI-related articles
      const response = await axios.get('https://dev.to', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      const $ = cheerio.load(response.data);
      const results: ScrapedResult[] = [];

      $('.crayons-story').each((index, element) => {
        const titleElement = $(element).find('h3.crayons-story__title a, h2 a, .crayons-story__title a').first();
        const title = titleElement.text().trim();
        const relativeUrl = titleElement.attr('href');
        
        // Fix URL construction here too
        let url = '';
        if (relativeUrl) {
          if (relativeUrl.startsWith('http')) {
            url = relativeUrl;
          } else {
            url = `https://dev.to${relativeUrl.startsWith('/') ? '' : '/'}${relativeUrl}`;
          }
        }
        
        // Only include if title contains AI-related keywords
        if (title.toLowerCase().includes('ai') || 
            title.toLowerCase().includes('artificial intelligence') || 
            title.toLowerCase().includes('machine learning') ||
            title.toLowerCase().includes('ml')) {
          
          const tags = $(element).find('.crayons-story__tags .crayons-tag').map((i, el) => {
            return $(el).text().replace('#', '');
          }).get().join(', ');
          
          const readTime = $(element).find('.crayons-story__tertiary.fs-xs').text().trim();
          const snippet = tags || readTime || 'No preview available';

          results.push({
            title,
            url,
            snippet: snippet.substring(0, 200) + (snippet.length > 200 ? '...' : '')
          });
        }
      });

      return { results: results.slice(0, 5) };
    } catch (error) {
      console.error('❌ Fallback scrape failed:', error);
      return { results: [] };
    }
  }
}