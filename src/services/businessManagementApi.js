try {
  const legacyKeys = [
    'sian_bm_schedules',
    'sian_bm_income',
    'sian_bm_expenses',
    'sian_bm_due_payments',
    'sian_bm_settings',
    'sian_bm_empty_init_v1',
    'sian_bm_mock_cleaned_v2'
  ];
  legacyKeys.forEach(k => {
    if (localStorage.getItem(k)) localStorage.removeItem(k);
  });
} catch (e) {}
export const businessManagementApi = {
  initialize() {},
  getApiUrl() {
    try {
      return localStorage.getItem('sian_bm_sheets_url') || process.env.REACT_APP_GOOGLE_BUSINESS_MANAGEMENT_URL || '';
    } catch (e) {
      return process.env.REACT_APP_GOOGLE_BUSINESS_MANAGEMENT_URL || '';
    }
  },
  setApiUrl(url) {
    try {
      if (url) {
        localStorage.setItem('sian_bm_sheets_url', url.trim());
      } else {
        localStorage.removeItem('sian_bm_sheets_url');
      }
    } catch (e) {}
  },
  isConfigured() {
    const url = this.getApiUrl();
    return Boolean(url && url.startsWith('https://script.google.com/macros/s/'));
  },
  async testConnection(url) {
    const targetUrl = url || this.getApiUrl();
    if (!targetUrl || !targetUrl.startsWith('https://script.google.com/macros/s/')) {
      return { success: false, error: 'Google Apps Script URL is empty or invalid.' };
    }
    try {
      const response = await fetch(`${targetUrl}?action=ping&_t=${Date.now()}`, {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
        redirect: 'follow'
      });
      if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`);
      const data = await response.json();
      return { success: data.success ?? true, message: data.message || 'Connected successfully!' };
    } catch (e) {
      return { success: false, error: e.message || 'Connection failed' };
    }
  },
  async getAllData() {
    const url = this.getApiUrl();
    if (this.isConfigured()) {
      try {
        const response = await fetch(`${url}?action=getAllData&_t=${Date.now()}`, {
          method: 'GET',
          mode: 'cors',
          credentials: 'omit',
          redirect: 'follow'
        });
        if (response.ok) {
          const res = await response.json();
          if (res.success && res.data) {
            return {
              success: true,
              data: {
                schedules: Array.isArray(res.data.schedules) ? res.data.schedules : [],
                income: Array.isArray(res.data.income) ? res.data.income : [],
                expenses: Array.isArray(res.data.expenses) ? res.data.expenses : [],
                duePayments: Array.isArray(res.data.duePayments) ? res.data.duePayments : []
              }
            };
          }
        }
      } catch (err) {
        console.warn('Live fetch for Business Management data failed:', err);
      }
    }
    return {
      success: true,
      data: {
        schedules: [],
        income: [],
        expenses: [],
        duePayments: []
      }
    };
  },
  async createSchedule(schedule) {
    const newId = `SCH-${new Date().toISOString().replace(/\D/g, '').slice(0, 8)}-${String(Math.floor(Math.random() * 900) + 100)}`;
    const newRecord = {
      ...schedule,
      id: schedule.id || newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    if (this.isConfigured()) {
      try {
        const res = await fetch(this.getApiUrl(), {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({ action: 'createSchedule', data: newRecord }),
          redirect: 'follow'
        });
        if (res.ok) {
          const json = await res.json();
          return json.success ? json : { success: true, data: newRecord };
        }
      } catch (e) {
        console.error('Failed to create schedule in Google Apps Script:', e);
      }
    }
    return { success: true, data: newRecord };
  },
  async updateSchedule(schedule) {
    const updated = {
      ...schedule,
      updatedAt: new Date().toISOString()
    };
    if (this.isConfigured()) {
      try {
        const res = await fetch(this.getApiUrl(), {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({ action: 'updateSchedule', data: updated }),
          redirect: 'follow'
        });
        if (res.ok) {
          const json = await res.json();
          return json.success ? json : { success: true, data: updated };
        }
      } catch (e) {
        console.error('Failed to update schedule in Google Apps Script:', e);
      }
    }
    return { success: true, data: updated };
  },
  async deleteSchedule(id) {
    if (this.isConfigured()) {
      try {
        const res = await fetch(this.getApiUrl(), {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({ action: 'deleteSchedule', data: { id } }),
          redirect: 'follow'
        });
        if (res.ok) {
          const json = await res.json();
          return json;
        }
      } catch (e) {
        console.error('Failed to delete schedule in Google Apps Script:', e);
      }
    }
    return { success: true };
  },
  async createIncome(income) {
    const newId = `INC-${new Date().toISOString().replace(/\D/g, '').slice(0, 8)}-${String(Math.floor(Math.random() * 900) + 100)}`;
    const bill = Number(income.billAmount) || 0;
    const purchase = Number(income.purchaseAmount) || 0;
    const newRecord = {
      ...income,
      id: income.id || newId,
      billAmount: bill,
      purchaseAmount: purchase,
      profit: bill - purchase,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    if (this.isConfigured()) {
      try {
        const res = await fetch(this.getApiUrl(), {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({ action: 'createIncome', data: newRecord }),
          redirect: 'follow'
        });
        if (res.ok) {
          const json = await res.json();
          return json.success ? json : { success: true, data: newRecord };
        }
      } catch (e) {
        console.error('Failed to create income in Google Apps Script:', e);
      }
    }
    return { success: true, data: newRecord };
  },
  async updateIncome(income) {
    const bill = Number(income.billAmount) || 0;
    const purchase = Number(income.purchaseAmount) || 0;
    const updated = {
      ...income,
      billAmount: bill,
      purchaseAmount: purchase,
      profit: bill - purchase,
      updatedAt: new Date().toISOString()
    };
    if (this.isConfigured()) {
      try {
        const res = await fetch(this.getApiUrl(), {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({ action: 'updateIncome', data: updated }),
          redirect: 'follow'
        });
        if (res.ok) {
          const json = await res.json();
          return json.success ? json : { success: true, data: updated };
        }
      } catch (e) {
        console.error('Failed to update income in Google Apps Script:', e);
      }
    }
    return { success: true, data: updated };
  },
  async deleteIncome(id) {
    if (this.isConfigured()) {
      try {
        const res = await fetch(this.getApiUrl(), {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({ action: 'deleteIncome', data: { id } }),
          redirect: 'follow'
        });
        if (res.ok) {
          const json = await res.json();
          return json;
        }
      } catch (e) {
        console.error('Failed to delete income in Google Apps Script:', e);
      }
    }
    return { success: true };
  },
  async createExpense(expense) {
    const newId = `EXP-${new Date().toISOString().replace(/\D/g, '').slice(0, 8)}-${String(Math.floor(Math.random() * 900) + 100)}`;
    const newRecord = {
      ...expense,
      id: expense.id || newId,
      amount: Number(expense.amount) || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    if (this.isConfigured()) {
      try {
        const res = await fetch(this.getApiUrl(), {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({ action: 'createExpense', data: newRecord }),
          redirect: 'follow'
        });
        if (res.ok) {
          const json = await res.json();
          return json.success ? json : { success: true, data: newRecord };
        }
      } catch (e) {
        console.error('Failed to create expense in Google Apps Script:', e);
      }
    }
    return { success: true, data: newRecord };
  },
  async updateExpense(expense) {
    const updated = {
      ...expense,
      amount: Number(expense.amount) || 0,
      updatedAt: new Date().toISOString()
    };
    if (this.isConfigured()) {
      try {
        const res = await fetch(this.getApiUrl(), {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({ action: 'updateExpense', data: updated }),
          redirect: 'follow'
        });
        if (res.ok) {
          const json = await res.json();
          return json.success ? json : { success: true, data: updated };
        }
      } catch (e) {
        console.error('Failed to update expense in Google Apps Script:', e);
      }
    }
    return { success: true, data: updated };
  },
  async deleteExpense(id) {
    if (this.isConfigured()) {
      try {
        const res = await fetch(this.getApiUrl(), {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({ action: 'deleteExpense', data: { id } }),
          redirect: 'follow'
        });
        if (res.ok) {
          const json = await res.json();
          return json;
        }
      } catch (e) {
        console.error('Failed to delete expense in Google Apps Script:', e);
      }
    }
    return { success: true };
  },
  async createDuePayment(due) {
    const newId = `DUE-${new Date().toISOString().replace(/\D/g, '').slice(0, 8)}-${String(Math.floor(Math.random() * 900) + 100)}`;
    const newRecord = {
      ...due,
      id: due.id || newId,
      amount: Number(due.amount) || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    if (this.isConfigured()) {
      try {
        const res = await fetch(this.getApiUrl(), {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({ action: 'createDuePayment', data: newRecord }),
          redirect: 'follow'
        });
        if (res.ok) {
          const json = await res.json();
          return json.success ? json : { success: true, data: newRecord };
        }
      } catch (e) {
        console.error('Failed to create due payment in Google Apps Script:', e);
      }
    }
    return { success: true, data: newRecord };
  },
  async updateDuePayment(due) {
    const updated = {
      ...due,
      amount: Number(due.amount) || 0,
      updatedAt: new Date().toISOString()
    };
    if (this.isConfigured()) {
      try {
        const res = await fetch(this.getApiUrl(), {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({ action: 'updateDuePayment', data: updated }),
          redirect: 'follow'
        });
        if (res.ok) {
          const json = await res.json();
          return json.success ? json : { success: true, data: updated };
        }
      } catch (e) {
        console.error('Failed to update due payment in Google Apps Script:', e);
      }
    }
    return { success: true, data: updated };
  },
  async deleteDuePayment(id) {
    if (this.isConfigured()) {
      try {
        const res = await fetch(this.getApiUrl(), {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({ action: 'deleteDuePayment', data: { id } }),
          redirect: 'follow'
        });
        if (res.ok) {
          const json = await res.json();
          return json;
        }
      } catch (e) {
        console.error('Failed to delete due payment in Google Apps Script:', e);
      }
    }
    return { success: true };
  }
};