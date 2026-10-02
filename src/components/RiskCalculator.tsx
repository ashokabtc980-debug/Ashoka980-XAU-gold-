import React, { useState, useEffect } from 'react';
import { SignalItem } from '../types/gold';
import { Calculator, ShieldAlert, DollarSign, Target, ArrowRight, Zap, RefreshCw } from 'lucide-react';

interface RiskCalculatorProps {
  currentPrice: number;
  initialSignal?: SignalItem | null;
  onExecuteTrade: (tradeData: {
    symbol: 'XAU/USD';
    side: 'BUY' | 'SELL';
    entryPrice: number;
    stopLoss: number;
    takeProfit: number;
    lotSize: number;
    contractType: 'Standard (100oz)' | 'Mini (10oz)' | 'Micro (1oz)';
  }) => void;
}

export const RiskCalculator: React.FC<RiskCalculatorProps> = ({
  currentPrice,
  initialSignal,
  onExecuteTrade,
}) => {
  const [balance, setBalance] = useState<number>(10000);
  const [riskPercent, setRiskPercent] = useState<number>(1.5);
  const [tradeSide, setTradeSide] = useState<'BUY' | 'SELL'>('BUY');
  const [entryPrice, setEntryPrice] = useState<number>(currentPrice || 2744.50);
  const [stopLoss, setStopLoss] = useState<number>(currentPrice ? currentPrice - 5.0 : 2739.50);
  const [takeProfit, setTakeProfit] = useState<number>(currentPrice ? currentPrice + 12.5 : 2757.00);
  const [contractType, setContractType] = useState<'Standard (100oz)' | 'Mini (10oz)' | 'Micro (1oz)'>('Standard (100oz)');

  // Update if an initial signal is loaded
  useEffect(() => {
    if (initialSignal) {
      setTradeSide(initialSignal.action.includes('SELL') ? 'SELL' : 'BUY');
      setEntryPrice(initialSignal.entryPrice);
      setStopLoss(initialSignal.stopLoss);
      setTakeProfit(initialSignal.tp2 || initialSignal.tp1);
    }
  }, [initialSignal]);

  // Calculations
  const riskAmount = (balance * riskPercent) / 100;
  const slDistanceDollars = Math.abs(entryPrice - stopLoss);
  const slPips = slDistanceDollars * 10;
  const tpDistanceDollars = Math.abs(takeProfit - entryPrice);
  const tpPips = tpDistanceDollars * 10;
  const rrRatio = slDistanceDollars > 0 ? (tpDistanceDollars / slDistanceDollars).toFixed(2) : '0';

  // Gold 1 Standard Lot = 100 troy ounces.
  // 1 dollar move on 1 lot = $100.
  // 1 pip (0.10 move) on 1 lot = $10.
  const contractOunces = contractType === 'Standard (100oz)' ? 100 : contractType === 'Mini (10oz)' ? 10 : 1;
  const dollarLossPerUnitLot = slDistanceDollars * contractOunces;
  const recommendedLotSize = dollarLossPerUnitLot > 0 ? Math.max(0.01, Number((riskAmount / dollarLossPerUnitLot).toFixed(2))) : 0.1;
  const pipValue = Number(((recommendedLotSize * contractOunces) * 0.1).toFixed(2));
  const potentialProfit = Number((recommendedLotSize * tpDistanceDollars * contractOunces).toFixed(2));
  const marginRequired = Number(((entryPrice * contractOunces * recommendedLotSize) / 100).toFixed(2)); // at 1:100 leverage

  const handleExecute = () => {
    onExecuteTrade({
      symbol: 'XAU/USD',
      side: tradeSide,
      entryPrice,
      stopLoss,
      takeProfit,
      lotSize: recommendedLotSize,
      contractType,
    });
  };

  return (
    <div className="bg-[#0e1219] border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-white tracking-wider">
              XAU/USD POSITION SIZE &amp; RISK CALCULATOR
            </h2>
            <p className="text-xs text-zinc-400">
              Calculate exact lot sizing, monetary risk, and margin allocation before entering
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setEntryPrice(Number(currentPrice.toFixed(2)));
            if (tradeSide === 'BUY') {
              setStopLoss(Number((currentPrice - 4.5).toFixed(2)));
              setTakeProfit(Number((currentPrice + 12.0).toFixed(2)));
            } else {
              setStopLoss(Number((currentPrice + 4.5).toFixed(2)));
              setTakeProfit(Number((currentPrice - 12.0).toFixed(2)));
            }
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync to Live Spot Price (${currentPrice.toFixed(2)})</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Panel */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#0a0d14] p-4 rounded-xl border border-zinc-800 space-y-4 text-xs">
            {/* Side Selection */}
            <div>
              <label className="text-zinc-400 font-semibold block mb-1.5">Order Direction</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTradeSide('BUY')}
                  className={`py-2 rounded-lg font-bold transition-all ${
                    tradeSide === 'BUY'
                      ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                      : 'bg-[#131822] text-zinc-400 hover:text-white'
                  }`}
                >
                  BUY / LONG (XAU/USD)
                </button>
                <button
                  type="button"
                  onClick={() => setTradeSide('SELL')}
                  className={`py-2 rounded-lg font-bold transition-all ${
                    tradeSide === 'SELL'
                      ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                      : 'bg-[#131822] text-zinc-400 hover:text-white'
                  }`}
                >
                  SELL / SHORT (XAU/USD)
                </button>
              </div>
            </div>

            {/* Account Balance & Risk % */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Account Balance ($)</label>
                <input
                  type="number"
                  value={balance}
                  onChange={(e) => setBalance(Math.max(100, Number(e.target.value)))}
                  className="w-full bg-[#131822] border border-zinc-700 rounded-lg p-2 font-mono-numbers text-white font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-zinc-400 font-semibold block mb-1">
                  Risk Per Trade ({riskPercent}%)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0.2"
                    max="10"
                    value={riskPercent}
                    onChange={(e) => setRiskPercent(Math.max(0.1, Number(e.target.value)))}
                    className="w-20 bg-[#131822] border border-zinc-700 rounded-lg p-2 font-mono-numbers text-amber-400 font-bold focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-zinc-500 text-[11px] font-mono-numbers font-bold">
                    = ${riskAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Risk Presets */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-zinc-500">Quick Risk:</span>
              {[0.5, 1.0, 1.5, 2.0, 3.0].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRiskPercent(r)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono-numbers transition-all ${
                    riskPercent === r
                      ? 'bg-amber-500 text-black font-bold'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {r}%
                </button>
              ))}
            </div>

            {/* Entry, Stop Loss, Take Profit */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-zinc-400 font-semibold block mb-1">Entry Price ($)</label>
                <input
                  type="number"
                  step="0.1"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(Number(e.target.value))}
                  className="w-full bg-[#131822] border border-zinc-700 rounded-lg p-2 font-mono-numbers text-white font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-rose-400 font-semibold block mb-1">Stop-Loss ($)</label>
                <input
                  type="number"
                  step="0.1"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(Number(e.target.value))}
                  className="w-full bg-[#131822] border border-rose-500/50 rounded-lg p-2 font-mono-numbers text-rose-400 font-bold focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="text-emerald-400 font-semibold block mb-1">Take-Profit ($)</label>
                <input
                  type="number"
                  step="0.1"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(Number(e.target.value))}
                  className="w-full bg-[#131822] border border-emerald-500/50 rounded-lg p-2 font-mono-numbers text-emerald-400 font-bold focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Contract Type */}
            <div>
              <label className="text-zinc-400 font-semibold block mb-1">Contract / Lot Standard</label>
              <select
                value={contractType}
                onChange={(e) => setContractType(e.target.value as any)}
                className="w-full bg-[#131822] border border-zinc-700 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-amber-500"
              >
                <option value="Standard (100oz)">Standard Lot (1.0 = 100 Troy Oz XAU)</option>
                <option value="Mini (10oz)">Mini Lot (1.0 = 10 Troy Oz XAU)</option>
                <option value="Micro (1oz)">Micro Lot (1.0 = 1 Troy Oz XAU)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Output Results Panel */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          <div className="bg-gradient-to-br from-[#121722] to-[#0c0f16] border border-amber-500/30 rounded-xl p-5 shadow-xl space-y-4">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              RECOMMENDED POSITION SIZING
            </span>

            {/* Huge Lot Size Card */}
            <div className="bg-[#080b10] p-4 rounded-xl border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-zinc-400 text-xs block">Calculated Position Size</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-mono-numbers text-4xl font-black text-amber-400">
                    {recommendedLotSize}
                  </span>
                  <span className="text-zinc-400 text-xs font-semibold">LOTS</span>
                </div>
                <span className="text-[11px] text-zinc-500 font-mono-numbers">
                  Exposure: {(recommendedLotSize * contractOunces).toFixed(1)} oz of Gold
                </span>
              </div>

              <div className="text-right font-mono-numbers">
                <span className="text-[10px] text-zinc-500 block uppercase">Risk / Pip</span>
                <span className="text-lg font-bold text-zinc-200">${pipValue}</span>
                <span className="text-[10px] text-zinc-500 block">per 1 pip move</span>
              </div>
            </div>

            {/* Calculations Breakdown Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono-numbers">
              <div className="bg-[#0b0e14] p-3 rounded-lg border border-zinc-800/80">
                <span className="text-zinc-500 text-[10px] block uppercase">Maximum Risk ($)</span>
                <span className="text-base font-bold text-rose-400">-${riskAmount.toFixed(2)}</span>
                <span className="text-zinc-500 text-[10px] block">
                  {slDistanceDollars.toFixed(2)} pts ({slPips.toFixed(0)} pips)
                </span>
              </div>

              <div className="bg-[#0b0e14] p-3 rounded-lg border border-zinc-800/80">
                <span className="text-zinc-500 text-[10px] block uppercase">Target Reward ($)</span>
                <span className="text-base font-bold text-emerald-400">+${potentialProfit.toFixed(2)}</span>
                <span className="text-zinc-500 text-[10px] block">
                  {tpDistanceDollars.toFixed(2)} pts ({tpPips.toFixed(0)} pips)
                </span>
              </div>

              <div className="bg-[#0b0e14] p-3 rounded-lg border border-zinc-800/80">
                <span className="text-zinc-500 text-[10px] block uppercase">Risk-to-Reward</span>
                <span className="text-base font-bold text-amber-400">1 : {rrRatio}</span>
                <span className="text-zinc-500 text-[10px] block">
                  {Number(rrRatio) >= 2 ? '✅ Favorable Ratio' : '⚠️ Low Ratio (< 1:2)'}
                </span>
              </div>

              <div className="bg-[#0b0e14] p-3 rounded-lg border border-zinc-800/80">
                <span className="text-zinc-500 text-[10px] block uppercase">Margin Required</span>
                <span className="text-base font-bold text-zinc-200">${marginRequired}</span>
                <span className="text-zinc-500 text-[10px] block">@ 1:100 Leverage</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleExecute}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-sm transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
          >
            <span>Open Paper Trade with This Position Size</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
