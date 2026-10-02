import React, { useState } from 'react';
import { Candle, IndicatorsState, SignalItem } from '../types/gold';
import { GoldChart } from './GoldChart';
import { Zap, ArrowUpRight, ArrowDownRight, Clock, Flame, ShieldAlert, Target } from 'lucide-react';

interface ScalpingDeskProps {
  candles: Candle[];
  indicators: IndicatorsState;
  currentPrice: number;
  signals: SignalItem[];
  onQuickTrade: (sig: SignalItem) => void;
  onOpenSignalScore: (sig: SignalItem) => void;
}

export const ScalpingDesk: React.FC<ScalpingDeskProps> = ({
  candles,
  indicators,
  currentPrice,
  signals,
  onQuickTrade,
  onOpenSignalScore,
}) => {
  const [scalpTf, setScalpTf] = useState<'1M' | '5M' | '15M' | '1H' | '4H' | '1D'>('1M');

  const scalpSignals = signals.filter(
    (s) => s.timeframe === '1M' || s.timeframe === '5M' || s.strategy === 'Scalp Momentum'
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500/15 via-[#131924] to-amber-500/10 border border-amber-500/30 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-black flex items-center justify-center font-black shadow-lg shadow-amber-500/25">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-lg text-white tracking-wider">
                ULTRA-FAST SCALPING DESK (1M / 5M / 15M)
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-black font-black uppercase tracking-wider">
                HIGH FREQUENCY
              </span>
            </div>
            <p className="text-xs text-zinc-300">
              Low latency impulse detection, micro order block bounces, and tight spread scalping for XAU/USD
            </p>
          </div>
        </div>

        {/* Scalp Quick Switch Timeframes */}
        <div className="flex items-center bg-[#0a0d14] p-1 rounded-xl border border-zinc-700">
          {(['1M', '5M', '15M'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setScalpTf(tf)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono-numbers font-bold transition-all ${
                scalpTf === tf ? 'bg-amber-500 text-black shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tf} SCALP
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Chart for Scalping */}
        <div className="lg:col-span-8">
          <GoldChart
            candles={candles}
            indicators={indicators}
            selectedSignal={scalpSignals[0] || null}
            timeframe={scalpTf}
            setTimeframe={setScalpTf}
            currentPrice={currentPrice}
          />
        </div>

        {/* Scalping Feed & Tape */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#0e1219] border border-zinc-800 rounded-2xl p-4 shadow-xl flex flex-col h-full">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>SCALPING SETUPS</span>
              </div>
              <span className="text-[10px] text-zinc-400 font-mono-numbers">
                Fast ATR: {indicators.atr.toFixed(2)}
              </span>
            </div>

            <div className="space-y-3 mt-3 overflow-y-auto max-h-[460px] pr-1">
              {scalpSignals.map((sig) => (
                <div
                  key={sig.id}
                  className="bg-[#121622] border border-zinc-800 rounded-xl p-3.5 hover:border-amber-500/50 transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-display text-white">{sig.action}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono-numbers font-semibold">
                        {sig.timeframe}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono-numbers text-amber-400 font-bold">
                      Score: {sig.signalScore.scoreTotal}/100
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 font-mono-numbers text-[10px] bg-[#090c12] p-2 rounded-lg border border-zinc-800/80">
                    <div>
                      <span className="text-zinc-500 block">ENTRY</span>
                      <span className="font-bold text-zinc-200">${sig.entryPrice.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-rose-400/80 block">SL</span>
                      <span className="font-bold text-rose-400">${sig.stopLoss.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-emerald-400/80 block">TP1</span>
                      <span className="font-bold text-emerald-400">${sig.tp1.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => onOpenSignalScore(sig)}
                      className="text-[11px] text-amber-400 hover:underline font-semibold"
                    >
                      Why this setup?
                    </button>
                    <button
                      onClick={() => onQuickTrade(sig)}
                      className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-black text-[11px] font-bold transition-all shadow-sm shadow-amber-500/20"
                    >
                      Instant Scalp
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
