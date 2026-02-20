import { createAsyncThunk } from "@reduxjs/toolkit";
import paymentsApi from "./stripeApi";

// Thunks
export const createConnectedAccount = createAsyncThunk(
    "stripe/createConnectedAccount",
    async (params, { rejectWithValue }) => {
        try {
            const res = await paymentsApi.createConnectedAccount(params);
            return res.data || res;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const generateOnboardingLink = createAsyncThunk(
    "stripe/generateOnboardingLink",
    async ({ return_url, refresh_url } = {}, { rejectWithValue }) => {
        try {
            const res = await paymentsApi.generateOnboardingLink({ return_url, refresh_url });
            return res.data || res;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const fetchAccountStatus = createAsyncThunk(
    "stripe/fetchAccountStatus",
    async (_, { getState, rejectWithValue }) => {
        try {
            const cached = getState().stripe?.selectedAccount;
            if (cached) {
                // return cached for immediate response but still try to refresh from API
                // We'll still call API afterwards via another dispatch if needed
            }
            const res = await paymentsApi.getAccountStatus();
            return res.data || res;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const updatePayoutDetails = createAsyncThunk(
    "stripe/updatePayoutDetails",
    async (payload, { rejectWithValue }) => {
        try {
            const res = await paymentsApi.updatePayoutDetails(payload);
            return res.data || res;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const fetchBalance = createAsyncThunk(
    "stripe/fetchBalance",
    async (_, { rejectWithValue }) => {
        try {
            const res = await paymentsApi.getBalance();
            return res.data || res;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const fetchTransactions = createAsyncThunk(
    "stripe/fetchTransactions",
    async (_, { rejectWithValue }) => {
        try {
            const res = await paymentsApi.getTransactions();
            return res.data || res;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const fetchInvoices = createAsyncThunk(
    "stripe/fetchInvoices",
    async (_, { rejectWithValue }) => {
        try {
            const res = await paymentsApi.getInvoices();
            return res.data || res;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);