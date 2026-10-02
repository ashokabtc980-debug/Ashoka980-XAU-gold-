import React from 'react';
import { 
  TrendingUp, 
  Volume2, 
  VolumeX, 
  Zap, 
  BrainCircuit, 
  Newspaper, 
  History, 
  Calculator, 
  Briefcase, 
  Flame, 
  ShieldCheck,
  Send
} from 'lucide-react';

interface HeaderProps {
  currentPrice: number;
  prevPrice: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  soundEnabled: boolean;
  setSoundEnabled: (v: boolean) => void;
  openTelegramModal: () => void;
  openVipModal: () => void;
  isVip: boolean;
  openTradesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentPrice,
  prevPrice,
  activeTab,
  setActiveTab,
  soundEnabled,
  setSoundEnabled,
  openTelegramModal,
  openVipModal,
  isVip,
  openTradesCount,
}) => {
  const isUp = currentPrice >= prevPrice;
  const spread = 2.1; // Typical tight gold spread
  const bidPrice = (currentPrice - spread * 0.1).toFixed(2);
  const askPrice = (currentPrice + spread * 0.1).toFixed(2);

  const tabs = [
    { id: 'terminal', label: 'Terminal & Signals', icon: TrendingUp },
    { id: 'scalping', label: 'Scalp Desk', icon: Zap, badge: '1M/5M' },
    { id: 'ai-desk', label: 'AI Market Desk', icon: BrainCircuit, highlight: true },
    { id: 'news', label: 'News & Macro', icon: Newspaper },
    { id: 'backtest', label: 'Backtesting Lab', icon: History },
    { id: 'calculator', label: 'Risk Calculator', icon: Calculator },
    { id: 'portfolio', label: 'Paper Trades', icon: Briefcase, count: openTradesCount },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#080b0f]/95 backdrop-blur-md border-b border-amber-500/20 shadow-2xl">
      {/* Top Ticker Ribbon */}
      <div className="bg-[#05070a] border-b border-zinc-800/80 px-4 py-1.5 flex items-center justify-between text-xs overflow-x-auto select-none">
        <div className="flex items-center gap-6 min-w-max">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-zinc-300">XAU/USD SPOT</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-medium">
              ACTIVE SESSION
            </span>
          </div>

          <div className="flex items-center gap-4 font-mono-numbers">
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500">BID:</span>
              <span className="text-zinc-200 font-bold">{bidPrice}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500">ASK:</span>
              <span className="text-zinc-200 font-bold">{askPrice}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500">SPREAD:</span>
              <span className="text-amber-400 font-medium">{spread} pips</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500">24H HIGH:</span>
              <span className="text-emerald-400 font-medium">$2,758.80</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500">24H LOW:</span>
              <span className="text-rose-400 font-medium">$2,731.40</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 min-w-max pl-4">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] transition-colors ${
              soundEnabled
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
            }`}
            title={soundEnabled ? 'Audio alerts enabled' : 'Audio alerts muted'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{soundEnabled ? 'ALERTS ON' : 'MUTED'}</span>
          </button>

          <button
            onClick={openTelegramModal}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-sky-500/15 text-sky-400 border border-sky-500/30 hover:bg-sky-500/25 transition-colors font-medium text-[11px]"
          >
            <Send className="w-3 h-3" />
            <span>Telegram Channel</span>
          </button>

          <button
            onClick={openVipModal}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold transition-all ${
              isVip
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/20'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>{isVip ? 'PRO VIP ACTIVE' : 'UPGRADE TO PRO'}</span>
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#0d1017] rounded-[10px] flex items-center justify-center">
              <Flame className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-xl font-bold tracking-wider text-white">
                GOLDPULSE<span className="text-amber-400">.AI</span>
              </h1>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-500 to-yellow-400 text-black uppercase tracking-wider">
                XAU/USD
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">Institutional Signals &amp; Risk Intelligence</p>
          </div>

          {/* Big Live Price Display */}
          <div className="ml-4 pl-4 border-l border-zinc-800 flex items-center gap-2">
            <span
              className={`font-mono-numbers text-2xl font-black transition-colors duration-300 ${
                isUp ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              ${currentPrice.toFixed(2)}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded font-mono-numbers font-semibold flex items-center gap-0.5 ${
                isUp ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}
            >
              {isUp ? '▲' : '▼'} {((currentPrice - 2740.0) / 27.4).toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 bg-[#0e1219] p-1 rounded-xl border border-zinc-800/80 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-black font-semibold shadow-md shadow-amber-500/25'
                    : tab.highlight
                    ? 'text-amber-300 hover:bg-amber-500/10'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : tab.highlight ? 'text-amber-400' : 'text-zinc-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] px-1 py-0.2 rounded font-mono-numbers ${isActive ? 'bg-black/20 text-black' : 'bg-amber-500/20 text-amber-300'}`}>
                    {tab.badge}
                  </span>
                )}
                {typeof tab.count === 'number' && tab.count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isActive ? 'bg-black text-amber-400' : 'bg-amber-500 text-black'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
