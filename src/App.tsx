/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { GoldChart } from './components/GoldChart';
import { SignalsPanel } from './components/SignalsPanel';
import { SignalScoreModal } from './components/SignalScoreModal';
import { AiMarketDesk } from './components/AiMarketDesk';
import { NewsAlerts } from './components/NewsAlerts';
import { BacktestingLab } from './components/BacktestingLab';
import { RiskCalculator } from './components/RiskCalculator';
import { PaperPortfolio } from './components/PaperPortfolio';
import { ScalpingDesk } from './components/ScalpingDesk';
import { TelegramModal } from './components/TelegramModal';
import { VipTierModal } from './components/VipTierModal';
import { 
  generateInitialCandles, 
  computeIndicators, 
  getInitialSignals, 
  BASE_GOLD_PRICE 
} from './utils/goldMarketEngine';
import { playSignalChime, playProfitChime, playStopLossAlert } from './utils/audioAlerts';
import { Candle, IndicatorsState, SignalItem, PaperTrade } from './types/gold';
import { Bell, CheckCircle2, AlertTriangle, ShieldCheck, Flame, Zap } from 'lucide-react';

export default function App() {
  // Live Price State
  const [currentPrice, setCurrentPrice] = useState<number>(BASE_GOLD_PRICE);
  const [prevPrice, setPrevPrice] = useState<number>(BASE_GOLD_PRICE);

  // Timeframe and Candlestick Data
  const [timeframe, setTimeframe] = useState<'1M' | '5M' | '15M' | '1H' | '4H' | '1D'>('5M');
  const [candles, setCandles] = useState<Candle[]>(() => generateInitialCandles(75, 5, BASE_GOLD_PRICE));

  // Indicators & Signals
  const [indicators, setIndicators] = useState<IndicatorsState>(() => computeIndicators(candles));
  const [signals, setSignals] = useState<SignalItem[]>(() => getInitialSignals(BASE_GOLD_PRICE));
  const [selectedSignal, setSelectedSignal] = useState<SignalItem | null>(() => signals[0] || null);

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<string>('terminal');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isVip, setIsVip] = useState<boolean>(true);
  const [signalScoreModalSignal, setSignalScoreModalSignal] = useState<SignalItem | null>(null);
  const [telegramModalOpen, setTelegramModalOpen] = useState<boolean>(false);
  const [vipModalOpen, setVipModalOpen] = useState<boolean>(false);
  const [calcPrefillSignal, setCalcPrefillSignal] = useState<SignalItem | null>(null);

  // Toast Banner
  const [toastMessage, setToastMessage] = useState<{ title: string; body: string; type: 'info' | 'success' | 'warning' } | null>(null);

  // Paper Trading State
  const [paperBalance, setPaperBalance] = useState<number>(10000);
  const [paperTrades, setPaperTrades] = useState<PaperTrade[]>([
    {
      id: 'trade-demo-1',
      symbol: 'XAU/USD',
      side: 'BUY',
      entryPrice: 2742.80,
      currentPrice: 2744.50,
      stopLoss: 2738.00,
      takeProfit: 2755.00,
      lotSize: 0.5,
      contractType: 'Standard (100oz)',
      openTime: Date.now() - 15 * 60 * 1000,
      status: 'OPEN',
      pnl: 85.00,
      pnlPercent: 0.85,
    },
  ]);

  const showToast = (title: string, body: string, type: 'info' | 'success' | 'warning' = 'info') => {
    setToastMessage({ title, body, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.title === title ? null : prev));
    }, 4500);
  };

  // Re-generate candles whenever user switches main timeframe
  useEffect(() => {
    const minutes = timeframe === '1M' ? 1 : timeframe === '5M' ? 5 : timeframe === '15M' ? 15 : timeframe === '1H' ? 60 : timeframe === '4H' ? 240 : 1440;
    const newCandles = generateInitialCandles(75, minutes, currentPrice);
    setCandles(newCandles);
    setIndicators(computeIndicators(newCandles));
  }, [timeframe]);

  // Real-time Live Market Ticker & Paper Trades PnL Engine
  useEffect(() => {
    const interval = setInterval(() => {
      // Natural tick walk: micro fraction of points with random drift
      const tickDelta = (Math.random() - 0.49) * 0.35;
      
      setCurrentPrice((prev) => {
        const nextPrice = Number((prev + tickDelta).toFixed(2));
        setPrevPrice(prev);

        // Update the latest candle close, high, low
        setCandles((prevCandles) => {
          if (!prevCandles.length) return prevCandles;
          const copy = [...prevCandles];
          const lastIndex = copy.length - 1;
          const lastCandle = copy[lastIndex];

          copy[lastIndex] = {
            ...lastCandle,
            close: nextPrice,
            high: Math.max(lastCandle.high, nextPrice),
            low: Math.min(lastCandle.low, nextPrice),
            volume: lastCandle.volume + Math.floor(Math.random() * 8 + 1),
          };

          return copy;
        });

        return nextPrice;
      });
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  // Update indicators periodically when candles change
  useEffect(() => {
    const updated = computeIndicators(candles);
    setIndicators(updated);
  }, [candles]);

  // Update open paper trades with live tick prices and check SL / TP
  useEffect(() => {
    setPaperTrades((prevTrades) => {
      let balanceChange = 0;
      const updated = prevTrades.map((trade) => {
        if (trade.status !== 'OPEN') return trade;

        const contractOunces = trade.contractType === 'Standard (100oz)' ? 100 : trade.contractType === 'Mini (10oz)' ? 10 : 1;
        const diff = trade.side === 'BUY' ? currentPrice - trade.entryPrice : trade.entryPrice - currentPrice;
        const pnl = Number((diff * contractOunces * trade.lotSize).toFixed(2));
        const pnlPercent = Number(((pnl / paperBalance) * 100).toFixed(2));

        // Check Take Profit hit
        if (
          (trade.side === 'BUY' && currentPrice >= trade.takeProfit) ||
          (trade.side === 'SELL' && currentPrice <= trade.takeProfit)
        ) {
          if (soundEnabled) playProfitChime();
          showToast('🎯 Take Profit Target Hit!', `${trade.symbol} ${trade.side} closed at $${currentPrice.toFixed(2)} with +$${pnl.toFixed(2)} profit.`, 'success');
          balanceChange += pnl;
          return {
            ...trade,
            currentPrice,
            pnl,
            pnlPercent,
            status: 'CLOSED' as const,
            closeTime: Date.now(),
            closeReason: 'Take Profit Target Hit',
          };
        }

        // Check Stop Loss hit
        if (
          (trade.side === 'BUY' && currentPrice <= trade.stopLoss) ||
          (trade.side === 'SELL' && currentPrice >= trade.stopLoss)
        ) {
          if (soundEnabled) playStopLossAlert();
          showToast('🛑 Stop-Loss Protection Triggered', `${trade.symbol} ${trade.side} closed at $${currentPrice.toFixed(2)} (-$${Math.abs(pnl).toFixed(2)}).`, 'warning');
          balanceChange += pnl;
          return {
            ...trade,
            currentPrice,
            pnl,
            pnlPercent,
            status: 'CLOSED' as const,
            closeTime: Date.now(),
            closeReason: 'Stop Loss Protection Executed',
          };
        }

        return {
          ...trade,
          currentPrice,
          pnl,
          pnlPercent,
        };
      });

      if (balanceChange !== 0) {
        setPaperBalance((b) => Number((b + balanceChange).toFixed(2)));
      }

      return updated;
    });
  }, [currentPrice, soundEnabled]);

  // Handlers
  const handleQuickTrade = (signal: SignalItem) => {
    const isBuy = signal.action.includes('BUY');
    const newTrade: PaperTrade = {
      id: `trade-${Date.now()}`,
      signalId: signal.id,
      symbol: 'XAU/USD',
      side: isBuy ? 'BUY' : 'SELL',
      entryPrice: currentPrice,
      currentPrice: currentPrice,
      stopLoss: signal.stopLoss,
      takeProfit: signal.tp2 || signal.tp1,
      lotSize: 0.25,
      contractType: 'Standard (100oz)',
      openTime: Date.now(),
      status: 'OPEN',
      pnl: 0,
      pnlPercent: 0,
    };

    setPaperTrades((prev) => [newTrade, ...prev]);
    if (soundEnabled) playSignalChime();
    showToast('Paper Order Executed', `${isBuy ? 'BUY' : 'SELL'} 0.25 Lots XAU/USD filled at $${currentPrice.toFixed(2)}`, 'success');
  };

  const handleLoadIntoCalculator = (signal: SignalItem) => {
    setCalcPrefillSignal(signal);
    setActiveTab('calculator');
  };

  const handleExecuteCalculatorTrade = (tradeData: {
    symbol: 'XAU/USD';
    side: 'BUY' | 'SELL';
    entryPrice: number;
    stopLoss: number;
    takeProfit: number;
    lotSize: number;
    contractType: 'Standard (100oz)' | 'Mini (10oz)' | 'Micro (1oz)';
  }) => {
    const newTrade: PaperTrade = {
      id: `trade-${Date.now()}`,
      symbol: tradeData.symbol,
      side: tradeData.side,
      entryPrice: tradeData.entryPrice,
      currentPrice: currentPrice,
      stopLoss: tradeData.stopLoss,
      takeProfit: tradeData.takeProfit,
      lotSize: tradeData.lotSize,
      contractType: tradeData.contractType,
      openTime: Date.now(),
      status: 'OPEN',
      pnl: 0,
      pnlPercent: 0,
    };

    setPaperTrades((prev) => [newTrade, ...prev]);
    if (soundEnabled) playSignalChime();
    showToast('Position Size Order Executed', `${tradeData.side} ${tradeData.lotSize} Lots placed into Paper Portfolio`, 'success');
    setActiveTab('portfolio');
  };

  const handleCloseTrade = (id: string) => {
    setPaperTrades((prev) =>
      prev.map((t) => {
        if (t.id === id && t.status === 'OPEN') {
          setPaperBalance((b) => Number((b + t.pnl).toFixed(2)));
          if (soundEnabled) {
            if (t.pnl >= 0) playProfitChime();
            else playStopLossAlert();
          }
          showToast('Position Manually Closed', `Realized PnL: ${t.pnl >= 0 ? '+' : ''}$${t.pnl.toFixed(2)}`, t.pnl >= 0 ? 'success' : 'info');
          return {
            ...t,
            status: 'CLOSED' as const,
            closeTime: Date.now(),
            closeReason: 'Manual Market Close',
          };
        }
        return t;
      })
    );
  };

  const handleResetAccount = () => {
    setPaperBalance(10000);
    setPaperTrades([]);
    showToast('Account Reset', 'Paper trading balance restored to $10,000.00 USD', 'info');
  };

  return (
    <div className="min-h-screen bg-[#080b0f] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* App Header */}
      <Header
        currentPrice={currentPrice}
        prevPrice={prevPrice}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        openTelegramModal={() => setTelegramModalOpen(true)}
        openVipModal={() => setVipModalOpen(true)}
        isVip={isVip}
        openTradesCount={paperTrades.filter((t) => t.status === 'OPEN').length}
      />

      {/* Floating Alert Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300 max-w-sm">
          <div
            className={`p-4 rounded-xl border shadow-2xl backdrop-blur-md flex items-start gap-3 ${
              toastMessage.type === 'success'
                ? 'bg-[#0f241a]/95 border-emerald-500/50 text-emerald-100'
                : toastMessage.type === 'warning'
                ? 'bg-[#291417]/95 border-rose-500/50 text-rose-100'
                : 'bg-[#121824]/95 border-amber-500/40 text-amber-100'
            }`}
          >
            <div className="mt-0.5">
              {toastMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : toastMessage.type === 'warning' ? (
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              ) : (
                <Bell className="w-5 h-5 text-amber-400" />
              )}
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider">{toastMessage.title}</h4>
              <p className="text-xs text-zinc-300 mt-0.5 leading-snug">{toastMessage.body}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-5 space-y-6">
        {/* Tab 1: Terminal & Signals (Default Trading Center) */}
        {activeTab === 'terminal' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Interactive Candlestick Chart */}
              <div className="lg:col-span-8 space-y-4">
                <GoldChart
                  candles={candles}
                  indicators={indicators}
                  selectedSignal={selectedSignal}
                  timeframe={timeframe}
                  setTimeframe={setTimeframe}
                  currentPrice={currentPrice}
                />

                {/* Live Market Analysis Quick Ticker Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono-numbers">
                  <div className="bg-[#0e1219] p-3 rounded-xl border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block uppercase">Trend Status</span>
                    <span className="font-bold text-amber-400 flex items-center gap-1 mt-0.5">
                      <Flame className="w-3.5 h-3.5" />
                      {indicators.trend.toUpperCase()} BIAS
                    </span>
                  </div>

                  <div className="bg-[#0e1219] p-3 rounded-xl border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block uppercase">Dynamic Support</span>
                    <span className="font-bold text-emerald-400 block mt-0.5">
                      ${indicators.support.toFixed(2)}
                    </span>
                  </div>

                  <div className="bg-[#0e1219] p-3 rounded-xl border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block uppercase">Dynamic Resistance</span>
                    <span className="font-bold text-rose-400 block mt-0.5">
                      ${indicators.resistance.toFixed(2)}
                    </span>
                  </div>

                  <div className="bg-[#0e1219] p-3 rounded-xl border border-zinc-800">
                    <span className="text-[10px] text-zinc-500 block uppercase">14-Period ATR</span>
                    <span className="font-bold text-zinc-200 block mt-0.5">
                      ${indicators.atr.toFixed(2)} / oz
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Signals Feed with Signature Signal Score */}
              <div className="lg:col-span-4">
                <SignalsPanel
                  signals={signals}
                  selectedSignal={selectedSignal}
                  onSelectSignal={setSelectedSignal}
                  onOpenSignalScore={(sig) => setSignalScoreModalSignal(sig)}
                  onQuickTrade={handleQuickTrade}
                  onLoadIntoCalculator={handleLoadIntoCalculator}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Scalping Desk (1M / 5M / 15M High Frequency) */}
        {activeTab === 'scalping' && (
          <ScalpingDesk
            candles={candles}
            indicators={indicators}
            currentPrice={currentPrice}
            signals={signals}
            onQuickTrade={handleQuickTrade}
            onOpenSignalScore={(sig) => setSignalScoreModalSignal(sig)}
          />
        )}

        {/* Tab 3: Gemini AI Market Intelligence Desk */}
        {activeTab === 'ai-desk' && (
          <AiMarketDesk
            currentPrice={currentPrice}
            timeframe={timeframe}
            indicators={indicators}
            activeSignal={selectedSignal}
          />
        )}

        {/* Tab 4: News & Macro Volatility Calendar */}
        {activeTab === 'news' && <NewsAlerts />}

        {/* Tab 5: Quantitative Backtesting Lab */}
        {activeTab === 'backtest' && <BacktestingLab candles={candles} />}

        {/* Tab 6: Risk & Position Sizing Calculator */}
        {activeTab === 'calculator' && (
          <RiskCalculator
            currentPrice={currentPrice}
            initialSignal={calcPrefillSignal}
            onExecuteTrade={handleExecuteCalculatorTrade}
          />
        )}

        {/* Tab 7: Paper Portfolio & Live Trade Tracker */}
        {activeTab === 'portfolio' && (
          <PaperPortfolio
            trades={paperTrades}
            balance={paperBalance}
            onCloseTrade={handleCloseTrade}
            onResetAccount={handleResetAccount}
            currentPrice={currentPrice}
          />
        )}
      </main>

      {/* Transparent Signal Score Modal */}
      {signalScoreModalSignal && (
        <SignalScoreModal
          signal={signalScoreModalSignal}
          onClose={() => setSignalScoreModalSignal(null)}
          onTradeNow={handleQuickTrade}
        />
      )}

      {/* Telegram Alert Simulator Modal */}
      {telegramModalOpen && (
        <TelegramModal
          onClose={() => setTelegramModalOpen(false)}
          onSendTestNotification={() => {
            if (soundEnabled) playSignalChime();
            showToast('Telegram Alert Dispatched', 'XAU/USD 5M BUY setup alert pushed to subscribers', 'info');
          }}
        />
      )}

      {/* VIP Membership Modal */}
      {vipModalOpen && (
        <VipTierModal
          onClose={() => setVipModalOpen(false)}
          isVip={isVip}
          setIsVip={setIsVip}
        />
      )}

      {/* Clean Financial Disclaimer Footer */}
      <footer className="border-t border-zinc-800/80 bg-[#06080c] py-4 px-4 text-center text-[11px] text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-amber-500">GOLDPULSE AI</span>
            <span>• XAU/USD Precision Signal &amp; Quantitative Risk Terminal</span>
          </div>
          <span>Risk Disclaimer: Spot gold trading involves substantial financial risk. Signals are indicator-derived metrics and not guarantees.</span>
        </div>
      </footer>
    </div>
  );
}
