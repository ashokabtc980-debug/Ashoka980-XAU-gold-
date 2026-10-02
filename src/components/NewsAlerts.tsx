import React, { useState, useEffect } from 'react';
import { EconomicEvent } from '../types/gold';
import { Newspaper, Bell, AlertTriangle, Flame, ShieldAlert, Sparkles, Clock, Globe } from 'lucide-react';

export const NewsAlerts: React.FC = () => {
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertFilter, setAlertFilter] = useState<'ALL' | 'HIGH'>('ALL');

  useEffect(() => {
    fetch('/api/news/economic-calendar')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.events) setEvents(d.events);
      })
      .catch((err) => {
        console.warn('Failed to load economic calendar:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = events.filter((e) => {
    if (alertFilter === 'HIGH') return e.impact === 'HIGH';
    return true;
  });

  return (
    <div className="bg-[#0e1219] border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Newspaper className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-lg text-white tracking-wider">
                XAU/USD HIGH IMPACT NEWS &amp; MACRO CALENDAR
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                LIVE VOLATILITY DESK
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Fed decisions, CPI inflation, Non-Farm Payrolls (NFP), PCE, FOMC minutes &amp; geopolitical alerts
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center bg-[#090c12] p-0.5 rounded-lg border border-zinc-800 text-xs">
          <button
            onClick={() => setAlertFilter('ALL')}
            className={`px-3 py-1 rounded font-semibold transition-all ${
              alertFilter === 'ALL' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            All Events
          </button>
          <button
            onClick={() => setAlertFilter('HIGH')}
            className={`px-3 py-1 rounded font-semibold transition-all ${
              alertFilter === 'HIGH' ? 'bg-rose-500 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            🔴 High Impact Only
          </button>
        </div>
      </div>

      {/* Volatility Warning Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-bold text-amber-300 block mb-0.5">
            Institutional Gold Volatility Notice:
          </span>
          <p className="text-zinc-300 leading-relaxed">
            Gold spreads typically widen 2 to 4 minutes before Tier-1 US macroeconomic releases (CPI, NFP, FOMC).
            GoldPulse AI auto-adjusts signal confidence and sets News Risk to <strong className="text-amber-400">HIGH ⚠️</strong> to prevent slippage traps.
          </p>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const isHigh = item.impact === 'HIGH';
          return (
            <div
              key={item.id}
              className="bg-[#111620] border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-all space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs mt-0.5 ${
                      isHigh
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    {isHigh ? '🔴' : '🟠'}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-zinc-100">{item.title}</h3>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono-numbers">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1 font-mono-numbers">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        {item.date} • {item.time}
                      </span>
                      <span>Prev: {item.previous}</span>
                      <span>Forecast: <strong className="text-zinc-200">{item.forecast}</strong></span>
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    isHigh
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {item.impact} IMPACT
                </span>
              </div>

              {/* Gold Impact Bias Badge */}
              <div className="bg-[#090d14] p-3 rounded-lg border border-zinc-800/80 flex items-start gap-2 text-xs">
                <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-400 mr-1">XAU/USD Reaction Bias:</span>
                  <span className="text-zinc-300">{item.goldBias}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
