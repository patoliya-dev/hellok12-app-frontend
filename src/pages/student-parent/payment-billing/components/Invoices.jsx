import { useState } from "react";
import Icon from "components/AppIcon";
import InvoiceModal from "./InvoiceModal";

// Mock data for invoices
const baseInvoices = [
  {
    id: "INV-2024-001",
    number: "HelloK12-001",
    dateTime: "2024-08-01T10:30:00Z",
    dueDate: "2024-09-01T10:30:00Z",
    amount: "$99.99",
    status: "Paid",
    premiumPlan: "$89.99",
    plafformFee: "$4.99",
    tax: "$4.99",
    downloadUrl: "#",
    items: [
      { description: "Spanish Language Course", quantity: 1, price: "$99.99" },
    ],
    paymentMethod: "Mastercard ****8765",
  },
  {
    id: "INV-2024-002",
    number: "HelloK12-002",
    dateTime: "2024-08-15T14:00:00Z",
    dueDate: "2024-09-15T14:00:00Z",
    amount: "$59.99",
    status: "Refunded",
    premiumPlan: "$54.99",
    plafformFee: "$2.50",
    tax: "$2.50",
    downloadUrl: "#",
    items: [
      { description: "Photography Workshop", quantity: 1, price: "$59.99" },
    ],
    paymentMethod: "Visa ****4321",
  },
  {
    id: "INV-2024-003",
    number: "HelloK12-003",
    dateTime: "2024-09-05T09:30:00Z",
    dueDate: "2024-09-25T09:30:00Z",
    amount: "$129.99",
    status: "Overdue",
    premiumPlan: "$119.99",
    plafformFee: "$5.00",
    tax: "$5.00",
    downloadUrl: "#",
    items: [
      {
        description: "Full Stack Development Bootcamp",
        quantity: 1,
        price: "$129.99",
      },
    ],
    paymentMethod: "Amex ****9876",
  },
  {
    id: "INV-2024-004",
    number: "HelloK12-004",
    dateTime: "2024-09-20T17:45:00Z",
    dueDate: "2024-10-10T17:45:00Z",
    amount: "$39.99",
    status: "Cancelled",
    premiumPlan: "$34.99",
    plafformFee: "$2.50",
    tax: "$2.50",
    downloadUrl: "#",
    items: [
      {
        description: "Yoga Membership (Monthly)",
        quantity: 1,
        price: "$39.99",
      },
    ],
    paymentMethod: "PayPal",
  },
  {
    id: "INV-2024-005",
    number: "HelloK12-005",
    dateTime: "2024-10-01T12:15:00Z",
    dueDate: "2024-10-30T12:15:00Z",
    amount: "$199.99",
    status: "Paid",
    premiumPlan: "$189.99",
    plafformFee: "$5.00",
    tax: "$5.00",
    downloadUrl: "#",
    items: [
      {
        description: "Premium Business Plan (Annual)",
        quantity: 1,
        price: "$199.99",
      },
    ],
    paymentMethod: "Mastercard ****1234",
  },
  {
    id: "INV-2024-006",
    number: "HelloK12-006",
    dateTime: "2024-10-18T19:00:00Z",
    dueDate: "2024-11-18T19:00:00Z",
    amount: "$79.99",
    status: "Overdue",
    premiumPlan: "$74.99",
    plafformFee: "$2.50",
    tax: "$2.50",
    downloadUrl: "#",
    items: [
      { description: "Digital Marketing Course", quantity: 1, price: "$79.99" },
    ],
    paymentMethod: "Visa ****5678",
  },
  {
    id: "INV-2024-007",
    number: "HelloK12-007",
    dateTime: "2024-11-02T08:20:00Z",
    dueDate: "2024-12-02T08:20:00Z",
    amount: "$49.99",
    status: "Refunded",
    premiumPlan: "$44.99",
    plafformFee: "$2.50",
    tax: "$2.50",
    downloadUrl: "#",
    items: [
      { description: "Cooking Class (Beginner)", quantity: 1, price: "$49.99" },
    ],
    paymentMethod: "UPI ****9988",
  },
  {
    id: "INV-2024-008",
    number: "HelloK12-008",
    dateTime: "2024-11-15T15:40:00Z",
    dueDate: "2024-12-15T15:40:00Z",
    amount: "$149.99",
    status: "Cancelled",
    premiumPlan: "$139.99",
    plafformFee: "$5.00",
    tax: "$5.00",
    downloadUrl: "#",
    items: [
      { description: "Web Design Masterclass", quantity: 1, price: "$149.99" },
    ],
    paymentMethod: "NetBanking ****7766",
  },
];

const Invoices = () => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const formatDate = (dateTime) => {
    return new Date(dateTime).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatus = (status) => {
    const statusClasses = {
      Paid: "text-[#1EC35B]",
      Pending: "text-warning",
      Refunded: "text-muted-foreground",
      Overdue: "text-destructive",
      Cancelled: "text-muted-foreground",
    };

    return (
      <span
        className={`text-xs font-medium ${
          statusClasses[status] || "text-error"
        }`}
      >
        {status}
      </span>
    );
  };

  const handleModalClose = () => {
    setSelectedInvoice(null);
    setShowInvoiceModal(false);
  };

  const handleDownloadInvoice = (invoice) => {
    console.log("Downloading invoice:", invoice?.id);
    alert("Invoice downloaded successfully!");
  };

  return (
    <div className="flex flex-col gap-6 h-[570px] md:h-[545px] xl:h-[625px] overflow-auto">
      {baseInvoices?.map((invoice, index) => (
        <div key={index} className="border border-border p-4 rounded-md">
          <div className="flex justify-between mb-4">
            <div>
              <h4 className="text-[16px] font-medium text-brand-gray-800 mb-2">
                {invoice.id}
              </h4>
              <span className="text-sm text-brand-gray-500">
                {formatDate(invoice.dateTime)} • Premium Plan
              </span>
            </div>
            <div className="flex flex-col items-end gap-2">
              <h4 className="text-[16px] font-semibold text-brand-gray-800">
                {invoice.amount}
              </h4>
              {getStatus(invoice.status)}
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <h5 className="text-brand-gray-800">Items:</h5>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Premium Plan:</span>
              <span className="text-brand-gray-800">{invoice.premiumPlan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Platform Fee:</span>
              <span className="text-brand-gray-800">{invoice.plafformFee}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax:</span>
              <span className="text-brand-gray-800">{invoice.tax}</span>
            </div>
          </div>
          <div className="border-t border-border mt-4 pt-3 px-2 flex justify-between">
            {["PDF", "View"].map((item, index) => (
              <div
                className="flex items-center gap-2 cursor-pointer"
                key={index}
                onClick={() => {
                  if (item === "View") {
                    setSelectedInvoice(invoice);
                    setShowInvoiceModal(true);
                  } else {
                    handleDownloadInvoice(invoice);
                  }
                }}
              >
                <Icon
                  name={item === "PDF" ? "ArrowDownToLine" : "Eye"}
                  size={18}
                  className="text-brand-gray-800"
                />
                <span className="text-sm text-brand-gray-800">{item}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Invoice Modal */}
      {showInvoiceModal && selectedInvoice && (
        <InvoiceModal
          selectedInvoice={selectedInvoice}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default Invoices;
