import { createAsyncThunk } from '@reduxjs/toolkit';
import * as paymentsApi from './paymentsApi';

export const createCustomer = createAsyncThunk(
  'payments/createCustomer',
  async (payload = {}, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth?.token;
      const res = await paymentsApi.createCustomer({ token, body: payload });
      return res;
    } catch (err) {
      return rejectWithValue(err.body || { message: err.message });
    }
  }
);

// get token from store or pass it via thunk arg
export const fetchPaymentMethods = createAsyncThunk(
  'payments/fetchPaymentMethods',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await paymentsApi.listPaymentMethods();
      return data.data;
    } catch (err) {
      return rejectWithValue(err.body || { message: err.message });
    }
  }
);

export const createPaymentIntent = createAsyncThunk(
  'payments/createPaymentIntent',
  async ({ bookingId, amountCents, currency = 'usd', paymentMethodId, description, teacherId, studentId, idempotencyKey }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth?.token;
      // API expects amount in cents; your existing code used amountCents as amount
      const body = {
        bookingId,
        amount: amountCents,
        currency,
        paymentMethodId, // optional: server may confirm
        description,
        teacherId,
        studentId,
      };
      // pass idempotencyKey in headers if backend supports it via axios instance (or as part of body)
      const res = await paymentsApi.createPaymentIntent({ token, body, idempotencyKey });
      return res; // expected { client_secret, paymentIntentId, transactionId? }
    } catch (err) {
      return rejectWithValue(err.body || { message: err.message });
    }
  }
);

export const createSetupIntent = createAsyncThunk(
  'payments/createSetupIntent',
  async (payload, { rejectWithValue }) => {
    try {
      // payload may include card information (since current UI collects it)
      // Backend should implement secure handling: either accept raw card data (temporary)
      // or expose an endpoint to return client_secret for SetupIntent (preferred).
      const res = await paymentsApi.createSetupIntent({ body: payload });
      return res; // expected { client_secret, paymentMethod }
    } catch (err) {
      return rejectWithValue(err.body || { message: err.message });
    }
  }
);

export const refundPayment = createAsyncThunk(
  'payments/refundPayment',
  async ({ transactionId, amountCents }, { rejectWithValue }) => {
    try {
      const res = await paymentsApi.refundPayment({ body: { transactionId, amount: amountCents } });
      return res;
    } catch (err) {
      return rejectWithValue(err.body || { message: err.message });
    }
  }
);

// -----------------------------
// New thunks: transactions, invoices, parent students, set default card
// -----------------------------
export const fetchTransactions = createAsyncThunk(
  'payments/fetchTransactions',
  async ({ status, page = 1, pageSize = 50 } = {}, { rejectWithValue }) => {
    try {
      const params = { status, page, pageSize };
      const res = await paymentsApi.listTransactions(params);
      return res;
    } catch (err) {
      return rejectWithValue(err.body || { message: err.message });
    }
  }
);

export const fetchInvoices = createAsyncThunk(
  'payments/fetchInvoices',
  async ({ page = 1, pageSize = 50 } = {}, { rejectWithValue }) => {
    try {
      const res = await paymentsApi.listInvoices({ page, pageSize });
      return res;
    } catch (err) {
      return rejectWithValue(err.body || { message: err.message });
    }
  }
);

export const fetchParentStudents = createAsyncThunk(
  'payments/fetchParentStudents',
  async ({ parentId }, { rejectWithValue }) => {
    try {
      const { data } = await paymentsApi.listParentStudents(parentId);
      if (!data?.success) return rejectWithValue(data);
      return data.data;
    } catch (err) { return rejectWithValue(normalizeErr(err)); }
  }
);

export const setDefaultPaymentMethod = createAsyncThunk(
  'payments/setDefaultPaymentMethod',
  async ({ paymentMethodId }, { rejectWithValue }) => {
    try {
      const res = await paymentsApi.setDefaultPaymentMethod(paymentMethodId);
      return res;
    } catch (err) {
      return rejectWithValue(err.body || { message: err.message });
    }
  }
);

export default {
  fetchPaymentMethods,
  createPaymentIntent,
  createSetupIntent,
  refundPayment,
  fetchTransactions,
  fetchInvoices,
  fetchParentStudents,
  setDefaultPaymentMethod,
};
