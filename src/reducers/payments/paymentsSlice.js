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
  loading: false, // general loading flag for single-request flows (intents, refunds, defaulting)
  methods: [],
  // last created client secret / payment intent id returned by server
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
    pageSize: 10,
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
      // -----------------------
      // Payment Methods
      // -----------------------
      .addCase(fetchPaymentMethods.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchPaymentMethods.fulfilled, (s, action) => {
        s.loading = false;
        // thunk normalizes to an array
        s.methods = action.payload || [];
      })
      .addCase(fetchPaymentMethods.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload?.message || a.error?.message;
      })

      // -----------------------
      // Create Payment Intent
      // Expected payload: { client_secret, paymentIntentId, raw }
      // -----------------------
      .addCase(createPaymentIntent.pending, (s) => {
        s.loading = true;
        s.error = null;
        s.lastClientSecret = null;
        s.lastPaymentIntentId = null;
      })
      .addCase(createPaymentIntent.fulfilled, (s, action) => {
        s.loading = false;
        const payload = action.payload || {};
        s.lastClientSecret = payload?.client_secret || null;
        s.lastPaymentIntentId = payload?.paymentIntentId || payload?.id || (payload?.raw && (payload.raw.id || payload.raw.paymentIntentId)) || null;
      })
      .addCase(createPaymentIntent.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload?.message || a.error?.message;
      })

      // -----------------------
      // Setup Intent (save card)
      // Expected payload: { client_secret, raw }
      // -----------------------
      .addCase(createSetupIntent.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(createSetupIntent.fulfilled, (s, action) => {
        s.loading = false;
        const payload = action.payload || {};
        s.lastClientSecret = payload?.client_secret || null;
      })
      .addCase(createSetupIntent.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload?.message || a.error?.message;
      })

      // -----------------------
      // Refund
      // -----------------------
      .addCase(refundPayment.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(refundPayment.fulfilled, (s) => {
        s.loading = false;
      })
      .addCase(refundPayment.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload?.message || a.error?.message;
      })

      // -----------------------
      // Transactions (paged)
      // thunk returns { data, meta }
      // -----------------------
      .addCase(fetchTransactions.pending, (s) => {
        s.transactions.loading = true;
        s.transactions.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (s, { payload }) => {
        s.transactions.loading = false;
        const items = payload?.data || [];
        const meta = payload?.meta || {};
        s.transactions.items = Array.isArray(items) ? items : [];
        s.transactions.total = meta?.total ?? (s.transactions.items.length || 0);
        s.transactions.page = meta?.page || 1;
        s.transactions.limit = meta?.limit || s.transactions.limit;

        // cache
        const cacheKey = `${s.transactions.statusFilter || 'ALL'}::${s.transactions.page}`;
        s.transactionsCache[cacheKey] = { items: s.transactions.items, total: s.transactions.total, fetchedAt: Date.now() };
      })
      .addCase(fetchTransactions.rejected, (s, a) => {
        s.transactions.loading = false;
        s.transactions.error = a.payload?.message || a.error?.message;
      })

      // -----------------------
      // Invoices (paged)
      // thunk returns { items, meta }
      // -----------------------
      .addCase(fetchInvoices.pending, (s) => {
        s.invoices.loading = true;
        s.invoices.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (s, { payload }) => {
        s.invoices.loading = false;
        const items = payload?.items || [];
        const meta = payload?.meta || {};
        // append when page > 1
        const page = meta?.page || 1;
        if (page > 1) {
          s.invoices.items = [...(s.invoices.items || []), ...(Array.isArray(items) ? items : [])];
        } else {
          s.invoices.items = Array.isArray(items) ? items : [];
        }
        s.invoices.total = meta?.total ?? s.invoices.items.length;
        s.invoices.page = page;
        s.invoices.pageSize = meta?.limit || s.invoices.pageSize || 10;

        // cache
        const cacheKey = `${s.invoices.statusFilter || 'ALL'}::${s.invoices.page}`;
        s.invoicesCache[cacheKey] = { items: s.invoices.items, total: s.invoices.total, fetchedAt: Date.now() };
      })
      .addCase(fetchInvoices.rejected, (s, a) => {
        s.invoices.loading = false;
        s.invoices.error = a.payload?.message || a.error?.message;
      })

      // -----------------------
      // Invoice detail
      // -----------------------
      .addCase(fetchInvoiceDetail.pending, (s) => {
        s.invoiceDetail.loading = true;
        s.invoiceDetail.error = null;
      })
      .addCase(fetchInvoiceDetail.fulfilled, (s, action) => {
        s.invoiceDetail.loading = false;
        const payload = action.payload || {};
        // payload may be { data: {...} } or the invoice object directly
        s.invoiceDetail.data = payload?.data || payload || null;
      })
      .addCase(fetchInvoiceDetail.rejected, (s, action) => {
        s.invoiceDetail.loading = false;
        s.invoiceDetail.error = action.payload?.message || action.error?.message;
      })

      // download invoice (no-op in slice: UI handles returned URL)
      .addCase(downloadInvoicePdf.fulfilled, (s, { payload }) => {
        // no state mutation required; UI thunks return url/pdf blob for direct use
      })

      // -----------------------
      // Parent students
      // -----------------------
      .addCase(fetchParentStudents.pending, (s) => { s.parentStudents.loading = true; s.parentStudents.error = null; })
      .addCase(fetchParentStudents.fulfilled, (s, { payload }) => {
        s.parentStudents.loading = false;
        s.parentStudents.data = payload || [];
      })
      .addCase(fetchParentStudents.rejected, (s, a) => { s.parentStudents.loading = false; s.parentStudents.error = a.payload?.message || a.error?.message; })

      // -----------------------
      // Set default payment method
      // -----------------------
      .addCase(setDefaultPaymentMethod.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(setDefaultPaymentMethod.fulfilled, (s) => { s.loading = false; })
      .addCase(setDefaultPaymentMethod.rejected, (s, a) => { s.loading = false; s.error = a.payload?.message || a.error?.message; });
  }
});

export const { clearPaymentError, clearPaymentsCache } = paymentsSlice.actions;
export default paymentsSlice.reducer;
