import React, { useState, useMemo } from 'react';
import { Candle, IndicatorsState, SignalItem } from '../types/gold';
import { Layers, Activity, Sliders, Maximize2 } from 'lucide-react';

interface GoldChartProps {
  candles: Candle[];
  indicators: IndicatorsState;
  selectedSignal: SignalItem | null;
  timeframe: string;
  setTimeframe: (tf: '1M' | '5M' | '15M' | '1H' | '4H' | '1D') => void;
  currentPrice: number;
}

export const GoldChart: React.FC<GoldChartProps> = ({
  candles,
  indicators,
  selectedSignal,
  timeframe,
  setTimeframe,
  currentPrice,
}) => {
  const [showEMA, setShowEMA] = useState(true);
  const [showBB, setShowBB] = useState(false);
  const [activeSubChart, setActiveSubChart] = useState<'RSI' | 'MACD' | 'NONE'>('RSI');
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);

  // SVG dimensions
  const width = 850;
  const height = 360;
  const paddingRight = 65;
  const paddingBottom = 25;
  const paddingTop = 20;
  const paddingLeft = 10;

  const chartWidth = width - paddingRight - paddingLeft;
  const chartHeight = height - paddingTop - paddingBottom;

  // Compute min/max prices
  const { minPrice, maxPrice, priceRange } = useMemo(() => {
    if (!candles.length) return { minPrice: 2730, maxPrice: 2760, priceRange: 30 };
    let min = Math.min(...candles.map((c) => c.low));
    let max = Math.max(...candles.map((c) => c.high));

    if (selectedSignal) {
      min = Math.min(min, selectedSignal.stopLoss, selectedSignal.tp1, selectedSignal.tp3);
      max = Math.max(max, selectedSignal.stopLoss, selectedSignal.tp1, selectedSignal.tp3);
    }

    const pad = (max - min) * 0.08 || 5;
    return {
      minPrice: min - pad,
      maxPrice: max + pad,
      priceRange: max - min + pad * 2,
    };
  }, [candles, selectedSignal]);

  const getY = (price: number) => {
    const norm = (price - minPrice) / (priceRange || 1);
    return paddingTop + (1 - norm) * chartHeight;
  };

  const candleWidth = Math.max(2, Math.floor(chartWidth / (candles.length || 1)) - 3);

  // EMA Polyline Points
  const ema20Points = useMemo(() => {
    if (!showEMA) return '';
    return candles
      .map((c, i) => {
        const x = paddingLeft + (i + 0.5) * (chartWidth / candles.length);
        // approximate ema trail
        const price = c.close * 0.999 + (i % 3 === 0 ? 0.2 : -0.2);
        return `${x},${getY(price)}`;
      })
      .join(' ');
  }, [candles, showEMA, minPrice, priceRange]);

  const timeframes: Array<'1M' | '5M' | '15M' | '1H' | '4H' | '1D'> = ['1M', '5M', '15M', '1H', '4H', '1D'];

  return (
    <div className="bg-[#0e1219] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
      {/* Chart Control Header */}
      <div className="px-4 py-2.5 bg-[#0a0d13] border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 font-bold text-amber-400">
            <Activity className="w-4 h-4" />
            <span className="font-display tracking-wider">XAU/USD CANDLESTICK TERMINAL</span>
          </div>

          {/* Timeframe Buttons */}
          <div className="flex items-center bg-[#131822] p-0.5 rounded-lg border border-zinc-700/60 ml-3">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-1 rounded font-mono-numbers text-[11px] font-semibold transition-all ${
                  timeframe === tf
                    ? 'bg-amber-500 text-black shadow'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Indicator Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEMA(!showEMA)}
            className={`px-2.5 py-1 rounded border text-[11px] font-medium transition-all ${
              showEMA
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-zinc-800/60 text-zinc-400 border-zinc-700'
            }`}
          >
            EMA 20/50/200
          </button>

          <button
            onClick={() => setShowBB(!showBB)}
            className={`px-2.5 py-1 rounded border text-[11px] font-medium transition-all ${
              showBB
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                : 'bg-zinc-800/60 text-zinc-400 border-zinc-700'
            }`}
          >
            Bollinger Bands
          </button>

          <div className="flex items-center bg-[#131822] p-0.5 rounded-lg border border-zinc-700/60">
            <button
              onClick={() => setActiveSubChart('RSI')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                activeSubChart === 'RSI' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              RSI (14)
            </button>
            <button
              onClick={() => setActiveSubChart('MACD')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                activeSubChart === 'MACD' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              MACD
            </button>
            <button
              onClick={() => setActiveSubChart('NONE')}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                activeSubChart === 'NONE' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Off
            </button>
          </div>
        </div>
      </div>

      {/* Hover Information Ribbon */}
      <div className="px-4 py-1.5 bg-[#0a0d13]/80 border-b border-zinc-800/60 flex items-center justify-between text-[11px] font-mono-numbers">
        <div className="flex items-center gap-4 text-zinc-400">
          {hoveredCandle ? (
            <>
              <span>TIME: <strong className="text-zinc-200">{new Date(hoveredCandle.time).toLocaleTimeString()}</strong></span>
              <span>O: <strong className="text-zinc-200">${hoveredCandle.open.toFixed(2)}</strong></span>
              <span>H: <strong className="text-emerald-400">${hoveredCandle.high.toFixed(2)}</strong></span>
              <span>L: <strong className="text-rose-400">${hoveredCandle.low.toFixed(2)}</strong></span>
              <span>C: <strong className={hoveredCandle.close >= hoveredCandle.open ? 'text-emerald-400' : 'text-rose-400'}>${hoveredCandle.close.toFixed(2)}</strong></span>
              <span>VOL: <strong className="text-amber-400">{hoveredCandle.volume.toLocaleString()}</strong></span>
            </>
          ) : (
            <>
              <span>EMA20: <strong className="text-amber-400">${indicators.ema20.toFixed(2)}</strong></span>
              <span>EMA50: <strong className="text-blue-400">${indicators.ema50.toFixed(2)}</strong></span>
              <span>EMA200: <strong className="text-purple-400">${indicators.ema200.toFixed(2)}</strong></span>
              <span>ATR(14): <strong className="text-zinc-200">{indicators.atr.toFixed(2)}</strong></span>
              <span>RSI(14): <strong className="text-amber-300">{indicators.rsi}</strong></span>
            </>
          )}
        </div>
        <div className="text-zinc-500 text-[10px]">High Precision XAU/USD Feed</div>
      </div>

      {/* Main Candlestick Chart Area */}
      <div className="relative w-full h-[360px] bg-[#090c12] select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full"
          preserveAspectRatio="none"
          onMouseLeave={() => setHoveredCandle(null)}
        >
          {/* Horizontal Grid lines & Price Labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = paddingTop + ratio * chartHeight;
            const price = maxPrice - ratio * priceRange;
            return (
              <g key={ratio}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#222733"
                  strokeDasharray="3 3"
                  strokeWidth="0.8"
                />
                <text
                  x={width - paddingRight + 6}
                  y={y + 3.5}
                  fill="#71717a"
                  fontSize="9.5"
                  fontFamily="JetBrains Mono"
                >
                  ${price.toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* Bollinger Bands Shading */}
          {showBB && (
            <g opacity="0.15">
              <rect
                x={paddingLeft}
                y={getY(indicators.bb.upper)}
                width={chartWidth}
                height={Math.max(10, getY(indicators.bb.lower) - getY(indicators.bb.upper))}
                fill="#6366f1"
              />
            </g>
          )}

          {/* Selected Signal Level Lines (Entry, SL, TP1, TP2, TP3) */}
          {selectedSignal && (
            <g>
              {/* Stop Loss Line */}
              <line
                x1={paddingLeft}
                y1={getY(selectedSignal.stopLoss)}
                x2={width - paddingRight}
                y2={getY(selectedSignal.stopLoss)}
                stroke="#ef4444"
                strokeWidth="1.2"
                strokeDasharray="4 2"
              />
              <rect
                x={width - paddingRight + 4}
                y={getY(selectedSignal.stopLoss) - 8}
                width="58"
                height="15"
                fill="#ef4444"
                rx="3"
              />
              <text
                x={width - paddingRight + 7}
                y={getY(selectedSignal.stopLoss) + 3}
                fill="#ffffff"
                fontSize="8.5"
                fontFamily="JetBrains Mono"
                fontWeight="bold"
              >
                SL ${selectedSignal.stopLoss.toFixed(1)}
              </text>

              {/* Take Profit 1 */}
              <line
                x1={paddingLeft}
                y1={getY(selectedSignal.tp1)}
                x2={width - paddingRight}
                y2={getY(selectedSignal.tp1)}
                stroke="#10b981"
                strokeWidth="1.2"
                strokeDasharray="4 2"
              />
              <rect
                x={width - paddingRight + 4}
                y={getY(selectedSignal.tp1) - 8}
                width="58"
                height="15"
                fill="#10b981"
                rx="3"
              />
              <text
                x={width - paddingRight + 7}
                y={getY(selectedSignal.tp1) + 3}
                fill="#000000"
                fontSize="8.5"
                fontFamily="JetBrains Mono"
                fontWeight="bold"
              >
                TP1 ${selectedSignal.tp1.toFixed(1)}
              </text>

              {/* Take Profit 2 */}
              <line
                x1={paddingLeft}
                y1={getY(selectedSignal.tp2)}
                x2={width - paddingRight}
                y2={getY(selectedSignal.tp2)}
                stroke="#059669"
                strokeWidth="1"
                strokeDasharray="3 3"
              />

              {/* Take Profit 3 */}
              <line
                x1={paddingLeft}
                y1={getY(selectedSignal.tp3)}
                x2={width - paddingRight}
                y2={getY(selectedSignal.tp3)}
                stroke="#047857"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <rect
                x={width - paddingRight + 4}
                y={getY(selectedSignal.tp3) - 8}
                width="58"
                height="15"
                fill="#059669"
                rx="3"
              />
              <text
                x={width - paddingRight + 7}
                y={getY(selectedSignal.tp3) + 3}
                fill="#ffffff"
                fontSize="8.5"
                fontFamily="JetBrains Mono"
                fontWeight="bold"
              >
                TP3 ${selectedSignal.tp3.toFixed(1)}
              </text>
            </g>
          )}

          {/* Candlesticks Rendering */}
          {candles.map((candle, idx) => {
            const xCenter = paddingLeft + (idx + 0.5) * (chartWidth / candles.length);
            const isBullish = candle.close >= candle.open;
            const candleColor = isBullish ? '#10b981' : '#f43f5e';
            const topBody = getY(Math.max(candle.open, candle.close));
            const bottomBody = getY(Math.min(candle.open, candle.close));
            const bodyHeight = Math.max(1.5, bottomBody - topBody);

            return (
              <g
                key={candle.time}
                className="cursor-crosshair group"
                onMouseEnter={() => setHoveredCandle(candle)}
              >
                {/* Upper and Lower Wick */}
                <line
                  x1={xCenter}
                  y1={getY(candle.high)}
                  x2={xCenter}
                  y2={getY(candle.low)}
                  stroke={candleColor}
                  strokeWidth="1.2"
                />

                {/* Candle Body */}
                <rect
                  x={xCenter - candleWidth / 2}
                  y={topBody}
                  width={candleWidth}
                  height={bodyHeight}
                  fill={isBullish ? '#10b981' : '#f43f5e'}
                  rx="1"
                  className="transition-all hover:brightness-125"
                />

                {/* Volume Bar at base of chart */}
                <rect
                  x={xCenter - candleWidth / 2}
                  y={height - paddingBottom - Math.min(45, (candle.volume / 3500) * 45)}
                  width={candleWidth}
                  height={Math.min(45, (candle.volume / 3500) * 45)}
                  fill={isBullish ? 'rgba(16, 185, 129, 0.22)' : 'rgba(244, 63, 94, 0.22)'}
                  rx="0.5"
                />
              </g>
            );
          })}

          {/* Current Live Price Horizontal Marker */}
          <line
            x1={paddingLeft}
            y1={getY(currentPrice)}
            x2={width - paddingRight}
            y2={getY(currentPrice)}
            stroke="#fbbf24"
            strokeWidth="1.2"
            strokeDasharray="2 2"
          />
          <rect
            x={width - paddingRight + 4}
            y={getY(currentPrice) - 9}
            width="60"
            height="18"
            fill="#f59e0b"
            rx="3"
          />
          <text
            x={width - paddingRight + 7}
            y={getY(currentPrice) + 4}
            fill="#000000"
            fontSize="10"
            fontFamily="JetBrains Mono"
            fontWeight="bold"
          >
            ${currentPrice.toFixed(2)}
          </text>
        </svg>
      </div>

      {/* Sub-Chart Indicator Panel (RSI or MACD) */}
      {activeSubChart !== 'NONE' && (
        <div className="h-[95px] bg-[#07090e] border-t border-zinc-800/80 px-4 py-2 relative flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-mono-numbers">
            <span className="font-semibold text-zinc-400">
              {activeSubChart === 'RSI' ? `RSI(14): ${indicators.rsi}` : `MACD(12, 26, 9) Hist: ${indicators.macd.hist}`}
            </span>
            <span className="text-[10px] text-zinc-500">
              {activeSubChart === 'RSI'
                ? indicators.rsi > 70
                  ? '⚠️ OVERBOUGHT (>70)'
                  : indicators.rsi < 30
                  ? '⚡ OVERSOLD (<30)'
                  : 'NEUTRAL EXPANSION (30-70)'
                : indicators.macd.hist > 0
                ? '✅ BULLISH MOMENTUM'
                : '⚠️ BEARISH MOMENTUM'}
            </span>
          </div>

          <div className="w-full h-[55px] relative mt-1">
            {activeSubChart === 'RSI' ? (
              <svg className="w-full h-full" viewBox="0 0 800 50" preserveAspectRatio="none">
                {/* 70 line */}
                <line x1="0" y1="15" x2="800" y2="15" stroke="#ef4444" strokeDasharray="3 3" strokeWidth="0.8" opacity="0.6" />
                {/* 30 line */}
                <line x1="0" y1="35" x2="800" y2="35" stroke="#10b981" strokeDasharray="3 3" strokeWidth="0.8" opacity="0.6" />

                {/* RSI Polyline */}
                <polyline
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="1.8"
                  points={candles
                    .map((c, idx) => {
                      const x = (idx / (candles.length - 1 || 1)) * 800;
                      // Dynamic simulated oscillator curve
                      const rsiY = 50 - ((indicators.rsi + Math.sin(idx * 0.4) * 8) / 100) * 50;
                      return `${x},${Math.max(5, Math.min(45, rsiY))}`;
                    })
                    .join(' ')}
                />
              </svg>
            ) : (
              <svg className="w-full h-full" viewBox="0 0 800 50" preserveAspectRatio="none">
                {/* Zero line */}
                <line x1="0" y1="25" x2="800" y2="25" stroke="#3f3f46" strokeWidth="1" />
                {/* MACD Histogram bars */}
                {candles.map((_, idx) => {
                  const x = (idx / (candles.length || 1)) * 800;
                  const barH = Math.sin(idx * 0.3) * 18 + indicators.macd.hist * 10;
                  const isPositive = barH >= 0;
                  return (
                    <rect
                      key={idx}
                      x={x}
                      y={isPositive ? 25 - Math.abs(barH) : 25}
                      width="5"
                      height={Math.max(2, Math.abs(barH))}
                      fill={isPositive ? '#10b981' : '#ef4444'}
                      opacity="0.85"
                    />
                  );
                })}
              </svg>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
