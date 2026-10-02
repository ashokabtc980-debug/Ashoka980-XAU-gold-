import React from 'react';
import { PaperTrade } from '../types/gold';
import { Briefcase, ArrowUpRight, ArrowDownRight, XCircle, RotateCcw, TrendingUp, ShieldCheck } from 'lucide-react';

interface PaperPortfolioProps {
  trades: PaperTrade[];
  balance: number;
  onCloseTrade: (id: string) => void;
  onResetAccount: () => void;
  currentPrice: number;
}

export const PaperPortfolio: React.FC<PaperPortfolioProps> = ({
  trades,
  balance,
  onCloseTrade,
  onResetAccount,
  currentPrice,
}) => {
  const openTrades = trades.filter((t) => t.status === 'OPEN');
  const closedTrades = trades.filter((t) => t.status === 'CLOSED');

  const totalUnrealizedPnl = openTrades.reduce((acc, t) => acc + t.pnl, 0);
  const equity = balance + totalUnrealizedPnl;
  const closedWins = closedTrades.filter((t) => t.pnl > 0).length;
  const winRate = closedTrades.length > 0 ? ((closedWins / closedTrades.length) * 100).toFixed(1) : '100.0';

  return (
    <div className="bg-[#0e1219] border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-lg text-white tracking-wider">
                LIVE PAPER TRADING PORTFOLIO
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                REAL-TIME SIMULATION
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Practice signal execution without risking real funds • Real-time tick PnL
            </p>
          </div>
        </div>

        <button
          onClick={onResetAccount}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Account</span>
        </button>
      </div>

      {/* Account Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono-numbers">
        <div className="bg-[#111620] p-4 rounded-xl border border-zinc-800">
          <span className="text-[10px] text-zinc-400 block uppercase">Account Balance</span>
          <span className="text-2xl font-black text-white block mt-1">
            ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-zinc-500">Realized Capital</span>
        </div>

        <div className="bg-[#111620] p-4 rounded-xl border border-zinc-800">
          <span className="text-[10px] text-zinc-400 block uppercase">Account Equity</span>
          <span className={`text-2xl font-black block mt-1 ${equity >= balance ? 'text-emerald-400' : 'text-rose-400'}`}>
            ${equity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-zinc-500">Includes Floating PnL</span>
        </div>

        <div className="bg-[#111620] p-4 rounded-xl border border-zinc-800">
          <span className="text-[10px] text-zinc-400 block uppercase">Floating PnL</span>
          <span className={`text-2xl font-black block mt-1 ${totalUnrealizedPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {totalUnrealizedPnl >= 0 ? '+' : ''}${totalUnrealizedPnl.toFixed(2)}
          </span>
          <span className="text-[10px] text-zinc-500">{openTrades.length} Active Positions</span>
        </div>

        <div className="bg-[#111620] p-4 rounded-xl border border-zinc-800">
          <span className="text-[10px] text-zinc-400 block uppercase">Realized Win Rate</span>
          <span className="text-2xl font-black text-amber-400 block mt-1">
            {winRate}%
          </span>
          <span className="text-[10px] text-zinc-500">{closedWins}W / {closedTrades.length - closedWins}L</span>
        </div>
      </div>

      {/* Open Positions Table */}
      <div className="bg-[#0a0d14] rounded-xl border border-zinc-800 overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
          <span className="font-display font-bold text-xs uppercase tracking-wider text-zinc-300">
            ACTIVE OPEN POSITIONS ({openTrades.length})
          </span>
          <span className="text-[10px] text-amber-400 font-mono-numbers">
            Live Tick Price: ${currentPrice.toFixed(2)}
          </span>
        </div>

        {openTrades.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-xs">
            No active positions open. Execute a signal from the "Terminal &amp; Signals" panel or use the Risk Calculator.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono-numbers">
              <thead className="bg-[#10141f] text-zinc-400 text-[10.5px] uppercase tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="px-4 py-2">Symbol</th>
                  <th className="px-4 py-2">Side</th>
                  <th className="px-4 py-2">Lots</th>
                  <th className="px-4 py-2">Entry Price</th>
                  <th className="px-4 py-2">Current Price</th>
                  <th className="px-4 py-2">Stop Loss</th>
                  <th className="px-4 py-2">Take Profit</th>
                  <th className="px-4 py-2">Unrealized PnL</th>
                  <th className="px-4 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {openTrades.map((t) => {
                  const isProfit = t.pnl >= 0;
                  return (
                    <tr key={t.id} className="hover:bg-zinc-800/20">
                      <td className="px-4 py-3 font-bold text-white">{t.symbol}</td>
                      <td className="px-4 py-3 font-bold">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] ${
                            t.side === 'BUY'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {t.side === 'BUY' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {t.side}
                        </span>
                      </td>
                      <td className="px-4 py-3">{t.lotSize}</td>
                      <td className="px-4 py-3">${t.entryPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 font-bold text-amber-400">${t.currentPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 text-rose-400">${t.stopLoss.toFixed(2)}</td>
                      <td className="px-4 py-3 text-emerald-400">${t.takeProfit.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className={`font-black text-sm ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isProfit ? '+' : ''}${t.pnl.toFixed(2)} ({isProfit ? '+' : ''}{t.pnlPercent.toFixed(2)}%)
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => onCloseTrade(t.id)}
                          className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-rose-500 hover:text-white text-zinc-300 text-[11px] font-bold transition-all border border-zinc-700"
                        >
                          Close Order
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Closed Positions History */}
      {closedTrades.length > 0 && (
        <div className="bg-[#0a0d14] rounded-xl border border-zinc-800 overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-800">
            <span className="font-display font-bold text-xs uppercase tracking-wider text-zinc-400">
              CLOSED TRADE HISTORY ({closedTrades.length})
            </span>
          </div>

          <div className="overflow-x-auto max-h-[220px] overflow-y-auto">
            <table className="w-full text-left text-xs font-mono-numbers">
              <thead className="bg-[#10141f] text-zinc-400 text-[10.5px] uppercase tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="px-4 py-2">Side</th>
                  <th className="px-4 py-2">Lots</th>
                  <th className="px-4 py-2">Entry Price</th>
                  <th className="px-4 py-2">Exit Price</th>
                  <th className="px-4 py-2">Realized PnL</th>
                  <th className="px-4 py-2">Exit Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-400">
                {closedTrades.map((t) => (
                  <tr key={t.id}>
                    <td className="px-4 py-2 font-bold text-zinc-200">{t.side}</td>
                    <td className="px-4 py-2">{t.lotSize}</td>
                    <td className="px-4 py-2">${t.entryPrice.toFixed(2)}</td>
                    <td className="px-4 py-2">${t.currentPrice.toFixed(2)}</td>
                    <td className="px-4 py-2">
                      <span className={`font-bold ${t.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {t.pnl >= 0 ? '+' : ''}${t.pnl.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-[11px] text-zinc-500">{t.closeReason || 'Manual Close'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
