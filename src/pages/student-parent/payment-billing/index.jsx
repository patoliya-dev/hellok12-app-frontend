import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RoleBasedHeader from "../../../components/ui/RoleBasedHeader";
import Icon from "../../../components/AppIcon";
import PaymentMethodSelector from "./components/PaymentMethodSelector";
import TransactionsHistory from "./components/TransactionsHistory";
import Invoices from "./components/Invoices";
import {
  fetchPaymentMethods,
  fetchTransactions,
  fetchInvoices,
} from "../../../reducers/payments/paymentsThunks";

const PaymentBilling = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("payment-methods");
  const [userRole, setUserRole] = useState("student");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  // read from store
  const paymentMethods = useSelector((s) => s.payments?.methods || []);
  const transactions = useSelector((s) => s.payments?.transactions?.data || []);
  const invoices = useSelector((s) => s.payments?.invoices?.data || []);

  useEffect(() => {
    const savedRole = localStorage.getItem("userRole") || "student";
    setUserRole(savedRole);
  }, []);

  useEffect(() => {
    // fetch real data
    dispatch(fetchPaymentMethods());
    dispatch(fetchTransactions({ status: 'All' }));
    dispatch(fetchInvoices());
  }, [dispatch]);

  const tabConfig = [
    {
      id: "payment-methods",
      label: "Payment Methods",
      icon: "CreditCard",
      permissions: ["student", "parent"],
    },
    {
      id: "transactions-history",
      label: "Transactions History",
      icon: "Receipt",
      permissions: ["student", "parent"],
    },
    {
      id: "invoices",
      label: "Invoices",
      icon: "FileText",
      permissions: ["student", "parent"],
    },
  ];

  const visibleTabs = tabConfig?.filter((tab) =>
    tab?.permissions?.includes(userRole)
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "payment-methods":
        return (
          <PaymentMethodSelector
            savedCards={paymentMethods}
            onPaymentMethodSelect={handlePaymentMethodSelect}
            selectedMethod={selectedPaymentMethod}
            onAddPaymentMethod={handleAddPaymentMethod}
          />
        );
      case "transactions-history":
        return <TransactionsHistory transactions={transactions} />;
      case "invoices":
        return <Invoices invoices={invoices} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    // Set default payment method
    if (paymentMethods?.length > 0 && !selectedPaymentMethod) {
      const defaultCard =
        paymentMethods?.find((card) => card?.isDefault) || paymentMethods?.[0];
      setSelectedPaymentMethod({ type: "saved_card", data: defaultCard });
    }
  }, [paymentMethods, selectedPaymentMethod]);

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handleAddPaymentMethod = (data) => {
    // Reuse createSetupIntent flow from payments thunk via parent component or call thunk here if needed.
    // To keep component isolated, we will dispatch createSetupIntent here (simple pattern).
    (async () => {
      try {
        const res = await dispatch(createSetupIntent(data)).unwrap();
        // refresh list
        await dispatch(fetchPaymentMethods());
      } catch (err) {
        // error handling
      }
    })();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <RoleBasedHeader />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <section className="my-8">
          <h1 className="text-foreground font-bold text-h3 mb-2">
            Payment & Billing
          </h1>
          <p className="text-muted-foreground text-body2 xl:text-[16px]">
            Manage your payments, subscriptions, and billing preferences
          </p>
        </section>

        <section>
          {/* Tab Navigation */}
          <div>
            <div className="border border-border rounded-lg">
              <nav className="border-b border-border flex space-x-14 overflow-x-auto">
                {visibleTabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap transition-smooth ${activeTab === tab?.id
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                      }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </nav>
              <div className="p-6">{renderTabContent()}</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PaymentBilling;
