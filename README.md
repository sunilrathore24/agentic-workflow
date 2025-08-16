# AI Content Curation Workflow

A TypeScript-based multi-agent system that automatically curates AI content from dev.to and publishes it to Medium.

## 🏗️ Architecture

The system consists of 5 specialized agents:

1. **Researcher Agent** - Scrapes dev.to for AI-related content
2. **Analyst Agent** - Selects the best article from search results
3. **Summarizer Agent** - Creates a compelling summary using OpenAI
4. **Editor Agent** - Polishes content for SEO and readability
5. **Publisher Agent** - Publishes to Medium via API

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Build the project:**
   ```bash
   npm run build
   ```

4. **Run the workflow:**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

You need the following API keys:

- **OpenAI API Key**: Get from [OpenAI Dashboard](https://platform.openai.com/api-keys)
- **Medium API Key**: Get from [Medium Settings](https://medium.com/me/settings)
- **Medium User ID**: Get from Medium API or profile URL

## 🎯 Usage in Angular

```typescript
import { AIContentWorkflowService } from './path-to-service';

export class YourComponent {
  constructor(private workflowService: AIContentWorkflowService) {}

  async runWorkflow() {
    const config = {
      openaiApiKey: 'your-key',
      mediumApiKey: 'your-key', 
      mediumUserId: 'your-id'
    };

    this.workflowService.executeWorkflow(config).subscribe({
      next: (result) => console.log('Success:', result),
      error: (error) => console.error('Error:', error)
    });
  }
}
```

## 📋 Features

- ✅ Web scraping with error handling
- ✅ AI-powered content analysis
- ✅ Automatic content summarization
- ✅ SEO optimization
- ✅ Medium API integration
- ✅ Comprehensive logging
- ✅ TypeScript support
- ✅ Angular service integration

## 🛠️ Extending the System

You can easily add new agents by extending the `BaseAgent` class:

```typescript
export class YourCustomAgent extends BaseAgent {
  async execute(input: any): Promise<any> {
    // Your agent logic here
  }
}
```

## 📝 License

MIT License
```

Let's also add the build script to complete the setup:

```bash
echo '{"scripts": {"postinstall": "npm run build"}}' > package.json && npm install
```

Let me update the package.json properly:

```bash
cat > package.json << 'EOF'
{
  "name": "ai-content-workflow",
  "version": "1.0.0",
  "description": "Multi-agent AI content curation and publishing workflow",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts",
    "cli": "ts-node src/cli.ts",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": ["ai", "automation", "content", "medium", "agents"],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "axios": "^1.6.0",
    "cheerio": "^1.0.0-rc.12",
    "openai": "^4.0.0",
    "@types/node": "^20.0.0",
    "@types/cheerio": "^0.22.0",
    "typescript": "^5.0.0",
    "ts-node": "^10.0.0",
    "dotenv": "^16.0.0"
  },
  "devDependencies": {
    "@types/axios": "^0.14.0"
  }
}
EOF
```

## 🎉 Summary

I've created a complete TypeScript-based multi-agent workflow system for you that includes:

### **Core Features:**
- **5 Specialized Agents** with clear responsibilities
- **Type-safe TypeScript** implementation
- **Angular Integration Service** for your app
- **CLI Interface** for testing
- **Error handling** and logging
- **Modular architecture** for easy extension

### **Key Files Created:**
- `src/types/index.ts` - Type definitions
- `src/agents/*` - Individual agent implementations
- `src/workflow.orchestrator.ts` - Main orchestrator
- `src/angular-integration.service.ts` - Angular service
- `src/cli.ts` - Command-line interface

### **To Get Started:**

1. **Set up your environment:**
   ```bash
   cp .env.example .env
   # Add your API keys
   ```

2. **Build and run:**
   ```bash
   npm run build
   npm run dev