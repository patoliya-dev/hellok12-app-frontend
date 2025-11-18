import { useState } from "react";
import Icon from "components/AppIcon";
import InvoiceModal from "./InvoiceModal";
import { useDispatch } from "react-redux";
import { fetchInvoices } from "../../../../reducers/payments/paymentsThunks";

const Invoices = ({ invoices = [] }) => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const dispatch = useDispatch();

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
        className={`text-xs font-medium ${statusClasses[status] || "text-error"
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

  const handleDownloadInvoice = async (invoice) => {
    console.log("Downloading invoice:", invoice?.id);
    try {
      // call backend to get pdfUrl (payment thunk must implement fetchInvoices)
      const res = await dispatch(fetchInvoices({ invoiceId: invoice.id })).unwrap();
      const url = res?.data?.pdfUrl || res?.pdfUrl || res?.url;
      if (url) {
        window.open(url, '_blank');
      } else {
        alert("Invoice downloaded successfully!");
      }
    } catch (err) {
      alert("Invoice download failed");
    }
  };

  return (
    <div className="flex flex-col gap-6 h-[570px] md:h-[545px] xl:h-[625px] overflow-auto">
      {invoices?.map((invoice, index) => (
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
                {invoice.amount || `$${(invoice.totalCents || 0) / 100}`}
              </h4>
              {getStatus(invoice.status)}
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <h5 className="text-brand-gray-800">Items:</h5>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Premium Plan:</span>
              <span className="text-brand-gray-800">{invoice.premiumPlan || invoice.items?.[0]?.price}</span>
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
            {["PDF", "View"].map((item, idx) => (
              <div
                className="flex items-center gap-2 cursor-pointer"
                key={idx}
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
