import { createSlice } from "@reduxjs/toolkit";
import { createConnectedAccount, fetchAccountStatus, fetchBalance, fetchInvoices, fetchTransactions, generateOnboardingLink, updatePayoutDetails } from "./stripeThunks";

// Priority rules: use existing store, then API, then Stripe (server will call Stripe)
const initialState = {
    selectedAccount: null, // account summary from GET /account-status
    loading: false,
    error: null,
    balance: null,
    transactions: [],
    invoices: []
};

const slice = createSlice({
    name: "stripe",
    initialState,
    reducers: {
        setSelectedAccount(state, action) {
            state.selectedAccount = action.payload;
            // cache to localStorage
            try {
                localStorage.setItem("stripe:selectedAccount", JSON.stringify(action.payload));
            } catch (e) { }
        },
        clearStripeState(state) {
            state.selectedAccount = null;
            state.balance = null;
            state.transactions = [];
            state.invoices = [];
            localStorage.removeItem("stripe:selectedAccount");
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createConnectedAccount.fulfilled, (state, action) => {
                state.selectedAccount = action.payload.account || action.payload;
                state.loading = false;
            })
            .addCase(createConnectedAccount.pending, (state) => {
                state.loading = true; state.error = null;
            })
            .addCase(createConnectedAccount.rejected, (state, action) => {
                state.loading = false; state.error = action.payload || action.error;
            })

            .addCase(generateOnboardingLink.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(generateOnboardingLink.rejected, (state, action) => {
                state.loading = false; state.error = action.payload || action.error;
            })

            .addCase(fetchAccountStatus.fulfilled, (state, action) => {
                state.selectedAccount = action.payload.accountSummary || action.payload;
                state.loading = false;
                // cache
                try { localStorage.setItem("stripe:selectedAccount", JSON.stringify(state.selectedAccount)); } catch (e) { }
            })
            .addCase(fetchAccountStatus.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchAccountStatus.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error; })

            .addCase(updatePayoutDetails.fulfilled, (state, action) => { state.loading = false; })
            .addCase(updatePayoutDetails.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error; })

            .addCase(fetchBalance.fulfilled, (state, action) => { state.balance = action.payload.balance || action.payload; state.loading = false; })
            .addCase(fetchBalance.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error; })

            .addCase(fetchTransactions.fulfilled, (state, action) => { state.transactions = action.payload.data || action.payload; state.loading = false; })
            .addCase(fetchTransactions.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error; })

            .addCase(fetchInvoices.fulfilled, (state, action) => { state.invoices = action.payload.data || action.payload; state.loading = false; })
            .addCase(fetchInvoices.rejected, (state, action) => { state.loading = false; state.error = action.payload || action.error; });
    }
});

export const { setSelectedAccount, clearStripeState } = slice.actions;
export default slice.reducer;
