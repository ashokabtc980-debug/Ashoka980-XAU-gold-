import React from 'react';
import { X, Check, ShieldCheck, Zap, Crown, Sparkles } from 'lucide-react';

interface VipTierModalProps {
  onClose: () => void;
  isVip: boolean;
  setIsVip: (v: boolean) => void;
}

export const VipTierModal: React.FC<VipTierModalProps> = ({
  onClose,
  isVip,
  setIsVip,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0f141d] border border-amber-500/40 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden text-zinc-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0a0d14] border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white tracking-wider">
                GOLDPULSE AI MEMBERSHIP TIERS
              </h3>
              <p className="text-xs text-zinc-400">Transparent trading plans designed for retail and prop-firm gold traders</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pricing Table Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Free Tier */}
          <div className="bg-[#0b0e14] border border-zinc-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                Standard Free
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-mono-numbers text-3xl font-black text-white">$0</span>
                <span className="text-xs text-zinc-500">/ forever</span>
              </div>
              <p className="text-xs text-zinc-400 mt-2">
                Ideal for beginners observing XAU/USD gold behavior and basic indicator education.
              </p>

              <div className="mt-4 space-y-2.5 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>5-Minute delayed signals feed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Standard RSI &amp; EMA 20/50 chart</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Basic Position Size Calculator</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-500">
                  <X className="w-4 h-4 flex-shrink-0" />
                  <span>Real-time instant Telegram push</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-500">
                  <X className="w-4 h-4 flex-shrink-0" />
                  <span>Gemini AI Macro Strategic Desk</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setIsVip(false);
                onClose();
              }}
              className="w-full py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors"
            >
              Use Free Tier
            </button>
          </div>

          {/* Pro Tier (Highlighted) */}
          <div className="bg-gradient-to-b from-[#182130] to-[#0e141f] border-2 border-amber-500 rounded-xl p-5 flex flex-col justify-between space-y-4 relative shadow-xl shadow-amber-500/10">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-amber-500 text-black px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              MOST POPULAR
            </div>

            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                GoldPulse Pro
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-mono-numbers text-3xl font-black text-amber-400">$49</span>
                <span className="text-xs text-zinc-400">/ month</span>
              </div>
              <p className="text-xs text-zinc-300 mt-2">
                For active intraday &amp; scalping gold traders who need real-time zero-delay execution.
              </p>

              <div className="mt-4 space-y-2.5 text-xs text-zinc-200">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span className="font-semibold">Zero-latency Real-time Signals</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Instant Telegram bot &amp; web push</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>1M &amp; 5M Ultra-fast Scalping mode</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Transparent 6-point Signal Score</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Full Backtesting Strategy Lab</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setIsVip(true);
                onClose();
              }}
              className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all shadow-md shadow-amber-500/25 flex items-center justify-center gap-1.5"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{isVip ? 'Current Plan (Active)' : 'Activate Pro Plan'}</span>
            </button>
          </div>

          {/* Premium VIP Tier */}
          <div className="bg-[#0b0e14] border border-zinc-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block">
                Institutional VIP
              </span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-mono-numbers text-3xl font-black text-white">$149</span>
                <span className="text-xs text-zinc-500">/ month</span>
              </div>
              <p className="text-xs text-zinc-400 mt-2">
                Personalized AI analyst dashboard, proprietary order block sweeps, and custom webhooks.
              </p>

              <div className="mt-4 space-y-2.5 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  <span>Everything in Pro Plan</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  <span>Gemini 3.8 Flash Macro Intelligence</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  <span>Direct Webhook to MT4 / MT5 / cTrader</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  <span>Prop-Firm Risk Guard (Daily loss stops)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-400 flex-shrink-0" />
                  <span>1-on-1 Precious Metals Quant briefings</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setIsVip(true);
                onClose();
              }}
              className="w-full py-2 rounded-lg bg-zinc-800 hover:bg-sky-500 hover:text-black text-sky-300 text-xs font-bold transition-all border border-sky-500/30"
            >
              Select VIP Desk
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#0a0d14] border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <span>Cancel or switch anytime • Instant activation</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
