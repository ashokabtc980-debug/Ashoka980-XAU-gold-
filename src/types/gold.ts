export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface IndicatorsState {
  rsi: number;
  macd: {
    macd: number;
    signal: number;
    hist: number;
  };
  ema20: number;
  ema50: number;
  ema200: number;
  bb: {
    upper: number;
    middle: number;
    lower: number;
  };
  atr: number;
  trend: 'Bullish' | 'Bearish' | 'Neutral';
  support: number;
  resistance: number;
  volumeSurge: boolean;
}

export interface SignalScoreBreakdown {
  trend: {
    status: 'Bullish' | 'Bearish' | 'Neutral';
    passed: boolean;
    label: string;
    points: number;
  };
  ema: {
    status: string;
    passed: boolean;
    label: string;
    points: number;
  };
  rsi: {
    value: number;
    passed: boolean;
    label: string;
    points: number;
  };
  macd: {
    status: string;
    passed: boolean;
    label: string;
    points: number;
  };
  supportResistance: {
    status: string;
    passed: boolean;
    label: string;
    points: number;
  };
  newsRisk: {
    level: 'LOW' | 'MEDIUM' | 'HIGH';
    passed: boolean;
    label: string;
    points: number;
  };
  scoreTotal: number;
  verdict: 'STRONG BUY' | 'BUY' | 'BUY WATCH' | 'WAIT / NEUTRAL' | 'SELL WATCH' | 'SELL' | 'STRONG SELL';
}

export interface SignalItem {
  id: string;
  timestamp: number;
  timeframe: '1M' | '5M' | '15M' | '1H' | '4H';
  action: 'STRONG BUY' | 'BUY' | 'WAIT' | 'SELL' | 'STRONG SELL';
  strategy: 'Scalp Momentum' | 'Trend Continuation' | 'Order Block Bounce' | 'Break & Retest' | 'Mean Reversion';
  entryZone: string;
  entryPrice: number;
  stopLoss: number;
  tp1: number;
  tp2: number;
  tp3: number;
  riskReward: string;
  confidence: number;
  status: 'ACTIVE' | 'HIT_TP1' | 'HIT_TP2' | 'HIT_TP3' | 'STOPPED' | 'EXPIRED';
  signalScore: SignalScoreBreakdown;
  rationale: string;
}

export interface EconomicEvent {
  id: string;
  title: string;
  time: string;
  date: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  forecast: string;
  previous: string;
  actual?: string;
  goldBias: string;
  category: string;
}

export interface PaperTrade {
  id: string;
  signalId?: string;
  symbol: 'XAU/USD';
  side: 'BUY' | 'SELL';
  entryPrice: number;
  currentPrice: number;
  stopLoss: number;
  takeProfit: number;
  lotSize: number;
  contractType: 'Standard (100oz)' | 'Mini (10oz)' | 'Micro (1oz)';
  openTime: number;
  closeTime?: number;
  status: 'OPEN' | 'CLOSED';
  pnl: number;
  pnlPercent: number;
  closeReason?: string;
}

export interface BacktestTrade {
  id: string;
  type: 'BUY' | 'SELL';
  entryPrice: number;
  exitPrice: number;
  entryTime: string;
  exitTime: string;
  pnl: number;
  pnlPips: number;
  outcome: 'WIN' | 'LOSS';
  reason: string;
}

export interface BacktestResult {
  strategyName: string;
  timeframe: string;
  lookbackBars: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  profitFactor: number;
  netProfit: number;
  netProfitPercent: number;
  maxDrawdown: number;
  avgWin: number;
  avgLoss: number;
  consecutiveWins: number;
  trades: BacktestTrade[];
}
