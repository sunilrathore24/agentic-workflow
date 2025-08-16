import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { WorkflowOrchestrator } from './workflow.orchestrator';
import { AgentConfig, PublisherOutput } from './types';

@Injectable({
  providedIn: 'root'
})
export class AIContentWorkflowService {
  constructor(private http: HttpClient) {}

  /**
   * Execute the complete workflow
   * @param config Agent configuration with API keys
   * @returns Observable of the workflow result
   */
  executeWorkflow(config: AgentConfig): Observable<PublisherOutput> {
    const orchestrator = new WorkflowOrchestrator(config);
    
    return from(
      orchestrator.execute().then(() => ({
        medium_post_url: 'Success - check console for details',
        success: true,
        message: 'Workflow completed successfully'
      })).catch(error => ({
        medium_post_url: '',
        success: false,
        message: error.message
      }))
    );
  }

  /**
   * Execute individual agent for testing
   * @param agentType The type of agent to execute
   * @param config Agent configuration
   * @param input Input data for the agent
   */
  executeIndividualAgent(
    agentType: 'researcher' | 'analyst' | 'summarizer' | 'editor' | 'publisher',
    config: AgentConfig,
    input?: any
  ): Observable<any> {
    // Implementation would depend on your specific needs
    // This is a simplified version
    return new Observable(observer => {
      observer.next({ status: 'Individual agent execution not implemented in this example' });
      observer.complete();
    });
  }
}