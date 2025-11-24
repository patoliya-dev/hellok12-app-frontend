import { createAsyncThunk } from '@reduxjs/toolkit';
import * as paymentsApi from './paymentsApi';

export const createCustomer = createAsyncThunk(
  'payments/createCustomer',
  async (payload = {}, { rejectWithValue }) => {
    try {
      const { data } = await paymentsApi.createCustomer(payload);
      return data;
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
  async (payload, { rejectWithValue }) => {
    try {
      // API expects amount in cents; your existing code used amount as amount
      // const body = {
      //   bookingId,
      //   amount: amount,
      //   currency,
      //   paymentMethodId, // optional: server may confirm
      //   description,
      //   teacherId,
      //   studentId,
      // };
      // pass idempotencyKey in headers if backend supports it via axios instance (or as part of body)
      const { data } = await paymentsApi.createPaymentIntent(payload);
      return data; // expected { client_secret, paymentIntentId, transactionId? }
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
      const res = await paymentsApi.createSetupIntent(payload);
      return res; // expected { client_secret, paymentMethod }
    } catch (err) {
      return rejectWithValue(err.body || { message: err.message });
    }
  }
);

export const attachPaymentMethod = createAsyncThunk(
  'payments/attachPaymentMethod',
  async ({ paymentMethodId, setDefault = false }, { rejectWithValue }) => {
    try {
      const { data } = await paymentsApi.attachPaymentMethod({ body: { paymentMethodId, setDefault } });
      // After attach, refresh the list
      return data;
    } catch (err) {
      return rejectWithValue(err.body || { message: err.message });
    }
  }
);

export const refundPayment = createAsyncThunk(
  'payments/refundPayment',
  async ({ transactionId, amount }, { rejectWithValue }) => {
    try {
      const res = await paymentsApi.refundPayment({ body: { transactionId, amount: amount } });
      return res;
    } catch (err) {
      return rejectWithValue(err.body || { message: err.message });
    }
  }
);

// Fetch paged transactions
export const fetchTransactions = createAsyncThunk(
  'payments/fetchTransactions',
  async ({ status = '', page = 1, pageSize = 20, studentId } = {}, { rejectWithValue }) => {
    try {
      const params = { page, limit: pageSize };
      if (status) params.status = status;
      if (studentId) params.studentId = studentId;
      const res = await paymentsApi.listTransactions(params);
      // backend returns { success: true, data: [...], meta: {...} }
      return res.data; // res.data === { success, data, meta }
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message || 'Failed to load transactions' });
    }
  }
);

// Fetch paged invoices
export const fetchInvoices = createAsyncThunk(
  'payments/fetchInvoices',
  async ({ page = 1, pageSize = 10, studentId } = {}, { rejectWithValue }) => {
    try {
      const params = { page, limit: pageSize };
      if (studentId) params.studentId = studentId;
      const res = await paymentsApi.listInvoices(params);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message || 'Failed to load invoices' });
    }
  }
);

// Fetch one invoice detail (used for the modal)
export const fetchInvoiceDetail = createAsyncThunk(
  'payments/fetchInvoiceDetail',
  async (invoiceId, { rejectWithValue }) => {
    try {
      const res = await paymentsApi.getInvoice(invoiceId);
      // res.data expected to be { success: true, data: invoice }
      return res.data;
    } catch (err) {
      const payload = err.response?.data || { message: err.message || 'Failed to load invoice detail' };
      return rejectWithValue(payload);
    }
  }
);

// Download invoice PDF (returns url)
export const downloadInvoicePdf = createAsyncThunk(
  'payments/downloadInvoicePdf',
  async (invoiceId, { rejectWithValue }) => {
    try {
      const res = await paymentsApi.downloadInvoice(invoiceId);
      // res.data => { success: true, url }
      return res.data;
    } catch (err) {
      const payload = err.response?.data || { message: err.message || 'Failed to download invoice' };
      return rejectWithValue(payload);
    }
  }
);

// Download transaction receipt (returns url)
export const downloadTransactionReceipt = createAsyncThunk(
  'payments/downloadTransactionReceipt',
  async (transactionId, { rejectWithValue }) => {
    try {
      const res = await paymentsApi.getTransactionReceipt(transactionId);
      return res.data;
    } catch (err) {
      const payload = err.response?.data || { message: err.message || 'Failed to download receipt' };
      return rejectWithValue(payload);
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
  fetchInvoiceDetail,
  downloadInvoicePdf,
  downloadTransactionReceipt,
  fetchParentStudents,
  setDefaultPaymentMethod,
};
