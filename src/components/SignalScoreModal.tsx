import React from 'react';
import { SignalItem } from '../types/gold';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, Activity, Target } from 'lucide-react';

interface SignalScoreModalProps {
  signal: SignalItem | null;
  onClose: () => void;
  onTradeNow: (sig: SignalItem) => void;
}

export const SignalScoreModal: React.FC<SignalScoreModalProps> = ({
  signal,
  onClose,
  onTradeNow,
}) => {
  if (!signal) return null;

  const score = signal.signalScore;
  const isBuy = signal.action.includes('BUY');

  const criteria = [
    {
      name: 'Trend Direction & Market Structure',
      status: score.trend.status,
      passed: score.trend.passed,
      label: score.trend.label,
      points: score.trend.points,
      maxPoints: 20,
    },
    {
      name: 'EMA 20 / 50 / 200 Moving Average Alignment',
      status: score.ema.status,
      passed: score.ema.passed,
      label: score.ema.label,
      points: score.ema.points,
      maxPoints: 20,
    },
    {
      name: 'RSI (14) Momentum & Exhaustion Filter',
      status: `RSI: ${score.rsi.value}`,
      passed: score.rsi.passed,
      label: score.rsi.label,
      points: score.rsi.points,
      maxPoints: 15,
    },
    {
      name: 'MACD (12, 26, 9) Momentum & Crossover',
      status: score.macd.status,
      passed: score.macd.passed,
      label: score.macd.label,
      points: score.macd.points,
      maxPoints: 15,
    },
    {
      name: 'Key Support / Resistance Order Block Zone',
      status: score.supportResistance.status,
      passed: score.supportResistance.passed,
      label: score.supportResistance.label,
      points: score.supportResistance.points,
      maxPoints: 15,
    },
    {
      name: 'Macro News & Economic Calendar Risk Filter',
      status: score.newsRisk.level,
      passed: score.newsRisk.passed,
      label: score.newsRisk.label,
      points: score.newsRisk.points,
      maxPoints: 15,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0f141d] border border-amber-500/30 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden text-zinc-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0a0d14] border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Activity className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base text-white tracking-wider">
                  TRANSPARENT SIGNAL SCORE
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 font-mono-numbers text-amber-400 border border-zinc-700">
                  {signal.timeframe}
                </span>
              </div>
              <p className="text-xs text-zinc-400">Verifiable indicators behind the {signal.action} recommendation</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Big Score Summary Banner */}
          <div className="bg-gradient-to-br from-[#151c27] to-[#10151f] p-4 rounded-xl border border-amber-500/30 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                Composite Algorithmic Score
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-mono-numbers text-4xl font-black text-amber-400">
                  {score.scoreTotal}
                </span>
                <span className="text-sm font-semibold text-zinc-400 font-mono-numbers">/ 100</span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono-numbers">
                  SETUP: {score.verdict}
                </span>
                <span className="text-xs text-zinc-400 font-mono-numbers">
                  Confidence: {signal.confidence}%
                </span>
              </div>
            </div>

            {/* Visual Gauge Meter */}
            <div className="w-24 h-24 relative flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-zinc-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-amber-500 transition-all duration-1000 ease-out"
                  strokeDasharray={`${score.scoreTotal}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xs font-mono-numbers font-bold text-white">
                  {score.scoreTotal}%
                </span>
              </div>
            </div>
          </div>

          {/* Breakdown Matrix List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center justify-between">
              <span>Why We Generated This Setup:</span>
              <span className="text-[11px] font-normal text-zinc-500">No black box. 100% rule-based.</span>
            </h4>

            <div className="space-y-2.5">
              {criteria.map((c, idx) => (
                <div
                  key={idx}
                  className="bg-[#0b0e14] p-3 rounded-xl border border-zinc-800/80 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5">
                      {c.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-zinc-200">{c.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-mono-numbers">
                          {c.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">{c.label}</p>
                    </div>
                  </div>

                  <div className="text-right font-mono-numbers whitespace-nowrap">
                    <span className={`font-bold ${c.passed ? 'text-emerald-400' : 'text-amber-400'}`}>
                      +{c.points}
                    </span>
                    <span className="text-zinc-600 text-[10px]"> / {c.maxPoints}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rationale and Execution parameters */}
          <div className="bg-[#0b0e14] p-3.5 rounded-xl border border-zinc-800 text-xs">
            <span className="font-semibold text-amber-400 block mb-1">Execution Guidance:</span>
            <p className="text-zinc-300 leading-relaxed text-[11.5px]">{signal.rationale}</p>

            <div className="mt-3 pt-2.5 border-t border-zinc-800/80 grid grid-cols-3 gap-2 font-mono-numbers text-[11px]">
              <div>
                <span className="text-zinc-500 text-[9px] block">STOP-LOSS</span>
                <span className="text-rose-400 font-bold">${signal.stopLoss.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-zinc-500 text-[9px] block">TP1 (CONSERVATIVE)</span>
                <span className="text-emerald-400 font-bold">${signal.tp1.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-zinc-500 text-[9px] block">TP3 (RUNNER TARGET)</span>
                <span className="text-emerald-400 font-bold">${signal.tp3.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#0a0d14] border-t border-zinc-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors"
          >
            Close Breakdown
          </button>

          <button
            onClick={() => {
              onTradeNow(signal);
              onClose();
            }}
            className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
          >
            <span>Execute Paper Trade</span>
            <Target className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
