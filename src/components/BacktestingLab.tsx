import React, { useState } from 'react';
import { Candle, BacktestResult } from '../types/gold';
import { runStrategyBacktest } from '../utils/goldMarketEngine';
import { 
  History, 
  Play, 
  BarChart, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight,
  Sliders,
  DollarSign
} from 'lucide-react';

interface BacktestingLabProps {
  candles: Candle[];
}

export const BacktestingLab: React.FC<BacktestingLabProps> = ({ candles }) => {
  const [strategy, setStrategy] = useState('EMA 20/50 Golden Cross & Retest');
  const [timeframe, setTimeframe] = useState('5M');
  const [lookback, setLookback] = useState(250);
  const [rrRatio, setRrRatio] = useState(2.5);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<BacktestResult>(() =>
    runStrategyBacktest(candles, 'EMA 20/50 Golden Cross & Retest', '5M', 250, 2.5)
  );

  const strategies = [
    'EMA 20/50 Golden Cross & Retest',
    'RSI Divergence & Exhaustion',
    'Support/Resistance Breakout & Retest',
    '5M Scalper Impulse & Volume Surge',
  ];

  const handleRunBacktest = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = runStrategyBacktest(candles, strategy, timeframe, lookback, rrRatio);
      setResult(res);
      setIsRunning(false);
    }, 400);
  };

  return (
    <div className="bg-[#0e1219] border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-white tracking-wider">
              QUANTITATIVE STRATEGY BACKTESTING LAB
            </h2>
            <p className="text-xs text-zinc-400">
              Verify XAU/USD algorithmic strategies against historical candlestick data before risking capital
            </p>
          </div>
        </div>

        <button
          onClick={handleRunBacktest}
          disabled={isRunning}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs hover:from-amber-400 hover:to-amber-500 transition-all shadow-md shadow-amber-500/25 disabled:opacity-50"
        >
          <Play className={`w-4 h-4 fill-current ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? 'Simulating Strategy...' : 'Execute Backtest'}</span>
        </button>
      </div>

      {/* Control Configuration Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#0a0d14] p-4 rounded-xl border border-zinc-800/80 text-xs">
        <div>
          <label className="text-zinc-400 font-semibold block mb-1.5">Strategy Algorithm</label>
          <select
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
            className="w-full bg-[#131822] border border-zinc-700 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-amber-500"
          >
            {strategies.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-zinc-400 font-semibold block mb-1.5">Candle Timeframe</label>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="w-full bg-[#131822] border border-zinc-700 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-amber-500"
          >
            <option value="1M">1 Minute (Scalp)</option>
            <option value="5M">5 Minute (Intraday Scalp)</option>
            <option value="15M">15 Minute (Intraday)</option>
            <option value="1H">1 Hour (Swing)</option>
          </select>
        </div>

        <div>
          <label className="text-zinc-400 font-semibold block mb-1.5">
            Lookback Bars: <strong className="text-amber-400">{lookback}</strong>
          </label>
          <input
            type="range"
            min="80"
            max="400"
            step="20"
            value={lookback}
            onChange={(e) => setLookback(Number(e.target.value))}
            className="w-full accent-amber-500 mt-2"
          />
        </div>

        <div>
          <label className="text-zinc-400 font-semibold block mb-1.5">Target Risk : Reward</label>
          <select
            value={rrRatio}
            onChange={(e) => setRrRatio(Number(e.target.value))}
            className="w-full bg-[#131822] border border-zinc-700 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-amber-500"
          >
            <option value={1.5}>1 : 1.5 (High Win Rate)</option>
            <option value={2.0}>1 : 2.0 (Balanced)</option>
            <option value={2.5}>1 : 2.5 (GoldPulse Standard)</option>
            <option value={3.0}>1 : 3.0 (Runner Targets)</option>
          </select>
        </div>
      </div>

      {/* Metric Cards Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 font-mono-numbers">
        <div className="bg-[#111620] p-3 rounded-xl border border-zinc-800">
          <span className="text-[10px] text-zinc-400 block uppercase">Win Rate</span>
          <span className="text-xl font-black text-emerald-400 block mt-0.5">
            {result.winRate}%
          </span>
          <span className="text-[10px] text-zinc-500">
            {result.winningTrades}W / {result.losingTrades}L
          </span>
        </div>

        <div className="bg-[#111620] p-3 rounded-xl border border-zinc-800">
          <span className="text-[10px] text-zinc-400 block uppercase">Profit Factor</span>
          <span className="text-xl font-black text-amber-400 block mt-0.5">
            {result.profitFactor}
          </span>
          <span className="text-[10px] text-zinc-500">Gross W / Gross L</span>
        </div>

        <div className="bg-[#111620] p-3 rounded-xl border border-zinc-800">
          <span className="text-[10px] text-zinc-400 block uppercase">Net Profit ($10k base)</span>
          <span className={`text-xl font-black block mt-0.5 ${result.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            +${result.netProfit.toLocaleString()}
          </span>
          <span className="text-[10px] text-emerald-400">+{result.netProfitPercent}%</span>
        </div>

        <div className="bg-[#111620] p-3 rounded-xl border border-zinc-800">
          <span className="text-[10px] text-zinc-400 block uppercase">Max Drawdown</span>
          <span className="text-xl font-black text-rose-400 block mt-0.5">
            {result.maxDrawdown}%
          </span>
          <span className="text-[10px] text-zinc-500">Peak-to-Trough</span>
        </div>

        <div className="bg-[#111620] p-3 rounded-xl border border-zinc-800">
          <span className="text-[10px] text-zinc-400 block uppercase">Avg Trade Win</span>
          <span className="text-xl font-black text-zinc-200 block mt-0.5">
            +${result.avgWin}
          </span>
          <span className="text-[10px] text-zinc-500">Loss: -${result.avgLoss}</span>
        </div>

        <div className="bg-[#111620] p-3 rounded-xl border border-zinc-800">
          <span className="text-[10px] text-zinc-400 block uppercase">Consecutive Wins</span>
          <span className="text-xl font-black text-amber-400 block mt-0.5">
            {result.consecutiveWins}
          </span>
          <span className="text-[10px] text-zinc-500">Best Streak</span>
        </div>
      </div>

      {/* Trade Log Table */}
      <div className="bg-[#0a0d14] rounded-xl border border-zinc-800 overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-xs uppercase tracking-wider text-zinc-300">
              SIMULATED TRADE EXECUTION LOG ({result.trades.length} TRADES)
            </span>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono-numbers">
            Strategy: {result.strategyName}
          </span>
        </div>

        <div className="overflow-x-auto max-h-[360px] overflow-y-auto">
          <table className="w-full text-left text-xs font-mono-numbers">
            <thead className="bg-[#10141f] text-zinc-400 text-[10.5px] uppercase tracking-wider sticky top-0 border-b border-zinc-800">
              <tr>
                <th className="px-4 py-2">Outcome</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Entry Price</th>
                <th className="px-4 py-2">Exit Price</th>
                <th className="px-4 py-2">Gain (Pips)</th>
                <th className="px-4 py-2">PnL ($)</th>
                <th className="px-4 py-2">Trigger Reason</th>
                <th className="px-4 py-2">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {result.trades.map((t) => {
                const isWin = t.outcome === 'WIN';
                return (
                  <tr key={t.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-4 py-2.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          isWin
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        }`}
                      >
                        {isWin ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {t.outcome}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-bold">
                      <span className={t.type === 'BUY' ? 'text-emerald-400' : 'text-rose-400'}>
                        {t.type}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">${t.entryPrice.toFixed(2)}</td>
                    <td className="px-4 py-2.5">${t.exitPrice.toFixed(2)}</td>
                    <td className="px-4 py-2.5">
                      <span className={isWin ? 'text-emerald-400 font-bold' : 'text-rose-400'}>
                        {isWin ? '+' : ''}{t.pnlPips} pips
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`font-bold ${isWin ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isWin ? '+' : ''}${t.pnl.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-zinc-400 text-[11px] truncate max-w-xs" title={t.reason}>
                      {t.reason}
                    </td>
                    <td className="px-4 py-2.5 text-zinc-500 text-[11px]">
                      {t.entryTime} → {t.exitTime}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
