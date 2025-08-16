# AI Content Curation Workflow

An intelligent multi-agent system powered by Sourcegraph Cody AI for discovering, analyzing, and curating AI-related content from dev.to.

## Features

- **ResearcherAgent**: Automatically scrapes dev.to for AI-related articles
- **AnalystAgent**: Uses Cody AI to analyze and select the most relevant content
- **SummarizerAgent**: Creates engaging summaries and descriptions
- **EditorAgent**: Polishes content for maximum engagement
- **PublisherAgent**: Simulates publishing to Medium

## Tech Stack

- TypeScript
- Node.js
- Sourcegraph Cody AI
- Cheerio (web scraping)
- Axios (HTTP requests)

## Setup

1. Clone the repository
2. Install dependencies: \`npm install\`
3. Set up environment variables in \`.env\`
4. Run the workflow: \`npm start\`

## Configuration

Create a \`.env\` file with:
\`\`\`
SOURCEGRAPH_API_URL=your_sourcegraph_api_url
CODY_API_KEY=your_cody_api_key
\`\`\`

## Usage

The workflow automatically:
1. Searches for AI-related articles
2. Analyzes content relevance
3. Generates optimized titles and descriptions
4. Prepares content for publication

Built with ❤️ and Sourcegraph Cody AI
