import { createSlice } from '@reduxjs/toolkit';
import {
  fetchPaymentMethods,
  createPaymentIntent,
  createSetupIntent,
  refundPayment,
  fetchTransactions,
  fetchInvoices,
  fetchParentStudents,
  setDefaultPaymentMethod,
  fetchInvoiceDetail,
  downloadInvoicePdf
} from './paymentsThunks';

const initialState = {
  loading: false,
  methods: [],
  lastClientSecret: null,
  lastPaymentIntentId: null,
  error: null,

  // transactions & invoices: normalized containers + caches
  transactions: {
    items: [],
    loading: false,
    total: 0,
    page: 1,
    limit: 20,
    error: null,
    statusFilter: 'ALL',
  },
  invoices: {
    items: [],
    loading: false,
    total: 0,
    page: 1,
    limit: 10,
    error: null,
    statusFilter: 'ALL',
  },

  // caches keyed by "STATUS::PAGE"
  transactionsCache: {},
  invoicesCache: {},

  // invoice detail modal
  invoiceDetail: { loading: false, data: null, error: null },

  parentStudents: { loading: false, data: [] },
};

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearPaymentError(state) { state.error = null; },

    // optional: clear caches (admin action)
    clearPaymentsCache(state) {
      state.transactionsCache = {};
      state.invoicesCache = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // existing flows (payment methods, create intents, etc.)
      .addCase(fetchPaymentMethods.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchPaymentMethods.fulfilled, (s, a) => { s.loading = false; s.methods = a.payload?.data || a.payload || []; })
      .addCase(fetchPaymentMethods.rejected, (s, a) => { s.loading = false; s.error = a.payload?.message || a.error?.message; })

      .addCase(createPaymentIntent.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(createPaymentIntent.fulfilled, (s, a) => {
        s.loading = false;
        s.lastClientSecret = a.payload?.client_secret || a.payload?.data?.client_secret || null;
        s.lastPaymentIntentId = a.payload?.paymentIntentId || a.payload?.id || null;
      })
      .addCase(createPaymentIntent.rejected, (s, a) => { s.loading = false; s.error = a.payload?.message || a.error?.message; })

      .addCase(createSetupIntent.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(createSetupIntent.fulfilled, (s, a) => {
        s.loading = false;
        s.lastClientSecret = a.payload?.client_secret || a.payload?.data?.client_secret || null;
      })
      .addCase(createSetupIntent.rejected, (s, a) => { s.loading = false; s.error = a.payload?.message || a.error?.message; })

      .addCase(refundPayment.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(refundPayment.fulfilled, (s) => { s.loading = false; })
      .addCase(refundPayment.rejected, (s, a) => { s.loading = false; s.error = a.payload?.message || a.error?.message; })

      // transactions
      .addCase(fetchTransactions.pending, (s, a) => {
        s.transactions.loading = true;
        s.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (s, { payload }) => {
        s.transactions.loading = false;
        const items = payload?.data || [];
        const meta = payload?.meta || {};
        s.transactions.items = items;
        s.transactions.total = meta.total || items.length;
        s.transactions.page = meta.page || 1;
        s.transactions.limit = meta.limit || s.transactions.limit;
      })
      .addCase(fetchTransactions.rejected, (s, a) => {
        s.transactions.loading = false;
        s.transactions.error = a.payload?.message || a.error?.message;
      })

      // invoices
      .addCase(fetchInvoices.pending, (s) => {
        s.invoices.loading = true;
        s.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (s, { payload }) => {
        s.invoices.loading = false;
        const items = payload?.data || [];
        const meta = payload?.meta || {};
        s.invoices.items = meta.page && meta.page > 1 ? [...(s.invoices.items || []), ...items] : items;
        s.invoices.total = meta.total || items.length;
        s.invoices.page = meta.page || 1;
        s.invoices.pageSize = meta.limit || s.invoices.pageSize;
      })
      .addCase(fetchInvoices.rejected, (s, a) => {
        s.invoices.loading = false;
        s.error = a.payload?.message || a.error?.message;
      })

      // invoice detail
      .addCase(fetchInvoiceDetail.pending, (s) => {
        s.invoiceDetail.loading = true;
        s.invoiceDetail.error = null;
      })
      .addCase(fetchInvoiceDetail.fulfilled, (s, action) => {
        s.invoiceDetail.loading = false;
        const payload = action.payload || {};
        s.invoiceDetail.data = payload?.data || payload || null;
      })
      .addCase(fetchInvoiceDetail.rejected, (s, action) => {
        s.invoiceDetail.loading = false;
        s.invoiceDetail.error = action.payload?.message || action.error?.message;
      })

      // download invoice
      .addCase(downloadInvoicePdf.fulfilled, (s, { payload }) => {
        // no-op: UI will handle returned pdfUrl from thunk result
      })

      // parent students
      .addCase(fetchParentStudents.pending, (s) => { s.parentStudents.loading = true; })
      .addCase(fetchParentStudents.fulfilled, (s, { payload }) => {
        s.parentStudents.loading = false;
        s.parentStudents.data = payload || [];
      })
      .addCase(fetchParentStudents.rejected, (s, a) => { s.parentStudents.loading = false; s.error = a.payload?.message || a.error?.message; })

      // set default
      .addCase(setDefaultPaymentMethod.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(setDefaultPaymentMethod.fulfilled, (s) => { s.loading = false; })
      .addCase(setDefaultPaymentMethod.rejected, (s, a) => { s.loading = false; s.error = a.payload?.message || a.error?.message; });
  }
});

export const { clearPaymentError, clearPaymentsCache } = paymentsSlice.actions;
export default paymentsSlice.reducer;
