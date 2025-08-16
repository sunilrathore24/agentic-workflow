import fetch from 'node-fetch';
import * as https from 'https';

interface CodyMessage {
  speaker: 'human' | 'assistant';
  text: string;
}

export class SourcegraphClient {
  private apiUrl: string;
  private apiKey: string;
  private agent: https.Agent;

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
    this.agent = new https.Agent({
      rejectUnauthorized: false,
    });
  }

  async sendPrompt(prompt: string, systemPrompt?: string): Promise<string> {
    try {
      const messages: CodyMessage[] = [];
      
      if (systemPrompt) {
        messages.push({
          speaker: 'assistant',
          text: systemPrompt
        });
      }
      
      messages.push({
        speaker: 'human',
        text: prompt
      });

      const response = await fetch(this.apiUrl, {
        agent: this.agent,
        method: 'POST',
        headers: {
          Authorization: `token ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          temperature: 0.2,
          topK: -1,
          topP: -1,
          maxTokensToSample: 2000,
          messages: messages,
        }),
      });

      if (response.status !== 200) {
        throw new Error(`Sourcegraph API error: ${response.status}`);
      }

      const data = await response.text();
      return this.parseStreamingResponse(data);
    } catch (error) {
      console.error('Error calling Sourcegraph API:', error);
      throw error;
    }
  }

  private parseStreamingResponse(data: string): string {
    const regex = /event: (\w+)\s+data: (\{.*?\})(?=\s*event:|\s*$)/gs;
    let match;
    const events = [];

    while ((match = regex.exec(data)) !== null) {
      const eventType = match[1];
      const eventData = JSON.parse(match[2]);
      events.push({ event: eventType, data: eventData });
    }

    const completionEvents = events.filter(
      (event) => event.event === 'completion'
    );

    const secondLastCompletionEvent =
      completionEvents[completionEvents.length - 2];

    if (secondLastCompletionEvent?.data?.completion) {
      return secondLastCompletionEvent.data.completion;
    }

    throw new Error('No completion found in Sourcegraph response');
  }
}