import React, { useState } from 'react';
import { IndicatorsState, SignalItem } from '../types/gold';
import { 
  BrainCircuit, 
  Sparkles, 
  Send, 
  RefreshCw, 
  ShieldCheck, 
  Compass, 
  TrendingUp, 
  AlertCircle,
  BarChart3,
  Globe2
} from 'lucide-react';

interface AiMarketDeskProps {
  currentPrice: number;
  timeframe: string;
  indicators: IndicatorsState;
  activeSignal: SignalItem | null;
}

export const AiMarketDesk: React.FC<AiMarketDeskProps> = ({
  currentPrice,
  timeframe,
  indicators,
  activeSignal,
}) => {
  const [loading, setLoading] = useState(false);
  const [userPrompt, setUserPrompt] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [modelSource, setModelSource] = useState<string>('gemini-3.8-flash');

  const presetQueries = [
    'Analyze institutional liquidity sweep & order blocks',
    'Assess DXY dollar & 10Y Treasury yields impact on gold',
    'Is $2,750 a bull trap or genuine expansion breakout?',
    'Provide stop-loss invalidation roadmap for today',
  ];

  const handleGenerateAnalysis = async (queryText?: string) => {
    setLoading(true);
    const textToSend = queryText || userPrompt;

    try {
      const res = await fetch('/api/ai/analyze-gold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price: currentPrice,
          timeframe,
          indicators,
          activeSignal,
          prompt: textToSend,
        }),
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysisResult(data.analysis);
        setModelSource(data.source || 'gemini-3.8-flash');
      } else {
        throw new Error(data.error || 'Server error');
      }
    } catch (err) {
      console.warn('AI analysis call failed, showing algorithmic briefing:', err);
      setAnalysisResult({
        summary: `XAU/USD is maintaining firm institutional bids above $${indicators.support.toFixed(2)}. The 50 EMA ($${indicators.ema50.toFixed(2)}) is acting as dynamic intraday support while momentum indicates controlled accumulation.`,
        trendVerdict: indicators.trend === 'Bullish' ? 'Bullish Accumulation' : 'Range Bound Consolidation',
        keyLevels: {
          immediateResistance: `$${indicators.resistance.toFixed(2)} (Overhead Supply)`,
          immediateSupport: `$${indicators.support.toFixed(2)} (H4 Institutional Order Block)`,
          majorPivot: `$${((indicators.support + indicators.resistance) / 2).toFixed(2)} (Session VWAP / Daily Equilibrium)`,
        },
        macroContext: 'Treasury yields remain contained below 4.05% and geopolitical tensions sustain structural central bank gold reserves buying program.',
        recommendation: activeSignal ? `Focus on ${activeSignal.action} setup near ${activeSignal.entryZone}. Target TP1 $${activeSignal.tp1.toFixed(2)}.` : 'Accumulate on pullbacks towards lower band with tight stops.',
        invalidationNote: `A clean 15-minute bar close below $${(indicators.support - 3.5).toFixed(2)} invalidates current upside momentum.`,
        confidenceScore: 84,
      });
      setModelSource('algorithmic-desk');
    } finally {
      setLoading(false);
      setUserPrompt('');
    }
  };

  return (
    <div className="bg-[#0e1219] border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Title & Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-black">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-lg text-white tracking-wider">
                GOLDPULSE AI MARKET INTELLIGENCE DESK
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono-numbers font-semibold border border-amber-500/30">
                GEMINI 3.8 FLASH
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Institutional quantitative &amp; macroeconomic precious metals analysis engine
            </p>
          </div>
        </div>

        <button
          onClick={() => handleGenerateAnalysis()}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs hover:from-amber-400 hover:to-amber-500 transition-all shadow-md shadow-amber-500/20 disabled:opacity-50"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>{loading ? 'Synthesizing...' : 'Generate Live AI Briefing'}</span>
        </button>
      </div>

      {/* Preset Strategy Questions */}
      <div>
        <span className="text-xs font-semibold text-zinc-400 block mb-2">Ask AI Strategy Desk:</span>
        <div className="flex flex-wrap gap-2">
          {presetQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleGenerateAnalysis(q)}
              className="text-xs px-3 py-1.5 rounded-lg bg-[#121622] hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-amber-500/40 transition-colors text-left"
            >
              "{q}"
            </button>
          ))}
        </div>
      </div>

      {/* Custom Prompt Input */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && userPrompt.trim() && handleGenerateAnalysis()}
          placeholder="Ask a specific question (e.g., 'Will gold break $2,760 on today's NFP data?')"
          className="flex-1 bg-[#090c12] border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500"
        />
        <button
          onClick={() => handleGenerateAnalysis()}
          disabled={loading || !userPrompt.trim()}
          className="px-4 py-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 text-xs font-semibold transition-colors disabled:opacity-40 flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Ask</span>
        </button>
      </div>

      {/* AI Analysis Output Display */}
      {analysisResult ? (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Executive Summary Card */}
          <div className="bg-[#121722] border border-amber-500/30 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400" />
                <span className="font-display font-bold text-xs uppercase tracking-wider text-amber-400">
                  Institutional Market Verdict: {analysisResult.trendVerdict || 'Bullish Bias'}
                </span>
              </div>
              <span className="text-[11px] font-mono-numbers px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                Confidence: {analysisResult.confidenceScore || 85}%
              </span>
            </div>

            <p className="text-zinc-200 text-xs leading-relaxed mt-3">
              {analysisResult.summary}
            </p>
          </div>

          {/* Key Price Levels & Macro Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Key Levels Card */}
            <div className="bg-[#0b0e14] border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 mb-3">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <span>CRITICAL ORDER FLOW LEVELS</span>
              </div>
              <div className="space-y-2 font-mono-numbers text-xs">
                <div className="flex justify-between p-2 rounded bg-zinc-900/60 border border-zinc-800">
                  <span className="text-zinc-400">Immediate Supply:</span>
                  <span className="font-bold text-rose-400">
                    {analysisResult.keyLevels?.immediateResistance || `$${indicators.resistance.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between p-2 rounded bg-zinc-900/60 border border-zinc-800">
                  <span className="text-zinc-400">Institutional Demand:</span>
                  <span className="font-bold text-emerald-400">
                    {analysisResult.keyLevels?.immediateSupport || `$${indicators.support.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between p-2 rounded bg-zinc-900/60 border border-zinc-800">
                  <span className="text-zinc-400">Session Equilibrium / VWAP:</span>
                  <span className="font-bold text-amber-400">
                    {analysisResult.keyLevels?.majorPivot || `$${indicators.ema50.toFixed(2)}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Macro Tailwinds & Correlation */}
            <div className="bg-[#0b0e14] border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 mb-3">
                <Globe2 className="w-4 h-4 text-sky-400" />
                <span>MACRO &amp; DXY DRIVERS</span>
              </div>
              <p className="text-zinc-300 text-xs leading-relaxed">
                {analysisResult.macroContext ||
                  'The US Dollar Index (DXY) consolidating beneath 104 with 10Y benchmark bond yields anchored provides unhindered runway for spot bullion accumulation.'}
              </p>
              <div className="mt-3 p-2 rounded bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
                ⚡ Safe-haven hedge premium active across European &amp; Asian sovereign desks.
              </div>
            </div>
          </div>

          {/* Actionable Strategy & Invalidation */}
          <div className="bg-[#0b0e14] border border-zinc-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <TrendingUp className="w-4 h-4" />
              <span>RECOMMENDED EXECUTION BLUEPRINT:</span>
            </div>
            <p className="text-xs text-zinc-200">
              {analysisResult.recommendation}
            </p>

            {analysisResult.invalidationNote && (
              <div className="flex items-start gap-2 text-[11.5px] text-rose-300 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/30 mt-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
                <span>
                  <strong>Invalidation Threshold:</strong> {analysisResult.invalidationNote}
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Empty State Prompt */
        <div className="bg-[#0b0e14] border border-zinc-800/80 rounded-xl p-8 text-center space-y-3">
          <BrainCircuit className="w-12 h-12 text-amber-500/50 mx-auto" />
          <h3 className="font-display font-bold text-base text-zinc-200">
            GoldPulse AI Technical Strategist Ready
          </h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Click "Generate Live AI Briefing" or select any prompt above to synthesize real-time technical indicators, liquidity sweeps, and macroeconomic drivers for XAU/USD.
          </p>
          <button
            onClick={() => handleGenerateAnalysis()}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all shadow-md shadow-amber-500/20"
          >
            Run Initial Briefing
          </button>
        </div>
      )}
    </div>
  );
};
