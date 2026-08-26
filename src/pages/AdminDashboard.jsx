import { useState, useEffect } from 'react';
import { toast, Toaster } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { bookingStore } from '../utils/bookingStore';
import { businessManagementApi } from '../services/businessManagementApi';
import { validateCustomerPhone, validateCustomerEmail } from '../utils/validation';
import { AdminSidebar } from '../components/admin/layout/AdminSidebar';
import { AdminHeader } from '../components/admin/layout/AdminHeader';
import { BusinessDashboard } from '../components/admin/business/BusinessDashboard';
import { WorkScheduleView } from '../components/admin/business/WorkScheduleView';
import { IncomeView } from '../components/admin/business/IncomeView';
import { ExpensesView } from '../components/admin/business/ExpensesView';
import { DuePaymentsView } from '../components/admin/business/DuePaymentsView';
import { BusinessAnalysisView } from '../components/admin/business/BusinessAnalysisView';
import {
  ScheduleModal,
  IncomeModal,
  ExpenseModal,
  DuePaymentModal
} from '../components/admin/business/BusinessModals';
import InvoiceGenerator from '../components/InvoiceGenerator';
import { BookingsOverview } from '../components/admin/bookings/BookingsOverview';
import { HardwareLedgerView } from '../components/admin/bookings/HardwareLedgerView';
import { ITLedgerView } from '../components/admin/bookings/ITLedgerView';
import { OtherLedgerView } from '../components/admin/bookings/OtherLedgerView';
import { EmailOutboxView } from '../components/admin/bookings/EmailOutboxView';
import { BookingDrawers } from '../components/admin/bookings/BookingDrawers';
import '../css/AdminDashboard.css';
const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('bm-dashboard');
  const [dashSubTab, setDashSubTab] = useState('hardware');
  const [bookings, setBookings] = useState([]);
  const [itBookings, setITBookings] = useState([]);
  const [otherBookings, setOtherBookings] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [duePayments, setDuePayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedOtherBooking, setSelectedOtherBooking] = useState(null);
  const [isOtherDrawerOpen, setIsOtherDrawerOpen] = useState(false);
  const [isAddOtherOpen, setIsAddOtherOpen] = useState(false);
  const [isAddITOpen, setIsAddITOpen] = useState(false);
  const [newOtherBooking, setNewOtherBooking] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    serviceType: '',
    issue: '',
    estimatedCost: '₹350+',
    estimatedTurnaround: 'TBD',
    status: 'Pending',
    notes: 'Awaiting admin review.'
  });
  const [newITBooking, setNewITBooking] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    service: 'Website Development & Design',
    issue: '',
    estimatedCost: 'Based on Project',
    estimatedDelivery: '1-2 Weeks',
    status: 'Pending',
    notes: 'Awaiting IT consultation.'
  });
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editCost, setEditCost] = useState('');
  const [editDelivery, setEditDelivery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [otherBookingToDelete, setOtherBookingToDelete] = useState(null);
  const [itBookingToDelete, setITBookingToDelete] = useState(null);
  const [activeBmModal, setActiveBmModal] = useState(null);
  const [editingBmItem, setEditingBmItem] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const refreshData = async () => {
    setIsSyncing(true);
    setBookings(bookingStore.getAllHardwareBookings());
    setITBookings(bookingStore.getAllITBookings());
    setOtherBookings(bookingStore.getAllOtherBookings());
    setEmailLogs(bookingStore.getEmailLogs());
    try {
      if (bookingStore.isHardwareGoogleSheetsConfigured()) {
        const freshHw = await bookingStore.fetchHardwareBookings();
        setBookings(freshHw);
      }
      if (bookingStore.isITGoogleSheetsConfigured()) {
        const freshIt = await bookingStore.fetchITBookings();
        setITBookings(freshIt);
      }
      if (bookingStore.isOtherBookingsConfigured()) {
        const freshOther = await bookingStore.fetchOtherBookings();
        setOtherBookings(freshOther);
      }
      if (bookingStore.isInvoiceConfigured()) {
        const freshInvoices = await bookingStore.fetchInvoices();
        setInvoices(freshInvoices);
      } else {
        setInvoices([]);
      }
      const freshLogs = await bookingStore.fetchEmailLogs();
      setEmailLogs(freshLogs);
      const bmRes = await businessManagementApi.getAllData();
      if (bmRes.success && bmRes.data) {
        setSchedules(bmRes.data.schedules || []);
        setIncome(bmRes.data.income || []);
        setExpenses(bmRes.data.expenses || []);
        setDuePayments(bmRes.data.duePayments || []);
      }
    } catch (err) {
      console.error('Failed to sync with Google Sheets:', err);
      toast.error('Sync issue: ' + err.message);
    } finally {
      setIsSyncing(false);
    }
  };
  useEffect(() => {
    refreshData();
  }, []);
  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Successfully logged out');
    } catch (err) {
      toast.error('Failed to log out: ' + err.message);
    }
  };
  const fmtDate = (iso) => {
    if (!iso) return '–';
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  const handleOpenBmModal = (modalType, item = null) => {
    setEditingBmItem(item);
    setActiveBmModal(modalType);
  };
  const handleCloseBmModal = () => {
    setActiveBmModal(null);
    setEditingBmItem(null);
  };
  const handleSaveSchedule = async (scheduleData) => {
    const toastId = toast.loading(scheduleData.id ? 'Updating schedule...' : 'Creating schedule...');
    try {
      let res;
      if (scheduleData.id) {
        res = await businessManagementApi.updateSchedule(scheduleData);
      } else {
        res = await businessManagementApi.createSchedule(scheduleData);
      }
      if (res.success) {
        toast.success(scheduleData.id ? 'Schedule updated!' : 'Schedule created!', { id: toastId });
        handleCloseBmModal();
        refreshData();
      } else {
        toast.error(res.error || 'Failed to save schedule', { id: toastId });
      }
    } catch (e) {
      toast.error('Error: ' + e.message, { id: toastId });
    }
  };
  const handleDeleteSchedule = async (id) => {
    const toastId = toast.loading('Deleting schedule...');
    try {
      const res = await businessManagementApi.deleteSchedule(id);
      if (res.success) {
        toast.success('Schedule deleted', { id: toastId });
        refreshData();
      } else {
        toast.error('Failed to delete schedule', { id: toastId });
      }
    } catch (e) {
      toast.error('Error: ' + e.message, { id: toastId });
    }
  };
  const handleUpdateScheduleStatus = async (schedule, newStatus) => {
    try {
      await businessManagementApi.updateSchedule({ ...schedule, status: newStatus });
      toast.success(`Task status updated to ${newStatus}`);
      refreshData();
    } catch (e) {
      toast.error('Failed to update status');
    }
  };
  const handleSaveIncome = async (incomeData) => {
    const toastId = toast.loading(incomeData.id ? 'Updating income...' : 'Recording income...');
    try {
      let res;
      if (incomeData.id) {
        res = await businessManagementApi.updateIncome(incomeData);
      } else {
        res = await businessManagementApi.createIncome(incomeData);
      }
      if (res.success) {
        toast.success(incomeData.id ? 'Income updated!' : 'Income recorded!', { id: toastId });
        handleCloseBmModal();
        refreshData();
      } else {
        toast.error(res.error || 'Failed to save income', { id: toastId });
      }
    } catch (e) {
      toast.error('Error: ' + e.message, { id: toastId });
    }
  };
  const handleDeleteIncome = async (id) => {
    const toastId = toast.loading('Deleting income record...');
    try {
      const res = await businessManagementApi.deleteIncome(id);
      if (res.success) {
        toast.success('Income entry removed', { id: toastId });
        refreshData();
      } else {
        toast.error('Failed to delete income', { id: toastId });
      }
    } catch (e) {
      toast.error('Error: ' + e.message, { id: toastId });
    }
  };
  const handleSaveExpense = async (expenseData) => {
    const toastId = toast.loading(expenseData.id ? 'Updating expense...' : 'Logging expense...');
    try {
      let res;
      if (expenseData.id) {
        res = await businessManagementApi.updateExpense(expenseData);
      } else {
        res = await businessManagementApi.createExpense(expenseData);
      }
      if (res.success) {
        toast.success(expenseData.id ? 'Expense updated!' : 'Expense logged!', { id: toastId });
        handleCloseBmModal();
        refreshData();
      } else {
        toast.error(res.error || 'Failed to save expense', { id: toastId });
      }
    } catch (e) {
      toast.error('Error: ' + e.message, { id: toastId });
    }
  };
  const handleDeleteExpense = async (id) => {
    const toastId = toast.loading('Deleting expense...');
    try {
      const res = await businessManagementApi.deleteExpense(id);
      if (res.success) {
        toast.success('Expense record deleted', { id: toastId });
        refreshData();
      } else {
        toast.error('Failed to delete expense', { id: toastId });
      }
    } catch (e) {
      toast.error('Error: ' + e.message, { id: toastId });
    }
  };
  const handleSaveDuePayment = async (dueData) => {
    const toastId = toast.loading(dueData.id ? 'Updating due payment...' : 'Creating due payment...');
    try {
      let res;
      if (dueData.id) {
        res = await businessManagementApi.updateDuePayment(dueData);
      } else {
        res = await businessManagementApi.createDuePayment(dueData);
      }
      if (res.success) {
        toast.success(dueData.id ? 'Due payment updated!' : 'Due payment scheduled!', { id: toastId });
        handleCloseBmModal();
        refreshData();
      } else {
        toast.error(res.error || 'Failed to save due payment', { id: toastId });
      }
    } catch (e) {
      toast.error('Error: ' + e.message, { id: toastId });
    }
  };
  const handleDeleteDuePayment = async (id) => {
    const toastId = toast.loading('Deleting due payment...');
    try {
      const res = await businessManagementApi.deleteDuePayment(id);
      if (res.success) {
        toast.success('Due payment removed', { id: toastId });
        refreshData();
      } else {
        toast.error('Failed to delete due payment', { id: toastId });
      }
    } catch (e) {
      toast.error('Error: ' + e.message, { id: toastId });
    }
  };
  const handleMarkDuePaid = async (due) => {
    const toastId = toast.loading('Marking due payment as paid...');
    try {
      const res = await businessManagementApi.updateDuePayment({
        ...due,
        status: 'Paid',
        paidDate: new Date().toISOString().split('T')[0]
      });
      if (res.success) {
        toast.success('Obligation marked as Settled / Paid!', { id: toastId });
        refreshData();
      }
    } catch (e) {
      toast.error('Failed to mark paid', { id: toastId });
    }
  };
  const openDrawer = (booking) => {
    setSelectedBooking(booking);
    setEditStatus(booking.status);
    setEditNotes(booking.notes || '');
    setEditCost(booking.estimatedCost || '');
    setEditDelivery(booking.estimatedDelivery || '');
    setIsDrawerOpen(true);
  };
  const handleSave = async (e) => {
    e.preventDefault();
    if (!selectedBooking) return;
    const isIT = selectedBooking.type === 'IT' || (selectedBooking.id || '').startsWith('it-bk-');
    const toastId = toast.loading(`Updating ${isIT ? 'IT' : 'Hardware'} ticket in Google Sheets...`);
    try {
      const updated = isIT
        ? await bookingStore.updateITBooking(selectedBooking.id, {
            status: editStatus,
            notes: editNotes,
            estimatedCost: editCost,
            estimatedDelivery: editDelivery
          })
        : await bookingStore.updateBooking(selectedBooking.id, {
            status: editStatus,
            notes: editNotes,
            estimatedCost: editCost,
            estimatedDelivery: editDelivery
          });
      if (updated) {
        toast.success(`Ticket ${updated.ticketId} updated successfully!`, { id: toastId });
        setIsDrawerOpen(false);
        refreshData();
      } else {
        toast.error('Update failed. Booking not found.', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to sync changes with Google Sheets.', { id: toastId });
    }
  };
  const quickConfirm = async (booking, isIT = false) => {
    const toastId = toast.loading('Confirming booking & generating ticket email...');
    try {
      const updated = isIT
        ? await bookingStore.updateITBooking(booking.id, {
            status: 'Confirmed',
            notes: 'IT booking confirmed. Assigning consultant.',
            estimatedDelivery: '1 Week'
          })
        : await bookingStore.updateBooking(booking.id, {
            status: 'Confirmed',
            notes: 'Booking confirmed. Scheduling technician.',
            estimatedDelivery: 'Within 2 days'
          });
      if (updated) {
        toast.success(`Booking confirmed! Ticket: ${updated.ticketId}`, { id: toastId });
        refreshData();
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to confirm booking.', { id: toastId });
    }
  };
  const openOtherDrawer = (booking) => {
    setSelectedOtherBooking(booking);
    setEditStatus(booking.status);
    setEditNotes(booking.notes || '');
    setEditCost(booking.estimatedCost || '');
    setEditDelivery(booking.estimatedTurnaround || '');
    setIsOtherDrawerOpen(true);
  };
  const handleOtherSave = async (e) => {
    e.preventDefault();
    if (!selectedOtherBooking) return;
    const toastId = toast.loading('Updating other booking in Google Sheets...');
    try {
      const updated = await bookingStore.updateOtherBooking(selectedOtherBooking.id, {
        status: editStatus,
        notes: editNotes,
        estimatedCost: editCost,
        estimatedTurnaround: editDelivery
      });
      if (updated) {
        toast.success('Booking updated successfully!', { id: toastId });
        setIsOtherDrawerOpen(false);
        refreshData();
      } else {
        toast.error('Update failed.', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to sync changes with Google Sheets.', { id: toastId });
    }
  };
  const handleOtherDelete = (id) => {
    setOtherBookingToDelete(id);
    setITBookingToDelete(null);
    setShowDeleteConfirm(true);
  };
  const handleITDelete = (id) => {
    setITBookingToDelete(id);
    setOtherBookingToDelete(null);
    setShowDeleteConfirm(true);
  };
  const confirmOtherDelete = async (id) => {
    const toastId = toast.loading('Deleting booking from Google Sheets...');
    try {
      const success = await bookingStore.deleteOtherBooking(id);
      if (success) {
        toast.success('Booking deleted successfully!', { id: toastId });
        setIsOtherDrawerOpen(false);
        refreshData();
      } else {
        toast.error('Failed to delete booking.', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete booking: ' + err.message, { id: toastId });
    }
  };
  const confirmITDelete = async (id) => {
    const toastId = toast.loading('Deleting IT booking from Google Sheets...');
    try {
      const success = await bookingStore.deleteITBooking(id);
      if (success) {
        toast.success('IT Service booking deleted successfully!', { id: toastId });
        setIsDrawerOpen(false);
        refreshData();
      } else {
        toast.error('Failed to delete IT booking.', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete IT booking: ' + err.message, { id: toastId });
    }
  };
  const handleAddITBooking = async (e) => {
    e.preventDefault();
    if (!newITBooking.name.trim()) {
      toast.error('Please enter Client Name!');
      return;
    }
    const emailVal = validateCustomerEmail(newITBooking.email, { required: true, fieldName: 'Client Email' });
    if (!emailVal.isValid) {
      toast.error(emailVal.error);
      return;
    }
    const phoneVal = validateCustomerPhone(newITBooking.phone, { required: false, fieldName: 'Client Mobile' });
    if (!phoneVal.isValid) {
      toast.error(phoneVal.error);
      return;
    }
    const bookingPayload = {
      ...newITBooking,
      phone: phoneVal.cleaned || newITBooking.phone.trim()
    };
    const toastId = toast.loading('Adding new IT booking to Google Sheets...');
    try {
      const added = await bookingStore.addITBooking(bookingPayload);
      if (added) {
        toast.success('IT Service booking added successfully!', { id: toastId });
        setIsAddITOpen(false);
        setNewITBooking({
          name: '',
          email: '',
          phone: '',
          address: '',
          service: 'Website Development & Design',
          issue: '',
          estimatedCost: 'Based on Project',
          estimatedDelivery: '1-2 Weeks',
          status: 'Pending',
          notes: 'Awaiting IT consultation.'
        });
        refreshData();
      } else {
        toast.error('Failed to add IT booking.', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to write to Google Sheets: ' + err.message, { id: toastId });
    }
  };
  const handleAddOtherBooking = async (e) => {
    e.preventDefault();
    if (!newOtherBooking.name.trim()) {
      toast.error('Please enter Customer Name!');
      return;
    }
    const emailVal = validateCustomerEmail(newOtherBooking.email, { required: true, fieldName: 'Customer Email' });
    if (!emailVal.isValid) {
      toast.error(emailVal.error);
      return;
    }
    const phoneVal = validateCustomerPhone(newOtherBooking.phone, { required: false, fieldName: 'Customer Mobile' });
    if (!phoneVal.isValid) {
      toast.error(phoneVal.error);
      return;
    }
    if (!newOtherBooking.serviceType.trim()) {
      toast.error('Please select a Service Type!');
      return;
    }
    const bookingPayload = {
      ...newOtherBooking,
      phone: phoneVal.cleaned || newOtherBooking.phone.trim()
    };
    const toastId = toast.loading('Adding new booking to Google Sheets...');
    try {
      const added = await bookingStore.addOtherBooking(bookingPayload);
      if (added) {
        toast.success('Service booking added successfully!', { id: toastId });
        setIsAddOtherOpen(false);
        setNewOtherBooking({
          name: '',
          email: '',
          phone: '',
          address: '',
          serviceType: '',
          issue: '',
          estimatedCost: '₹350+',
          estimatedTurnaround: 'TBD',
          status: 'Pending',
          notes: 'Awaiting admin review.'
        });
        refreshData();
      } else {
        toast.error('Failed to add booking.', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to write to Google Sheets: ' + err.message, { id: toastId });
    }
  };
  const filteredBookings = bookings.filter((b) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      (b.name || '').toLowerCase().includes(q) ||
      (b.email || '').toLowerCase().includes(q) ||
      (b.ticketId || '').toLowerCase().includes(q);
    const matchStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const filteredITBookings = itBookings.filter((b) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      (b.name || '').toLowerCase().includes(q) ||
      (b.email || '').toLowerCase().includes(q) ||
      (b.ticketId || '').toLowerCase().includes(q) ||
      (b.service || '').toLowerCase().includes(q);
    const matchStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const filteredOtherBookings = otherBookings.filter((b) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      (b.name || '').toLowerCase().includes(q) ||
      (b.email || '').toLowerCase().includes(q) ||
      (b.phone || '').toLowerCase().includes(q) ||
      (b.address || '').toLowerCase().includes(q) ||
      (b.serviceType && b.serviceType.toLowerCase().includes(q)) ||
      (b.issue && b.issue.toLowerCase().includes(q));
    const matchStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const pendingSchedulesCount = schedules.filter((s) => s.status === 'Pending' || s.status === 'In Progress').length;
  const dueAlertCount = duePayments.filter((d) => d.status === 'Overdue' || d.status === 'Pending').length;
  const pendingHardwareCount = bookings.filter((b) => b.status === 'Pending').length;
  const pendingITCount = itBookings.filter((b) => b.status === 'Pending').length;
  const pendingOtherCount = otherBookings.filter((b) => b.status === 'Pending').length;
  return (
    <div className="admin-root">
      <Toaster position="top-right" richColors />
      {isSidebarOpen && (
        <div className="admin-sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} />
      )}
      <div className="admin-dashboard-container">
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          user={user}
          handleLogout={handleLogout}
          theme={theme}
          toggleTheme={toggleTheme}
          pendingSchedulesCount={pendingSchedulesCount}
          dueAlertCount={dueAlertCount}
          pendingHardwareCount={pendingHardwareCount}
          pendingITCount={pendingITCount}
          pendingOtherCount={pendingOtherCount}
        />
        <main className="admin-main-content">
          <AdminHeader
            activeTab={activeTab}
            isSidebarCollapsed={isSidebarCollapsed}
            setIsSidebarCollapsed={setIsSidebarCollapsed}
            setIsSidebarOpen={setIsSidebarOpen}
            refreshData={refreshData}
            isSyncing={isSyncing}
          />
          {activeTab === 'bm-dashboard' && (
            <BusinessDashboard
              schedules={schedules}
              income={income}
              expenses={expenses}
              duePayments={duePayments}
              onOpenModal={handleOpenBmModal}
              onNavigateTab={(tab) => setActiveTab(`bm-${tab}`)}
            />
          )}
          {activeTab === 'bm-schedule' && (
            <WorkScheduleView
              schedules={schedules}
              onOpenModal={handleOpenBmModal}
              onEdit={(s) => handleOpenBmModal('schedule', s)}
              onDelete={handleDeleteSchedule}
              onUpdateStatus={handleUpdateScheduleStatus}
            />
          )}
          {activeTab === 'bm-income' && (
            <IncomeView
              income={income}
              onOpenModal={handleOpenBmModal}
              onEdit={(i) => handleOpenBmModal('income', i)}
              onDelete={handleDeleteIncome}
            />
          )}
          {activeTab === 'bm-expenses' && (
            <ExpensesView
              expenses={expenses}
              onOpenModal={handleOpenBmModal}
              onEdit={(e) => handleOpenBmModal('expense', e)}
              onDelete={handleDeleteExpense}
            />
          )}
          {activeTab === 'bm-due-payments' && (
            <DuePaymentsView
              duePayments={duePayments}
              onOpenModal={handleOpenBmModal}
              onEdit={(d) => handleOpenBmModal('due', d)}
              onDelete={handleDeleteDuePayment}
              onMarkPaid={handleMarkDuePaid}
            />
          )}
          {activeTab === 'bm-analysis' && (
            <BusinessAnalysisView income={income} expenses={expenses} />
          )}
          {activeTab === 'invoices' && (
            <InvoiceGenerator
              invoices={invoices}
              setInvoices={setInvoices}
              bookings={[...bookings, ...itBookings]}
              otherBookings={otherBookings}
              isSyncing={isSyncing}
              setIsSyncing={setIsSyncing}
            />
          )}
          {activeTab === 'dashboard' && (
            <BookingsOverview
              dashSubTab={dashSubTab}
              setDashSubTab={setDashSubTab}
              bookings={bookings}
              itBookings={itBookings}
              otherBookings={otherBookings}
            />
          )}
          {activeTab === 'ledger' && (
            <HardwareLedgerView
              filteredBookings={filteredBookings}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              quickConfirm={quickConfirm}
              openDrawer={openDrawer}
              fmtDate={fmtDate}
            />
          )}
          {activeTab === 'it-ledger' && (
            <ITLedgerView
              filteredITBookings={filteredITBookings}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              quickConfirm={quickConfirm}
              openDrawer={openDrawer}
              setIsAddITOpen={setIsAddITOpen}
              fmtDate={fmtDate}
            />
          )}
          {activeTab === 'other-bookings' && (
            <OtherLedgerView
              filteredOtherBookings={filteredOtherBookings}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              openOtherDrawer={openOtherDrawer}
              setIsAddOtherOpen={setIsAddOtherOpen}
              fmtDate={fmtDate}
            />
          )}
          {activeTab === 'outbox' && (
            <EmailOutboxView
              emailLogs={emailLogs}
              setSelectedEmail={setSelectedEmail}
              fmtDate={fmtDate}
            />
          )}
        </main>
      </div>
      <ScheduleModal
        isOpen={activeBmModal === 'schedule'}
        onClose={handleCloseBmModal}
        onSave={handleSaveSchedule}
        item={editingBmItem}
      />
      <IncomeModal
        isOpen={activeBmModal === 'income'}
        onClose={handleCloseBmModal}
        onSave={handleSaveIncome}
        item={editingBmItem}
      />
      <ExpenseModal
        isOpen={activeBmModal === 'expense'}
        onClose={handleCloseBmModal}
        onSave={handleSaveExpense}
        item={editingBmItem}
      />
      <DuePaymentModal
        isOpen={activeBmModal === 'due'}
        onClose={handleCloseBmModal}
        onSave={handleSaveDuePayment}
        item={editingBmItem}
      />
      <BookingDrawers
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        selectedBooking={selectedBooking}
        editStatus={editStatus}
        setEditStatus={setEditStatus}
        editNotes={editNotes}
        setEditNotes={setEditNotes}
        editCost={editCost}
        setEditCost={setEditCost}
        editDelivery={editDelivery}
        setEditDelivery={setEditDelivery}
        handleSave={handleSave}
        handleITDelete={handleITDelete}
        isOtherDrawerOpen={isOtherDrawerOpen}
        setIsOtherDrawerOpen={setIsOtherDrawerOpen}
        selectedOtherBooking={selectedOtherBooking}
        handleOtherSave={handleOtherSave}
        handleOtherDelete={handleOtherDelete}
        isAddITOpen={isAddITOpen}
        setIsAddITOpen={setIsAddITOpen}
        newITBooking={newITBooking}
        setNewITBooking={setNewITBooking}
        handleAddITBooking={handleAddITBooking}
        isAddOtherOpen={isAddOtherOpen}
        setIsAddOtherOpen={setIsAddOtherOpen}
        newOtherBooking={newOtherBooking}
        setNewOtherBooking={setNewOtherBooking}
        handleAddOtherBooking={handleAddOtherBooking}
        selectedEmail={selectedEmail}
        setSelectedEmail={setSelectedEmail}
        showDeleteConfirm={showDeleteConfirm}
        setShowDeleteConfirm={setShowDeleteConfirm}
        itBookingToDelete={itBookingToDelete}
        otherBookingToDelete={otherBookingToDelete}
        confirmITDelete={confirmITDelete}
        confirmOtherDelete={confirmOtherDelete}
        fmtDate={fmtDate}
      />
    </div>
  );
};
export default AdminDashboard;