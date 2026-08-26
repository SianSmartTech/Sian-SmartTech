import { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Receipt,
  Percent,
} from 'lucide-react';
import {
  IncomeExpenseBarChart,
  ExpenseCategoryDonutChart,
  ProfitTrendChart
} from './BusinessCharts';
const formatINR = (val) => {
  const num = Number(val) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
};
export const BusinessAnalysisView = ({ income = [], expenses = [] }) => {
  const totalRevenue = income.reduce((acc, i) => acc + (Number(i.billAmount) || 0), 0);
  const totalPurchaseCost = income.reduce((acc, i) => acc + (Number(i.purchaseAmount) || 0), 0);
  const grossProfit = totalRevenue - totalPurchaseCost;
  const totalExpenses = expenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
  const netProfit = grossProfit - totalExpenses;
  const netMargin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;
  const monthlyMap = {};
  const getMonthKey = (dStr) => (dStr ? dStr.substring(0, 7) : '2026-08');
  const getMonthLabel = (dStr) => {
    try {
      const [y, m] = (dStr || '2026-08').split('-');
      const d = new Date(parseInt(y), parseInt(m) - 1, 1);
      return d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
    } catch (e) {
      return dStr;
    }
  };
  income.forEach((inc) => {
    const k = getMonthKey(inc.date);
    if (!monthlyMap[k]) {
      monthlyMap[k] = {
        month: k,
        monthLabel: getMonthLabel(inc.date),
        income: 0,
        purchase: 0,
        grossProfit: 0,
        expenses: 0,
        netProfit: 0
      };
    }
    const bill = Number(inc.billAmount) || 0;
    const cost = Number(inc.purchaseAmount) || 0;
    monthlyMap[k].income += bill;
    monthlyMap[k].purchase += cost;
    monthlyMap[k].grossProfit += bill - cost;
  });
  expenses.forEach((exp) => {
    const k = getMonthKey(exp.date);
    if (!monthlyMap[k]) {
      monthlyMap[k] = {
        month: k,
        monthLabel: getMonthLabel(exp.date),
        income: 0,
        purchase: 0,
        grossProfit: 0,
        expenses: 0,
        netProfit: 0
      };
    }
    monthlyMap[k].expenses += Number(exp.amount) || 0;
  });
  const monthlyList = Object.values(monthlyMap)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((m) => {
      const nProf = m.grossProfit - m.expenses;
      const margin = m.income > 0 ? Math.round((nProf / m.income) * 100) : 0;
      return {
        ...m,
        profit: m.grossProfit,
        netProfit: nProf,
        margin
      };
    });
  const categoryExpenses = expenses.reduce((acc, e) => {
    const cat = e.category || 'Other';
    acc[cat] = (acc[cat] || 0) + (Number(e.amount) || 0);
    return acc;
  }, {});
  return (
    <div className="bm-view-container">
      <div className="bm-view-header">
        <div>
          <h2 className="bm-view-title">Business Analytics & Profit Intelligence</h2>
          <p className="bm-view-sub">
            Deep financial insights, monthly profit trajectories, margin health and cost efficiency
          </p>
        </div>
      </div>
      <div className="bm-analysis-kpi-grid">
        <div className="bm-analysis-card">
          <div className="bm-analysis-card-head">
            <span>Gross Revenue</span>
            <DollarSign size={18} className="text-emerald" />
          </div>
          <div className="bm-analysis-val">{formatINR(totalRevenue)}</div>
          <div className="bm-analysis-sub">From all customer sales & billings</div>
        </div>
        <div className="bm-analysis-card">
          <div className="bm-analysis-card-head">
            <span>Operating Overheads</span>
            <Receipt size={18} className="text-rose" />
          </div>
          <div className="bm-analysis-val">{formatINR(totalExpenses)}</div>
          <div className="bm-analysis-sub">Office, power, staff & tools</div>
        </div>
        <div className="bm-analysis-card">
          <div className="bm-analysis-card-head">
            <span>Net Profit After Overheads</span>
            <TrendingUp size={18} className="text-indigo" />
          </div>
          <div className="bm-analysis-val text-indigo">{formatINR(netProfit)}</div>
          <div className="bm-analysis-sub">Net retained business earnings</div>
        </div>
        <div className="bm-analysis-card">
          <div className="bm-analysis-card-head">
            <span>Net Profit Margin</span>
            <Percent size={18} className="text-blue" />
          </div>
          <div className="bm-analysis-val text-blue">{netMargin}%</div>
          <div className="bm-analysis-sub">Healthy business performance</div>
        </div>
      </div>
      <div className="bm-analysis-charts-row">
        <div className="bm-panel-card flex-1">
          <div className="bm-panel-header">
            <div>
              <h3 className="bm-panel-title">Net Profit Trajectory</h3>
              <p className="bm-panel-sub">Month-over-month retained business profit</p>
            </div>
            <span className="bm-chip-green">Live Trend</span>
          </div>
          <ProfitTrendChart data={monthlyList} height={230} />
        </div>
        <div className="bm-panel-card bm-donut-panel">
          <div className="bm-panel-header">
            <div>
              <h3 className="bm-panel-title">Overhead Allocation</h3>
              <p className="bm-panel-sub">Percentage split by operational category</p>
            </div>
          </div>
          <ExpenseCategoryDonutChart categoryData={categoryExpenses} totalExpense={totalExpenses} />
        </div>
      </div>
      <div className="bm-panel-card">
        <div className="bm-panel-header">
          <div>
            <h3 className="bm-panel-title">Monthly Revenue vs Overhead Comparison</h3>
            <p className="bm-panel-sub">Detailed cash flow comparison for recent operational cycles</p>
          </div>
        </div>
        <IncomeExpenseBarChart data={monthlyList} height={260} />
      </div>
      <div className="bm-table-card mt-6">
        <div className="bm-panel-header px-5 py-4 border-b border-slate-100">
          <h3 className="bm-panel-title">Monthly Financial Statement Summary</h3>
        </div>
        <div className="bm-table-responsive">
          <table className="bm-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Revenue (Sales)</th>
                <th>Purchases / COGS</th>
                <th>Gross Profit</th>
                <th>Expenses</th>
                <th>Net Profit</th>
                <th>Net Margin</th>
              </tr>
            </thead>
            <tbody>
              {monthlyList.map((m) => (
                <tr key={m.month}>
                  <td><strong>{m.monthLabel}</strong></td>
                  <td><span className="text-emerald">{formatINR(m.income)}</span></td>
                  <td><span className="text-slate">{formatINR(m.purchase)}</span></td>
                  <td><span className="text-blue font-bold">{formatINR(m.grossProfit)}</span></td>
                  <td><span className="text-rose">{formatINR(m.expenses)}</span></td>
                  <td>
                    <span className={`font-extrabold ${m.netProfit >= 0 ? 'text-emerald' : 'text-rose'}`}>
                      {formatINR(m.netProfit)}
                    </span>
                  </td>
                  <td>
                    <span className={`bm-status-pill ${m.margin >= 30 ? 'status-completed' : m.margin >= 10 ? 'status-confirmed' : 'status-pending'}`}>
                      {m.margin}%
                    </span>
                  </td>
                </tr>
              ))}
              {monthlyList.length === 0 && (
                <tr>
                  <td colSpan={7} className="bm-empty-cell py-8">No monthly records available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
