# DalaiLLMA - LLM Conversation Sentiment Dashboard

<p align="center">
  <img src="dalaillma-logo.png" alt="DalaiLLMA Logo" width="100%">
</p>

A personal analytics dashboard that visualizes sentiment, wellbeing, and patterns from your Claude and ChatGPT conversation history.

## Features

- **Sentiment Tracking**: Monitor emotional tone over time (hopeful vs despair language)
- **Wellbeing Score**: Composite metric combining sentiment, agency, and other indicators
- **Word Clouds**: Visual representation of frequent topics per month
- **People Analysis**: Track who you discuss and associated sentiment
- **Category Breakdown**: See what topics dominate your conversations (work, relationships, mental health, etc.)
- **Events Timeline**: Significant life events extracted from conversations
- **Drama Triangle**: Karpman triangle analysis (victim/persecutor/rescuer patterns)
- **Victim vs Empowered Language**: Track agency in your communication patterns
- **LLM Insights**: AI-generated deeper analysis using Claude API (parallel processing)

## Quick Start

### 1. Export your data

**Claude.ai:**
- Go to Settings → Export data
- Download and extract the zip
- Find `conversations.json` in the export

**ChatGPT:**
- Go to Settings → Data controls → Export data
- Wait for email, download and extract
- Find the conversations zip in `User Online Activity/`

### 2. Setup

```bash
git clone https://github.com/kryptokommunist/dalaillma
cd dalaillma
npm install

# Create data directories
mkdir -p "private_data/llm data/anthropic data"
mkdir -p "private_data/llm data/OpenAI-export/User Online Activity"

# Copy your exports:
# - Claude: Copy conversations.json to "private_data/llm data/anthropic data/"
# - ChatGPT: Copy the Conversations__*.zip to "private_data/llm data/OpenAI-export/User Online Activity/"
```

### 3. Process data (basic analysis - no API needed)

```bash
cd private_data
node process_data.js
```

This generates `dashboard_data.json` with:
- Sentiment scores (keyword-based)
- Word frequencies
- People mentions
- Event detection
- Drama triangle patterns

### 4. Run LLM analysis (optional - requires API)

For deeper AI-generated insights using parallel processing:

```bash
# Set your Anthropic API credentials
export ANTHROPIC_BASE_URL="https://api.anthropic.com/"
export ANTHROPIC_AUTH_TOKEN="your-api-key"
export ANTHROPIC_MODEL="claude-3-sonnet-20240229"

# Run parallel analysis (5 concurrent requests)
cd private_data
node analyze_all.js

# Or force re-analysis of all months
node analyze_all.js --force
```

This generates:
- `category_analysis.json` - Message categorization per month
- `llm_insights.json` - Overall patterns and recommendations
- `person_insights.json` - Relationship analysis for mentioned people

**Processing time**: ~5 minutes for 30 months with parallel processing (vs ~30 min sequential)

### 5. Update word cloud data

After processing, update the dashboard word cloud:

```bash
node update_wordcloud.js
```

### 6. View dashboard

```bash
cd ..  # back to repo root
npx serve . -p 3000

# Open http://localhost:3000/private_data/sentiment_dashboard_personal.html
```

## File Structure

```
dalaillma/
├── README.md
├── dalaillma-logo.png
├── sentiment_dashboard.html      # Template (no data)
├── package.json
├── verify_dashboard.js           # Playwright tests
└── private_data/                 # Your personal data (gitignored)
    ├── llm data/
    │   ├── anthropic data/
    │   │   └── conversations.json
    │   └── OpenAI-export/
    │       └── User Online Activity/
    │           └── Conversations__*.zip
    ├── process_data.js           # Basic analysis (no API)
    ├── analyze_all.js            # Parallel LLM analysis
    ├── update_wordcloud.js       # Update dashboard word data
    ├── generate_categories.js    # Category analysis only
    ├── generate_person_insights.js
    ├── dashboard_data.json       # Generated: basic stats
    ├── category_analysis.json    # Generated: LLM categories
    ├── llm_insights.json         # Generated: LLM insights
    ├── person_insights.json      # Generated: relationship analysis
    └── sentiment_dashboard_personal.html  # Your dashboard
```

## Analysis Scripts

| Script | API Required | Description |
|--------|-------------|-------------|
| `process_data.js` | No | Basic sentiment analysis using keyword matching |
| `analyze_all.js` | Yes | Full parallel LLM analysis pipeline |
| `generate_categories.js` | Yes | Category classification only |
| `generate_person_insights.js` | Yes | People relationship analysis |
| `update_wordcloud.js` | No | Update dashboard word cloud from processed data |

## Parallel Processing

The `analyze_all.js` script runs analysis in 4 phases:

1. **Phase 1: Monthly Analysis** - Processes all months in parallel (5 concurrent)
   - Category classification
   - Victim vs empowered language
   - Monthly insights

2. **Phase 2: Aggregation** - Combines results and calculates totals

3. **Phase 3: People Analysis** - Analyzes relationships in parallel

4. **Phase 4: Overall Insights** - Generates patterns and recommendations

## Environment Variables

```bash
# Required for LLM analysis
export ANTHROPIC_BASE_URL="https://api.anthropic.com/"  # Or your proxy
export ANTHROPIC_AUTH_TOKEN="your-api-key"
export ANTHROPIC_MODEL="claude-3-sonnet-20240229"       # Or other model
```

## Data Privacy

- **All processing happens locally** - no data sent to external servers except Anthropic API
- Personal data stays in `private_data/` which is gitignored
- Never commit conversation exports, API keys, or generated insights to public repos
- The template dashboard (`sentiment_dashboard.html`) contains no personal data

## Testing

Verify dashboard loads correctly with Playwright:

```bash
npm install playwright
node verify_dashboard.js
```

## License

MIT
