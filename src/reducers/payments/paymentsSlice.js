// src/reducers/payments/paymentsSlice.js
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
} from './paymentsThunks';

const initialState = {
  loading: false,
  methods: [],
  lastClientSecret: null,
  lastPaymentIntentId: null,
  error: null,

  // new
  transactions: { loading: false, data: [], total: 0 },
  invoices: { loading: false, data: [], total: 0 },
  parentStudents: { loading: false, data: [] },
};

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearPaymentError(state) { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentMethods.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchPaymentMethods.fulfilled, (s, a) => { s.loading = false; s.methods = a.payload?.data || a.payload || []; })
      .addCase(fetchPaymentMethods.rejected, (s, a) => { s.loading = false; s.error = a.payload?.message || a.error?.message; })

      .addCase(createPaymentIntent.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(createPaymentIntent.fulfilled, (s, a) => {
        s.loading = false;
        s.lastClientSecret = a.payload?.client_secret || a.payload?.data?.client_secret;
        s.lastPaymentIntentId = a.payload?.paymentIntentId || a.payload?.id;
      })
      .addCase(createPaymentIntent.rejected, (s, a) => { s.loading = false; s.error = a.payload?.message || a.error?.message; })

      .addCase(createSetupIntent.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(createSetupIntent.fulfilled, (s, a) => {
        s.loading = false;
        s.lastClientSecret = a.payload?.client_secret || a.payload?.data?.client_secret;
      })
      .addCase(createSetupIntent.rejected, (s, a) => { s.loading = false; s.error = a.payload?.message || a.error?.message; })

      .addCase(refundPayment.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(refundPayment.fulfilled, (s, a) => { s.loading = false; })
      .addCase(refundPayment.rejected, (s, a) => { s.loading = false; s.error = a.payload?.message || a.error?.message; })

      // transactions
      .addCase(fetchTransactions.pending, (s) => { s.transactions.loading = true; })
      .addCase(fetchTransactions.fulfilled, (s, a) => {
        s.transactions.loading = false;
        // backend expected shape: { transactions: [], total } or axios response object
        s.transactions.data = a.payload?.data?.transactions || a.payload?.transactions || a.payload?.data || a.payload || [];
        s.transactions.total = a.payload?.data?.total || a.payload?.total || (s.transactions.data?.length || 0);
      })
      .addCase(fetchTransactions.rejected, (s, a) => { s.transactions.loading = false; s.error = a.payload?.message || a.error?.message; })

      // invoices
      .addCase(fetchInvoices.pending, (s) => { s.invoices.loading = true; })
      .addCase(fetchInvoices.fulfilled, (s, a) => {
        s.invoices.loading = false;
        s.invoices.data = a.payload?.data?.invoices || a.payload?.invoices || a.payload?.data || a.payload || [];
        s.invoices.total = a.payload?.data?.total || a.payload?.total || (s.invoices.data?.length || 0);
      })
      .addCase(fetchInvoices.rejected, (s, a) => { s.invoices.loading = false; s.error = a.payload?.message || a.error?.message; })

      // parent students
      .addCase(fetchParentStudents.pending, (s) => { s.parentStudents.loading = true; })
      .addCase(fetchParentStudents.fulfilled, (s, { payload }) => {
        s.parentStudents.loading = false;
        s.parentStudents.data = payload || [];
      })
      .addCase(fetchParentStudents.rejected, (s, a) => { s.parentStudents.loading = false; s.error = a.payload?.message || a.error?.message; })

      // set default
      .addCase(setDefaultPaymentMethod.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(setDefaultPaymentMethod.fulfilled, (s, a) => {
        s.loading = false;
        // After setting default, it's best to refresh methods via fetchPaymentMethods in UI
      })
      .addCase(setDefaultPaymentMethod.rejected, (s, a) => { s.loading = false; s.error = a.payload?.message || a.error?.message; });
  }
});

export const { clearPaymentError } = paymentsSlice.actions;
export default paymentsSlice.reducer;
