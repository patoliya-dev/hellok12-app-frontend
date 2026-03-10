import api from "../../utils/axiosInstance";

export default {
  createConnectedAccount: (payload) =>
    api.post("/payments/create-connected-account", payload),
  generateOnboardingLink: (payload) =>
    api.post("/payments/generate-onboarding-link", payload),
  getAccountStatus: () => api.get("/payments/account-status"),
  updatePayoutDetails: (payload) =>
    api.post("/payments/update-payout-details", payload),
  getBalance: () => api.get("/payments/balance"),
  getTransactions: () => api.get("/payments/transactions"),
  getInvoices: () => api.get("/payments/invoices"),
};
