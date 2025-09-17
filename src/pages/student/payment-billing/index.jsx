import { useEffect, useState } from "react";
import RoleBasedHeader from "../../../components/ui/RoleBasedHeader";
import Icon from "../../../components/AppIcon";
import PaymentMethodSelector from "./components/PaymentMethodSelector";
import TransactionsHistory from "./components/TransactionsHistory";
import Invoices from "./components/Invoices";

// Mock data for saved payment methods
const savedCards = [
  {
    id: "card_1",
    last4: "4242",
    brand: "Visa",
    expiry: "12/26",
    isDefault: true,
  },
  {
    id: "card_2",
    last4: "5555",
    brand: "Mastercard",
    expiry: "08/27",
    isDefault: false,
  },
];

const PaymentBilling = () => {
  const [activeTab, setActiveTab] = useState("payment-methods");
  const [userRole, setUserRole] = useState("student");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  useEffect(() => {
    // Check for user role (mock authentication)
    const savedRole = localStorage.getItem("userRole") || "student";
    setUserRole(savedRole);
  }, []);

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
            savedCards={savedCards}
            onPaymentMethodSelect={handlePaymentMethodSelect}
            selectedMethod={selectedPaymentMethod}
            onAddPaymentMethod={handleAddPaymentMethod}
          />
        );
      case "transactions-history":
        return <TransactionsHistory />;
      case "invoices":
        return <Invoices />;
      default:
        return null;
    }
  };

  useEffect(() => {
    // Set default payment method
    if (savedCards?.length > 0) {
      const defaultCard =
        savedCards?.find((card) => card?.isDefault) || savedCards?.[0];
      setSelectedPaymentMethod({ type: "saved_card", data: defaultCard });
    }
  }, []);

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handleAddPaymentMethod = (data) => {
    const updateData = {
      id: `card_${savedCards?.length + 1}`,
      last4: data?.cardNumber?.slice(-4),
      brand: "Card",
      expiry: data?.expiryDate,
      isDefault: false,
    };
    savedCards.push(updateData);
    setSelectedPaymentMethod({ type: "new_card", data: updateData });
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
                    className={`flex items-center space-x-2 py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap transition-smooth ${
                      activeTab === tab?.id
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
