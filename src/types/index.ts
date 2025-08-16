export interface ScrapedResult {
  title: string;
  url: string;
  snippet: string;
}

export interface ScraperOutput {
  results: ScrapedResult[];
}

export interface AnalystOutput {
  selected: {
    title: string;
    url: string;
    reason: string;
  };
}

export interface SummarizerOutput {
  title: string;
  description: string;
}

export interface EditorOutput {
  final_title: string;
  final_description: string;
}

export interface PublisherOutput {
  medium_post_url: string;
  success: boolean;
  message?: string;
}

export interface AgentConfig {
  codyApiKey: string;
  sourcegraphApiUrl: string;
  mediumApiKey: string;
  mediumUserId: string;
}

export abstract class BaseAgent {
  protected config: AgentConfig;
  
  constructor(config: AgentConfig) {
    this.config = config;
  }
  
  abstract execute(input?: any): Promise<any>;
}