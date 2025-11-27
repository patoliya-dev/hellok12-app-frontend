import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import RoleBasedHeader from "components/ui/RoleBasedHeader";
import { selectAuthUser } from "reducers/auth/authSelectors";
import { fetchAccountStatus, fetchBalance, fetchTransactions, fetchInvoices } from "reducers/stripe/stripeThunks";
import ConnectedAccountTab from "./components/ConnectedAccountTab";
import PayoutsTab from "./components/PayoutsTab";
// import TransactionsTab from "./components/TransactionsTab";
// import InvoicesTab from "./components/InvoicesTab";
// import PaymentMethodsTab from "./components/PaymentMethodsTab"; // optional: reuse existing components
import Loader from "components/ui/Loader";

const TABS = [
    { id: "payment_methods", label: "Payment Methods" },
    { id: "connected", label: "Connected Account" },
    // { id: "transactions", label: "Transactions" },
    // { id: "invoices", label: "Invoices" },
    // { id: "payouts", label: "Payouts & Balance" },
    // { id: "verification", label: "Verification Status" }
];

const BillingDashboard = () => {
    const dispatch = useDispatch();
    const authUser = useSelector(selectAuthUser);
    const stripeState = useSelector((s) => s.stripe);
    const [activeTab, setActiveTab] = useState("connected");

    useEffect(() => {
        // On mount, fetch cached account from localStorage if present
        const cached = localStorage.getItem("stripe:selectedAccount");
        if (cached) {
            try {
                dispatch({ type: "stripe/setSelectedAccount", payload: JSON.parse(cached) });
            } catch (e) { }
        }
        // fetch live status for teacher/school
        if (["teacher", "school"].includes(authUser?.role)) {
            dispatch(fetchAccountStatus());
            dispatch(fetchBalance());
            dispatch(fetchTransactions());
            dispatch(fetchInvoices());
        } else {
            // For parents/students, show payment methods & invoices only
            dispatch(fetchInvoices());
        }
    }, [authUser?.id, authUser?.role, dispatch]);

    if (!authUser) return <Loader />;

    const isPayoutRole = ["teacher", "school"].includes(authUser.role);

    return (
        <div className="min-h-screen bg-background">
            <RoleBasedHeader />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
                <h1 className="text-h4 font-bold mb-4">Billing & Payouts</h1>

                <div className="bg-card border border-border rounded-lg p-4 mb-6 flex gap-3 overflow-x-auto">
                    {TABS.map(t => {
                        if (t.id === "connected" && !isPayoutRole) return null;
                        if (t.id === "payouts" && !isPayoutRole) return null;
                        if (t.id === "verification" && !isPayoutRole) return null;
                        return (
                            <button key={t.id} className={`px-4 py-2 rounded ${activeTab === t.id ? 'bg-primary text-white' : 'bg-muted'}`} onClick={() => setActiveTab(t.id)}>
                                {t.label}
                            </button>
                        );
                    })}
                </div>

                <div className="bg-card border border-border rounded-lg p-6">
                    {/* {activeTab === "payment_methods" && <PaymentMethodsTab />} */}
                    {activeTab === "connected" && <ConnectedAccountTab />}
                    {/* {activeTab === "transactions" && <TransactionsTab />}
                    {activeTab === "invoices" && <InvoicesTab />} */}
                    {activeTab === "payouts" && <PayoutsTab />}
                    {activeTab === "verification" && <ConnectedAccountTab showVerificationOnly />}
                </div>
            </main>
        </div>
    );
};

export default BillingDashboard;
