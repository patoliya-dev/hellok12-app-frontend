import { createAsyncThunk } from '@reduxjs/toolkit';
import * as paymentsApi from './paymentsApi';
import { normalizeErr } from '../../features/shared/apiTypes';

export const createCustomer = createAsyncThunk(
  'payments/createCustomer',
  async (payload = {}, { rejectWithValue }) => {
    try {
      const { data } = await paymentsApi.createCustomer(payload);
      return data;
    } catch (err) {
      return rejectWithValue(normalizeErr(err));
    }
  }
);

export const fetchPaymentMethods = createAsyncThunk('payments/fetchPaymentMethods', async (_, { rejectWithValue }) => {
  try {
    const resp = await paymentsApi.listPaymentMethods();
    // server returns { success: true, data: [...] }
    return resp.data?.data || resp.data || [];
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: err.message });
  }
});

export const createPaymentIntent = createAsyncThunk('payments/createPaymentIntent', async (payload, { rejectWithValue }) => {
  try {
    const resp = await paymentsApi.createPaymentIntent(payload);
    // expected { success: true, client_secret, paymentIntentId, transactionId }
    const client_secret = resp.data?.client_secret || resp.data?.data?.client_secret || (resp.data?.data && resp.data.data.client_secret);
    const paymentIntentId = resp.data?.paymentIntentId || resp.data?.data?.paymentIntentId || (resp.data?.data && resp.data.data.id);
    const transactionId = resp.data?.transactionId || resp.data?.data?.transactionId || null;
    return { client_secret, paymentIntentId, transactionId, raw: resp.data };
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: err.message });
  }
});

export const createSetupIntent = createAsyncThunk('payments/createSetupIntent', async (_, { rejectWithValue }) => {
  try {
    const resp = await paymentsApi.createSetupIntent(); // endpoint returns client_secret
    // Normalize: return { client_secret }
    const client_secret = resp.data?.client_secret || resp.data?.data?.client_secret || resp.data?.clientSecret;
    return { client_secret, raw: resp.data };
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: err.message });
  }
});

// Fetch paged transactions
export const fetchTransactions = createAsyncThunk(
  'payments/fetchTransactions',
  async ({ status = '', page = 1, pageSize = 20, studentId } = {}, { rejectWithValue }) => {
    try {
      const params = { page, limit: pageSize };
      if (status && status !== 'ALL') params.status = status;
      if (studentId) params.studentId = studentId;
      const res = await paymentsApi.listTransactions(params);
      // Expect { success: true, data: [...], meta: { total, page, limit } }
      const d = res?.data || res;
      const data = d?.data || d?.transactions || d || [];
      const meta = d?.meta || d?.pagination || {};
      return { data, meta };
    } catch (err) {
      return rejectWithValue(normalizeErr(err));
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
      const d = res?.data || res;
      const items = d?.data || d?.invoices || d || [];
      const meta = d?.meta || d?.pagination || {};
      return { items, meta };
    } catch (err) {
      return rejectWithValue(normalizeErr(err));
    }
  }
);

// Fetch one invoice detail (used for the modal)
export const fetchInvoiceDetail = createAsyncThunk(
  'payments/fetchInvoiceDetail',
  async (invoiceId, { rejectWithValue }) => {
    try {
      const res = await paymentsApi.getInvoice(invoiceId);
      const d = res?.data || res;
      return d;
    } catch (err) {
      return rejectWithValue(normalizeErr(err));
    }
  }
);

// Download invoice PDF (returns url)
export const downloadInvoicePdf = createAsyncThunk(
  'payments/downloadInvoicePdf',
  async (invoiceId, { rejectWithValue }) => {
    try {
      const res = await paymentsApi.getInvoiceDownload(invoiceId);
      const d = res?.data || res;
      return d;
    } catch (err) {
      return rejectWithValue(normalizeErr(err));
    }
  }
);

// Download transaction receipt (returns url)
export const downloadTransactionReceipt = createAsyncThunk(
  'payments/downloadTransactionReceipt',
  async (transactionId, { rejectWithValue }) => {
    try {
      const res = await paymentsApi.getTransactionReceipt(transactionId);
      const d = res?.data || res;
      return d;
    } catch (err) {
      return rejectWithValue(normalizeErr(err));
    }
  }
);

export const fetchParentStudents = createAsyncThunk(
  'payments/fetchParentStudents',
  async ({ parentId }, { rejectWithValue }) => {
    try {
      const res = await paymentsApi.listParentStudents(parentId);
      const d = res?.data || res;
      if (!d?.success) return rejectWithValue(d);
      return d.data;
    } catch (err) {
      return rejectWithValue(normalizeErr(err));
    }
  }
);

export const setDefaultPaymentMethod = createAsyncThunk(
  'payments/setDefaultPaymentMethod',
  async ({ paymentMethodId }, { rejectWithValue }) => {
    try {
      const res = await paymentsApi.setDefaultPaymentMethod(paymentMethodId);
      const d = res?.data || res;
      return d;
    } catch (err) {
      return rejectWithValue(normalizeErr(err));
    }
  }
);

export default {
  fetchPaymentMethods,
  createPaymentIntent,
  createSetupIntent,
  fetchTransactions,
  fetchInvoices,
  fetchInvoiceDetail,
  downloadInvoicePdf,
  downloadTransactionReceipt,
  fetchParentStudents,
  setDefaultPaymentMethod,
};
