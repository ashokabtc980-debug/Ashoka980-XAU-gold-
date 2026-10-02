import React, { useState } from 'react';
import { SignalItem } from '../types/gold';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldAlert, 
  ChevronRight,
  Sparkles,
  TrendingUp,
  Percent
} from 'lucide-react';

interface SignalsPanelProps {
  signals: SignalItem[];
  selectedSignal: SignalItem | null;
  onSelectSignal: (sig: SignalItem) => void;
  onOpenSignalScore: (sig: SignalItem) => void;
  onQuickTrade: (sig: SignalItem) => void;
  onLoadIntoCalculator: (sig: SignalItem) => void;
}

export const SignalsPanel: React.FC<SignalsPanelProps> = ({
  signals,
  selectedSignal,
  onSelectSignal,
  onOpenSignalScore,
  onQuickTrade,
  onLoadIntoCalculator,
}) => {
  const [filterTimeframe, setFilterTimeframe] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredSignals = signals.filter((s) => {
    if (filterTimeframe === 'ALL') return true;
    return s.timeframe === filterTimeframe;
  });

  const handleCopySignal = (e: React.MouseEvent, signal: SignalItem) => {
    e.stopPropagation();
    const formatted = `🥇 XAU/USD ${signal.action} SIGNAL [${signal.timeframe}]
Strategy: ${signal.strategy}
🎯 Entry Zone: ${signal.entryZone}
🛑 Stop-Loss: $${signal.stopLoss.toFixed(2)}
🎯 Take-Profit 1: $${signal.tp1.toFixed(2)}
🎯 Take-Profit 2: $${signal.tp2.toFixed(2)}
🎯 Take-Profit 3: $${signal.tp3.toFixed(2)}
⚖️ Risk:Reward: ${signal.riskReward}
📊 Signal Score: ${signal.signalScore.scoreTotal}/100 [${signal.signalScore.verdict}]
⚡ Confidence: ${signal.confidence}%
via GoldPulse AI (Institutional Precious Metals Desk)`;

    navigator.clipboard.writeText(formatted);
    setCopiedId(signal.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-[#0e1219] border border-zinc-800 rounded-2xl p-4 shadow-xl flex flex-col h-full">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <h2 className="font-display font-bold text-sm tracking-wider text-white">
            LIVE XAU/USD SIGNALS &amp; ALERTS
          </h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono-numbers font-semibold">
            {signals.filter((s) => s.status === 'ACTIVE').length} ACTIVE
          </span>
        </div>

        {/* Timeframe Filter Pills */}
        <div className="flex items-center bg-[#090c12] p-0.5 rounded-lg border border-zinc-800 text-[11px] font-mono-numbers">
          {['ALL', '1M', '5M', '15M', '1H'].map((tf) => (
            <button
              key={tf}
              onClick={() => setFilterTimeframe(tf)}
              className={`px-2 py-0.5 rounded font-semibold transition-all ${
                filterTimeframe === tf ? 'bg-amber-500 text-black shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Signal Cards Feed */}
      <div className="mt-3 space-y-3 overflow-y-auto max-h-[620px] pr-1">
        {filteredSignals.map((sig) => {
          const isSelected = selectedSignal?.id === sig.id;
          const isBuy = sig.action.includes('BUY');
          const isStrong = sig.action.includes('STRONG');

          return (
            <div
              key={sig.id}
              onClick={() => onSelectSignal(sig)}
              className={`relative rounded-xl p-3.5 border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#151c27] border-amber-500/70 shadow-lg shadow-amber-500/10'
                  : 'bg-[#111620] border-zinc-800/80 hover:border-zinc-700 hover:bg-[#131924]'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold ${
                      isBuy
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    }`}
                  >
                    {isBuy ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-sm tracking-wide text-white">
                        {sig.action}
                      </span>
                      <span className="text-[10px] font-mono-numbers px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-semibold border border-zinc-700">
                        {sig.timeframe}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {sig.strategy}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-500">
                      {new Date(sig.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • XAU/USD
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="text-right">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      sig.status === 'ACTIVE'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : sig.status.includes('HIT_TP')
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {sig.status.replace('_', ' ')}
                  </span>
                  <div className="mt-1 flex items-center justify-end gap-1 text-[11px] font-mono-numbers text-amber-400 font-bold">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>{sig.confidence}% Conf.</span>
                  </div>
                </div>
              </div>

              {/* Targets and Stop Loss Grid */}
              <div className="grid grid-cols-4 gap-2 mt-3 pt-2.5 border-t border-zinc-800/80 font-mono-numbers text-[11px]">
                <div className="bg-[#0b0e14] p-1.5 rounded-lg border border-zinc-800/60">
                  <span className="text-[9px] text-zinc-500 block uppercase">Entry Zone</span>
                  <span className="font-bold text-zinc-200 truncate block text-[10.5px]">{sig.entryZone}</span>
                </div>
                <div className="bg-[#0b0e14] p-1.5 rounded-lg border border-zinc-800/60">
                  <span className="text-[9px] text-rose-400/80 block uppercase">Stop Loss</span>
                  <span className="font-bold text-rose-400 block">${sig.stopLoss.toFixed(1)}</span>
                </div>
                <div className="bg-[#0b0e14] p-1.5 rounded-lg border border-zinc-800/60">
                  <span className="text-[9px] text-emerald-400/80 block uppercase">TP1 Target</span>
                  <span className="font-bold text-emerald-400 block">${sig.tp1.toFixed(1)}</span>
                </div>
                <div className="bg-[#0b0e14] p-1.5 rounded-lg border border-zinc-800/60">
                  <span className="text-[9px] text-zinc-500 block uppercase">Risk : Reward</span>
                  <span className="font-bold text-amber-400 block">{sig.riskReward}</span>
                </div>
              </div>

              {/* The Signature Feature: Signal Score Pill Button */}
              <div className="mt-3 flex items-center justify-between gap-2 bg-[#090d14] px-2.5 py-1.5 rounded-lg border border-amber-500/20">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-zinc-400 font-semibold">SIGNAL SCORE:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold font-mono-numbers text-amber-400">
                      {sig.signalScore.scoreTotal}/100
                    </span>
                    <span className="text-[9.5px] px-1 py-0.2 rounded bg-amber-500/15 text-amber-300 font-medium">
                      {sig.signalScore.verdict}
                    </span>
                  </div>
                </div>

                {/* Score Breakdown preview chips */}
                <div className="flex items-center gap-1 text-[10px]">
                  <span title={sig.signalScore.trend.label} className={sig.signalScore.trend.passed ? 'text-emerald-400' : 'text-zinc-500'}>
                    Trend {sig.signalScore.trend.passed ? '✅' : '⚠️'}
                  </span>
                  <span title={sig.signalScore.ema.label} className={sig.signalScore.ema.passed ? 'text-emerald-400' : 'text-zinc-500'}>
                    EMA {sig.signalScore.ema.passed ? '✅' : '⚠️'}
                  </span>
                  <span title={sig.signalScore.macd.label} className={sig.signalScore.macd.passed ? 'text-emerald-400' : 'text-zinc-500'}>
                    MACD {sig.signalScore.macd.passed ? '✅' : '⚠️'}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenSignalScore(sig);
                  }}
                  className="text-[10px] font-bold text-amber-400 hover:text-amber-300 underline flex items-center gap-0.5"
                >
                  <span>Why?</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Action Toolbar */}
              <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-zinc-800/60 text-xs">
                <button
                  onClick={(e) => handleCopySignal(e, sig)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 transition-colors text-[11px] font-medium"
                  title="Copy signal text formatted for Telegram / WhatsApp"
                >
                  {copiedId === sig.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Signal</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLoadIntoCalculator(sig);
                    }}
                    className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-amber-500/30 text-[11px] font-medium transition-colors"
                  >
                    Risk Calc
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickTrade(sig);
                    }}
                    className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-black font-bold text-[11px] transition-all shadow-md shadow-amber-500/20"
                  >
                    Paper Trade
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
