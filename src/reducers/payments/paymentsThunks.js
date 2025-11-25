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

export const fetchPaymentMethods = createAsyncThunk(
  'payments/fetchPaymentMethods',
  async (_, { rejectWithValue }) => {
    try {
      const res = await paymentsApi.listPaymentMethods();
      // API returns { success:true, data: [ ... ] } OR direct array
      const items = res?.data?.data || res?.data || res;
      return items;
    } catch (err) {
      return rejectWithValue(normalizeErr(err));
    }
  }
);

export const createPaymentIntent = createAsyncThunk(
  'payments/createPaymentIntent',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await paymentsApi.createPaymentIntent(payload);
      // Normalize return: accept { client_secret, paymentIntentId } or { data: { client_secret } }
      const d = res?.data || res;
      const client_secret = d?.client_secret || d?.data?.client_secret || d?.clientSecret || null;
      const paymentIntentId = d?.paymentIntentId || d?.id || d?.payment_intent_id || null;
      return { client_secret, paymentIntentId, raw: d };
    } catch (err) {
      return rejectWithValue(normalizeErr(err));
    }
  }
);

export const createSetupIntent = createAsyncThunk(
  'payments/createSetupIntent',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await paymentsApi.createSetupIntent(payload);
      const d = res?.data || res;
      const client_secret = d?.client_secret || d?.data?.client_secret || d?.clientSecret || null;
      return { client_secret, raw: d };
    } catch (err) {
      return rejectWithValue(normalizeErr(err));
    }
  }
);

export const attachPaymentMethod = createAsyncThunk(
  'payments/attachPaymentMethod',
  async ({ paymentMethodId, setDefault = false }, { rejectWithValue }) => {
    try {
      const { data } = await paymentsApi.attachPaymentMethod({ body: { paymentMethodId, setDefault } });
      return data;
    } catch (err) {
      return rejectWithValue(normalizeErr(err));
    }
  }
);

export const refundPayment = createAsyncThunk(
  'payments/refundPayment',
  async ({ transactionId, amount }, { rejectWithValue }) => {
    try {
      const res = await paymentsApi.refundPayment({ body: { transactionId, amount: amount } });
      const d = res?.data || res;
      return d;
    } catch (err) {
      return rejectWithValue(normalizeErr(err));
    }
  }
);

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
  refundPayment,
  fetchTransactions,
  fetchInvoices,
  fetchInvoiceDetail,
  downloadInvoicePdf,
  downloadTransactionReceipt,
  fetchParentStudents,
  setDefaultPaymentMethod,
};
