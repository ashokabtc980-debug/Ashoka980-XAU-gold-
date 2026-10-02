import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI SDK safely
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API: AI Market Intelligence Analysis for XAU/USD
app.post('/api/ai/analyze-gold', async (req, res) => {
  try {
    const { price, timeframe, indicators, activeSignal, prompt } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback response if key isn't configured
      return res.json({
        success: true,
        source: 'algorithmic-desk',
        analysis: {
          summary: `XAU/USD currently consolidating near $${price || '2,742.30'}. Multi-timeframe structure demonstrates institutional absorption above $2,735 key support.`,
          trendVerdict: indicators?.trend || 'Bullish Bias',
          keyLevels: {
            immediateResistance: '$2,755.80 (Weekly Supply / Liquidity Pool)',
            immediateSupport: '$2,738.50 (H4 Order Block)',
            majorPivot: '$2,746.00 (Daily VWAP)',
          },
          macroContext: 'US Dollar Index (DXY) softening towards 103.8 while 10-Year Treasury Yields flatten, creating favorable tailwinds for unhedged gold long positions.',
          recommendation: activeSignal ? `${activeSignal.type} Zone between ${activeSignal.entryZone}` : 'Watch for dip accumulation into $2,738 - $2,742 with tight invalidation.',
          invalidationNote: 'Break and 15m close below $2,733 cancels immediate bullish momentum.',
          confidenceScore: 84,
        },
      });
    }

    const systemPrompt = `You are the Lead Senior Precious Metals Quant & Chief Technical Strategist for "GoldPulse AI", specializing exclusively in XAU/USD (Gold vs US Dollar).
Analyze the current gold market data provided by the user. Evaluate technical structure (EMA 20/50/200, RSI, MACD, Bollinger Bands, ATR, Market Structure Breaks, Liquidity Sweeps) alongside macroeconomic drivers (Fed interest rate trajectory, DXY index, Treasury yields, central bank reserve accumulation, geopolitical risk).
Provide a concise, ultra-professional institutional trading desk briefing in JSON format with actionable, realistic, and risk-managed execution parameters. Do not output markdown codeblocks, only valid raw JSON.`;

    const userQuery = `Current XAU/USD Market State:
- Price: $${price || 2742.50}
- Timeframe: ${timeframe || '15M'}
- Indicator Snapshot: ${JSON.stringify(indicators || {})}
- Active Signal Setup: ${JSON.stringify(activeSignal || {})}
- Trader specific question: ${prompt || 'Provide full multi-timeframe analysis and signal validation.'}

Generate response with this JSON structure:
{
  "summary": string,
  "trendVerdict": string,
  "keyLevels": {
    "immediateResistance": string,
    "immediateSupport": string,
    "majorPivot": string
  },
  "macroContext": string,
  "recommendation": string,
  "invalidationNote": string,
  "confidenceScore": number,
  "indicatorsBreakdown": {
    "trend": string,
    "emaStatus": string,
    "rsiStatus": string,
    "macdStatus": string,
    "volatilityAtr": string,
    "newsRisk": string
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userQuery,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '{}';
    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      parsed = { summary: rawText };
    }

    return res.json({
      success: true,
      source: 'gemini-3.8-flash',
      analysis: parsed,
    });
  } catch (error: any) {
    console.error('Error in /api/ai/analyze-gold:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to generate AI analysis',
    });
  }
});

// API: Economic Calendar & Gold-Specific News Alerts
app.get('/api/news/economic-calendar', (_req, res) => {
  const events = [
    {
      id: 'nfp-1',
      title: 'US Non-Farm Payrolls (NFP) & Unemployment Rate',
      time: '12:30 UTC',
      date: 'Today',
      impact: 'HIGH',
      forecast: '+165K',
      previous: '+142K',
      goldBias: 'Consensus beat -> Bearish Gold (DXY spike); Miss -> Bullish Gold breakout target $2,760',
      category: 'Employment',
    },
    {
      id: 'cpi-2',
      title: 'US Core Consumer Price Index (CPI YoY)',
      time: 'Tomorrow, 12:30 UTC',
      date: 'Oct 3',
      impact: 'HIGH',
      forecast: '3.2%',
      previous: '3.2%',
      goldBias: 'Persistent inflation reinforces gold as premier monetary hedge.',
      category: 'Inflation',
    },
    {
      id: 'fomc-3',
      title: 'FOMC Member Speech on Rate Cut Path',
      time: '16:00 UTC',
      date: 'Today',
      impact: 'MEDIUM',
      forecast: 'Dovish tone',
      previous: 'Neutral',
      goldBias: 'Dovish comments lower real yields, bolstering bullion demand.',
      category: 'Central Bank',
    },
    {
      id: 'pce-4',
      title: 'Core PCE Price Index (MoM)',
      time: 'Friday, 12:30 UTC',
      date: 'Oct 5',
      impact: 'HIGH',
      forecast: '0.2%',
      previous: '0.2%',
      goldBias: 'Fed primary inflation gauge; critical for next 25bps vs 50bps pricing.',
      category: 'Inflation',
    },
    {
      id: 'geo-5',
      title: 'Middle East & Global Geopolitical Security Update',
      time: 'Ongoing',
      date: 'Live Feed',
      impact: 'HIGH',
      forecast: 'Safe Haven Demand',
      previous: 'Elevated',
      goldBias: 'Heightened defense readiness keeps long institutional bids firm.',
      category: 'Geopolitics',
    },
  ];

  res.json({ success: true, events });
});

// Start server with Vite middleware in dev or static files in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`GoldPulse AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
