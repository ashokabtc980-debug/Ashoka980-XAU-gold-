import React, { useState } from 'react';
import { X, Send, Bell, Check, Copy, Smartphone, ShieldCheck, Sparkles } from 'lucide-react';

interface TelegramModalProps {
  onClose: () => void;
  onSendTestNotification: () => void;
}

export const TelegramModal: React.FC<TelegramModalProps> = ({
  onClose,
  onSendTestNotification,
}) => {
  const [copied, setCopied] = useState(false);
  const [testSent, setTestSent] = useState(false);
  const [notificationsAllowed, setNotificationsAllowed] = useState(false);

  const sampleAlert = `🔔 [XAU/USD ALERT] — BUY Setup Detected — 5M
-----------------------------------
Action: STRONG BUY
Entry Zone: $2,741.00 - $2,743.00
Stop Loss: $2,736.20 (-$5.80)
Take Profit 1: $2,748.50 (+$6.50)
Take Profit 2: $2,754.00 (+$12.00)
Risk : Reward = 1 : 2.9
Signal Score: 88/100 (Bullish EMA Stack + Demand Bounce)
Powered by GoldPulse AI`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleAlert);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTriggerTest = () => {
    onSendTestNotification();
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  const requestBrowserPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsAllowed(true);
        new Notification('GoldPulse AI Connected', {
          body: 'Real-time XAU/USD Signal alerts active!',
          icon: '/favicon.ico',
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0f141d] border border-sky-500/30 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-zinc-100 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0a0d14] border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white tracking-wider">
                TELEGRAM &amp; PUSH ALERTS SETUP
              </h3>
              <p className="text-xs text-zinc-400">Instant trade alerts sent straight to your phone</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs">
          {/* Format Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-zinc-300">Live Alert Format Preview:</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 font-semibold"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Sample'}</span>
              </button>
            </div>

            <div className="bg-[#07090e] p-3.5 rounded-xl border border-zinc-800 font-mono-numbers text-[11.5px] text-zinc-300 whitespace-pre-wrap leading-relaxed">
              {sampleAlert}
            </div>
          </div>

          {/* Test Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleTriggerTest}
              className="py-2.5 px-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold transition-all shadow-md shadow-sky-500/20 flex items-center justify-center gap-1.5"
            >
              <Bell className="w-4 h-4" />
              <span>{testSent ? 'Alert Dispatched!' : 'Send Test Alert'}</span>
            </button>

            <button
              onClick={requestBrowserPermission}
              className="py-2.5 px-3 rounded-xl bg-[#151c27] hover:bg-[#1a2332] text-sky-300 border border-sky-500/40 font-semibold transition-all flex items-center justify-center gap-1.5"
            >
              <Smartphone className="w-4 h-4" />
              <span>{notificationsAllowed ? 'Desktop Alerts Active' : 'Enable Web Push'}</span>
            </button>
          </div>

          {/* Integration Guide */}
          <div className="bg-[#0b0e14] p-3 rounded-xl border border-zinc-800/80 space-y-1.5 text-zinc-400">
            <span className="font-semibold text-zinc-200 block">How To Connect VIP Channel:</span>
            <p>1. Open Telegram and search for <strong>@GoldPulseSignalsBot</strong></p>
            <p>2. Send <code>/connect {Math.floor(100000 + Math.random() * 900000)}</code> to link this terminal session</p>
            <p>3. Choose alert filters (Scalp 1M/5M, High Confidence &gt;80%, or News-only alerts)</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#0a0d14] border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
