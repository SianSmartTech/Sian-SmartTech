import {
  TrendingUp,
  Receipt,
  DollarSign,
  CalendarCheck,
  ClockAlert,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { IncomeExpenseBarChart, ExpenseCategoryDonutChart } from './BusinessCharts';
const formatINR = (val) => {
  const num = Number(val) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
};
export const BusinessDashboard = ({
  schedules = [],
  income = [],
  expenses = [],
  duePayments = [],
  onOpenModal,
  onNavigateTab
}) => {
  const totalIncome = income.reduce((acc, i) => acc + (Number(i.billAmount) || 0), 0);
  const totalPurchase = income.reduce((acc, i) => acc + (Number(i.purchaseAmount) || 0), 0);
  const grossProfit = totalIncome - totalPurchase;
  const totalExpenses = expenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
  const netProfit = grossProfit - totalExpenses;
  const pendingDues = duePayments.filter((d) => d.status !== 'Paid');
  const overdueDues = duePayments.filter((d) => d.status === 'Overdue');
  const pendingDueTotal = pendingDues.reduce((acc, d) => acc + (Number(d.amount) || 0), 0);
  const pendingSchedules = schedules.filter((s) => s.status === 'Pending' || s.status === 'In Progress');
  const categoryExpenses = expenses.reduce((acc, e) => {
    const cat = e.category || 'Other';
    acc[cat] = (acc[cat] || 0) + (Number(e.amount) || 0);
    return acc;
  }, {});
  const monthlyMap = {};
  const getMonthKey = (dStr) => (dStr ? dStr.substring(0, 7) : '2026-08');
  const getMonthLabel = (dStr) => {
    try {
      const [y, m] = (dStr || '2026-08').split('-');
      const d = new Date(parseInt(y), parseInt(m) - 1, 1);
      return d.toLocaleString('en-US', { month: 'short' });
    } catch (e) {
      return dStr;
    }
  };
  income.forEach((inc) => {
    const k = getMonthKey(inc.date);
    if (!monthlyMap[k]) {
      monthlyMap[k] = { month: k, monthLabel: getMonthLabel(inc.date), income: 0, expenses: 0, profit: 0 };
    }
    const bill = Number(inc.billAmount) || 0;
    const cost = Number(inc.purchaseAmount) || 0;
    monthlyMap[k].income += bill;
    monthlyMap[k].profit += bill - cost;
  });
  expenses.forEach((exp) => {
    const k = getMonthKey(exp.date);
    if (!monthlyMap[k]) {
      monthlyMap[k] = { month: k, monthLabel: getMonthLabel(exp.date), income: 0, expenses: 0, profit: 0 };
    }
    monthlyMap[k].expenses += Number(exp.amount) || 0;
  });
  const chartData = Object.values(monthlyMap)
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6)
    .map((m) => ({
      ...m,
      netProfit: m.profit - m.expenses
    }));
  return (
    <div className="bm-dashboard-wrapper">
      <div className="bm-hero-banner">
        <div className="bm-hero-left">
          <div className="bm-hero-badge">
            <Sparkles size={14} /> Business Command Center
          </div>
          <h2 className="bm-hero-title">Business & Financial Operations</h2>
          <p className="bm-hero-desc">
            Manage your daily service workflow, sales revenue, operating expenses, and recurring dues in real-time.
          </p>
        </div>
        <div className="bm-quick-actions-row">
          <button className="bm-action-btn primary" onClick={() => onOpenModal('income')}>
            <Plus size={16} /> Log Income
          </button>
          <button className="bm-action-btn secondary" onClick={() => onOpenModal('expense')}>
            <Plus size={16} /> Add Expense
          </button>
          <button className="bm-action-btn outline" onClick={() => onOpenModal('schedule')}>
            <Plus size={16} /> New Schedule
          </button>
        </div>
      </div>
      <div className="bm-stats-grid">
        <div className="bm-stat-card card-emerald">
          <div className="bm-stat-header">
            <span className="bm-stat-label">Total Revenue (Sales)</span>
            <div className="bm-stat-icon-wrap emerald"><DollarSign size={20} /></div>
          </div>
          <div className="bm-stat-val">{formatINR(totalIncome)}</div>
          <div className="bm-stat-footer">
            <span className="bm-stat-pill emerald"><ArrowUpRight size={13} /> Gross</span>
            <span className="bm-stat-sub">From {income.length} client sales</span>
          </div>
        </div>
        <div className="bm-stat-card card-rose">
          <div className="bm-stat-header">
            <span className="bm-stat-label">Total Operating Expenses</span>
            <div className="bm-stat-icon-wrap rose"><Receipt size={20} /></div>
          </div>
          <div className="bm-stat-val">{formatINR(totalExpenses)}</div>
          <div className="bm-stat-footer">
            <span className="bm-stat-pill rose"><ArrowDownRight size={13} /> Overheads</span>
            <span className="bm-stat-sub">{expenses.length} expense logs</span>
          </div>
        </div>
        <div className="bm-stat-card card-indigo">
          <div className="bm-stat-header">
            <span className="bm-stat-label">Net Business Profit</span>
            <div className="bm-stat-icon-wrap indigo"><TrendingUp size={20} /></div>
          </div>
          <div className="bm-stat-val">{formatINR(netProfit)}</div>
          <div className="bm-stat-footer">
            <span className={`bm-stat-pill ${netProfit >= 0 ? 'emerald' : 'rose'}`}>
              {totalIncome > 0 ? `${Math.round((netProfit / totalIncome) * 100)}% Margin` : '0%'}
            </span>
            <span className="bm-stat-sub">After all expenses</span>
          </div>
        </div>
        <div className="bm-stat-card card-amber">
          <div className="bm-stat-header">
            <span className="bm-stat-label">Upcoming / Overdue Dues</span>
            <div className="bm-stat-icon-wrap amber"><ClockAlert size={20} /></div>
          </div>
          <div className="bm-stat-val">{formatINR(pendingDueTotal)}</div>
          <div className="bm-stat-footer">
            {overdueDues.length > 0 ? (
              <span className="bm-stat-pill rose"><AlertTriangle size={13} /> {overdueDues.length} Overdue</span>
            ) : (
              <span className="bm-stat-pill emerald">All on Track</span>
            )}
            <span className="bm-stat-sub">{pendingDues.length} pending obligations</span>
          </div>
        </div>
      </div>
      <div className="bm-charts-split">
        <div className="bm-panel-card">
          <div className="bm-panel-header">
            <div>
              <h3 className="bm-panel-title">Income vs Expenses Overview</h3>
              <p className="bm-panel-sub">Monthly trend comparison of gross revenue & overheads</p>
            </div>
            <button className="bm-link-btn" onClick={() => onNavigateTab('analysis')}>
              View Details <ChevronRight size={14} />
            </button>
          </div>
          <IncomeExpenseBarChart data={chartData} height={260} />
        </div>
        <div className="bm-panel-card">
          <div className="bm-panel-header">
            <div>
              <h3 className="bm-panel-title">Expense Distribution</h3>
              <p className="bm-panel-sub">Category-wise breakdown of business operating costs</p>
            </div>
            <button className="bm-link-btn" onClick={() => onNavigateTab('expenses')}>
              All Expenses <ChevronRight size={14} />
            </button>
          </div>
          <ExpenseCategoryDonutChart categoryData={categoryExpenses} totalExpense={totalExpenses} />
        </div>
      </div>
      <div className="bm-bottom-grid">
        <div className="bm-panel-card">
          <div className="bm-panel-header">
            <div className="bm-panel-title-with-badge">
              <CalendarCheck size={18} className="text-indigo" />
              <div>
                <h3 className="bm-panel-title">Active Work Schedules</h3>
                <p className="bm-panel-sub">Upcoming repair & installation tasks ({pendingSchedules.length} active)</p>
              </div>
            </div>
            <button className="bm-link-btn" onClick={() => onNavigateTab('schedule')}>
              View All <ChevronRight size={14} />
            </button>
          </div>
          <div className="bm-table-responsive">
            <table className="bm-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Work Scope</th>
                  <th>Technician</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pendingSchedules.slice(0, 4).map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div className="bm-cell-primary">{s.customerName}</div>
                      <div className="bm-cell-sub">{s.customerPhone}</div>
                    </td>
                    <td>
                      <div className="bm-cell-desc truncate-1">{s.workDescription}</div>
                    </td>
                    <td>
                      <span className="bm-tech-badge">{s.assignedTo || 'Unassigned'}</span>
                    </td>
                    <td>
                      <span className={`bm-priority-badge priority-${(s.priority || 'medium').toLowerCase()}`}>
                        {s.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`bm-status-pill status-${(s.status || 'pending').toLowerCase().replace(' ', '-')}`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {pendingSchedules.length === 0 && (
                  <tr>
                    <td colSpan={5} className="bm-empty-cell">No active work schedules pending!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bm-panel-card">
          <div className="bm-panel-header">
            <div className="bm-panel-title-with-badge">
              <ClockAlert size={18} className="text-amber" />
              <div>
                <h3 className="bm-panel-title">Due & Recurring Payments</h3>
                <p className="bm-panel-sub">EMIs, utilities, rent & vendor obligations</p>
              </div>
            </div>
            <button className="bm-link-btn" onClick={() => onNavigateTab('due-payments')}>
              Manage Dues <ChevronRight size={14} />
            </button>
          </div>
          <div className="bm-dues-list">
            {pendingDues.slice(0, 4).map((d) => (
              <div key={d.id} className="bm-due-item">
                <div className="bm-due-left">
                  <div className={`bm-due-type-badge type-${(d.dueType || 'other').toLowerCase()}`}>
                    {d.dueType}
                  </div>
                  <div className="bm-due-info">
                    <div className="bm-due-name">{d.name}</div>
                    <div className="bm-due-date">Due: {d.dueDate || 'N/A'} • {d.frequency || 'Monthly'}</div>
                  </div>
                </div>
                <div className="bm-due-right">
                  <div className="bm-due-amount">{formatINR(d.amount)}</div>
                  <span className={`bm-status-pill status-${(d.status || 'pending').toLowerCase()}`}>
                    {d.status}
                  </span>
                </div>
              </div>
            ))}
            {pendingDues.length === 0 && (
              <div className="bm-empty-cell py-8">All due payments are settled!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
