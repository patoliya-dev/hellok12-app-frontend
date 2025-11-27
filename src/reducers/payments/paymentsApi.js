import api from '../../utils/axiosInstance';
import { cleanParams } from '../../features/shared/apiTypes';

// -----------------------------
// Stripe Customer
// -----------------------------
export const createCustomer = (payload) =>
  api.post(`/payments/create-customer`, payload);

// -----------------------------
// Payment Methods
// -----------------------------
export const listPaymentMethods = (params) =>
  api.get(`/payments/payment-methods`, { params: cleanParams(params) });

export const createSetupIntent = (payload) =>
  api.post(`/payments/save-payment-method`, payload);

// -----------------------------
// PaymentIntents / Checkout
// -----------------------------
export const createPaymentIntent = (payload) =>
  api.post(`/payments/create-payment-intent`, payload);

export const confirmPayment = (payload) =>
  api.post(`/payments/confirm-payment`, payload);

// -----------------------------
// Optional: Stripe Checkout Session
// -----------------------------
export const createCheckoutSession = (payload) =>
  api.post(`/payments/create-checkout-session`, payload);

// Set a payment method as default
export const setDefaultPaymentMethod = (paymentMethodId) =>
  api.post(`/payments/payment-methods/${paymentMethodId}/set-default`);

// -----------------------------
// Transactions
// -----------------------------
export const listTransactions = (params) =>
  api.get(`/payments/transactions`, { params: cleanParams(params) });

export const getTransactionReceipt = (txId) =>
  api.get(`/payments/transactions/${txId}/receipt`);

// -----------------------------
// Invoices
// -----------------------------
export const listInvoices = (params) =>
  api.get(`/payments/invoices`, { params: cleanParams(params) });

export const getInvoice = (invoiceId) =>
  api.get(`/payments/invoices/${invoiceId}`);

export const getInvoiceDownload = (invoiceId) =>
  api.get(`/payments/invoices/${invoiceId}/download`);


// -----------------------------
// Parent students (for parent role)
// -----------------------------
export const listParentStudents = (parentId) =>
  api.get(`/user/${parentId}/students`);

