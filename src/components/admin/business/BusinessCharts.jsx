import { useState } from 'react';
const formatINR = (val) => {
  const num = Number(val) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
};
export const IncomeExpenseBarChart = ({ data = [], height = 280 }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  if (!data || data.length === 0) {
    return (
      <div className="bm-chart-empty">
        <p>No financial data available for the chart.</p>
      </div>
    );
  }
  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.income || 0, d.expenses || 0, d.profit || 0)),
    1000
  );
  return (
    <div className="bm-chart-container" style={{ minHeight: height }}>
      <div className="bm-chart-legend">
        <div className="bm-legend-item">
          <span className="bm-legend-dot bm-bg-income"></span>
          <span>Income</span>
        </div>
        <div className="bm-legend-item">
          <span className="bm-legend-dot bm-bg-expense"></span>
          <span>Expenses</span>
        </div>
        <div className="bm-legend-item">
          <span className="bm-legend-dot bm-bg-profit"></span>
          <span>Net Profit</span>
        </div>
      </div>
      <div className="bm-bar-chart-body">
        {data.map((item, idx) => {
          const incHeight = Math.max(4, Math.round(((item.income || 0) / maxVal) * 180));
          const expHeight = Math.max(4, Math.round(((item.expenses || 0) / maxVal) * 180));
          const profHeight = Math.max(4, Math.round((Math.max(0, item.netProfit ?? item.profit ?? 0) / maxVal) * 180));
          return (
            <div key={idx} className="bm-bar-group" onMouseEnter={() => setHoveredIdx(idx)} onMouseLeave={() => setHoveredIdx(null)}>
              {hoveredIdx === idx && (
                <div className="bm-chart-tooltip">
                  <strong>{item.monthLabel || item.month || 'Month'}</strong>
                  <div>Income: <span className="text-income">{formatINR(item.income)}</span></div>
                  <div>Expense: <span className="text-expense">{formatINR(item.expenses)}</span></div>
                  <div>Net Profit: <span className="text-profit">{formatINR(item.netProfit ?? item.profit)}</span></div>
                </div>
              )}
              <div className="bm-bars-wrapper">
                <div className="bm-bar-column bm-bar-income" style={{ height: `${incHeight}px` }} title={`Income: ${formatINR(item.income)}`} />
                <div className="bm-bar-column bm-bar-expense" style={{ height: `${expHeight}px` }} title={`Expense: ${formatINR(item.expenses)}`} />
                <div className="bm-bar-column bm-bar-profit" style={{ height: `${profHeight}px` }} title={`Profit: ${formatINR(item.netProfit ?? item.profit)}`} />
              </div>
              <span className="bm-bar-label">{item.monthLabel || item.month || ''}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export const ExpenseCategoryDonutChart = ({ categoryData = {}, totalExpense = 0 }) => {
  const entries = Object.entries(categoryData).filter(([, amt]) => amt > 0);
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#64748B'
  ];
  if (entries.length === 0 || totalExpense === 0) {
    return (
      <div className="bm-chart-empty">
        <p>No expense categories recorded yet.</p>
      </div>
    );
  }
  let cumulativePercent = 0;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="bm-donut-chart-container">
      <div className="bm-donut-visual">
        <svg viewBox="0 0 160 160" className="bm-donut-svg">
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke="rgba(150, 150, 150, 0.15)"
            strokeWidth="24"
          />
          {entries.map(([cat, amt], idx) => {
            const percent = (amt / totalExpense) * 100;
            const strokeDasharray = `${(percent / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((cumulativePercent / 100) * circumference);
            cumulativePercent += percent;
            return (
              <circle
                key={cat}
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke={colors[idx % colors.length]}
                strokeWidth="24"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="bm-donut-segment"
              />
            );
          })}
        </svg>
        <div className="bm-donut-center-label">
          <span className="bm-donut-center-title">Total</span>
          <span className="bm-donut-center-val">{formatINR(totalExpense)}</span>
        </div>
      </div>

      <div className="bm-donut-legend">
        {entries.map(([cat, amt], idx) => {
          const pct = Math.round((amt / totalExpense) * 100);
          return (
            <div key={cat} className="bm-donut-legend-row">
              <div className="bm-donut-legend-info">
                <span
                  className="bm-donut-dot"
                  style={{ backgroundColor: colors[idx % colors.length] }}
                />
                <span className="bm-donut-cat-name">{cat}</span>
              </div>
              <div className="bm-donut-legend-nums">
                <span className="bm-donut-cat-amt">{formatINR(amt)}</span>
                <span className="bm-donut-cat-pct">{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export const ProfitTrendChart = ({ data = [], height = 240 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bm-chart-empty">
        <p>No trend records available.</p>
      </div>
    );
  }
  const values = data.map((d) => d.netProfit ?? d.profit ?? 0);
  const max = Math.max(...values, 1000);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1 || 1)) * 440 + 30;
    const val = d.netProfit ?? d.profit ?? 0;
    const y = 180 - ((val - min) / range) * 140;
    return { x, y, val, label: d.monthLabel || d.month || '' };
  });
  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');
  const areaD = `${pathD} L ${points[points.length - 1].x} 180 L ${points[0].x} 180 Z`;
  return (
    <div className="bm-trend-container" style={{ minHeight: height }}>
      <svg viewBox="0 0 500 220" className="bm-trend-svg">
        <defs>
          <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <line x1="30" y1="40" x2="470" y2="40" stroke="rgba(150,150,150,0.1)" strokeDasharray="3 3" />
        <line x1="30" y1="110" x2="470" y2="110" stroke="rgba(150,150,150,0.1)" strokeDasharray="3 3" />
        <line x1="30" y1="180" x2="470" y2="180" stroke="rgba(150,150,150,0.2)" />
        <path d={areaD} fill="url(#profitGrad)" />
        <path d={pathD} fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="5" fill="#10B981" stroke="#ffffff" strokeWidth="2" />
            <text x={p.x} y="205" textAnchor="middle" fontSize="11" fill="currentColor" opacity="0.7">
              {p.label}
            </text>
            <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#10B981">
              {formatINR(p.val)}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};
