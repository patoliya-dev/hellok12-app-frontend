import { useEffect, useState } from "react";
import Icon from "components/AppIcon";
import InvoiceModal from "./InvoiceModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchInvoices, fetchInvoiceDetail, downloadInvoicePdf } from "../../../../reducers/payments/paymentsThunks";
import Loader from "components/ui/Loader";
import { errorToast, successToast } from "../../../../utils/utils";

const Invoices = () => {
  const dispatch = useDispatch();
  const invoicesState = useSelector((s) => s.payments?.invoices || {});
  const { items: invoices = [], loading, page = 1, limit = 10, total = 0 } = invoicesState;
  const invoiceDetail = useSelector((s) => s.payments?.invoiceDetail || {});
  const currentUser = useSelector((s) => s.auth?.user || null);
  const selectedStudentId = useSelector((s) => s.payments?.selectedStudentId || null) || currentUser?.selectedStudentId || null;

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  useEffect(() => {
    dispatch(fetchInvoices({ page: 1, pageSize: limit, studentId: selectedStudentId }))
      .unwrap()
      .catch((err) => errorToast(err?.message || "Failed to load invoices"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, selectedStudentId]);

  const formatDate = (dateTime) =>
    new Date(dateTime).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const getStatus = (status) => {
    const statusClasses = {
      Paid: "text-[#1EC35B]",
      Pending: "text-warning",
      Refunded: "text-muted-foreground",
      Overdue: "text-destructive",
      Cancelled: "text-muted-foreground",
    };
    return <span className={`text-xs font-medium ${statusClasses[status] || "text-error"}`}>{status}</span>;
  };

  const handleModalClose = () => {
    setSelectedInvoice(null);
    setShowInvoiceModal(false);
  };

  const handleDownloadInvoice = async (invoice) => {
    try {
      const res = await dispatch(downloadInvoicePdf(invoice.id)).unwrap();
      const url = res?.url || res?.data?.url || res?.pdfUrl || res?.data?.pdfUrl;
      if (url) {
        window.open(url, "_blank");
      } else {
        successToast("Invoice downloaded successfully!");
      }
    } catch (err) {
      errorToast("Invoice download failed");
    }
  };

  // const openViewModal = async (invoice) => {
  //   setSelectedInvoice(null);
  //   setShowInvoiceModal(true);
  //   try {
  //     // load full invoice detail
  //     const res = await dispatch(fetchInvoiceDetail(invoice.id)).unwrap();
  //     // setSelectedInvoice with returned data
  //     setSelectedInvoice(res?.data || res);
  //   } catch (err) {
  //     errorToast("Failed to load invoice detail");
  //     setShowInvoiceModal(false);
  //   }
  // };

  return (
    <div className="flex flex-col gap-6 h-[570px] md:h-[545px] xl:h-[625px] overflow-auto">
      {loading && invoices.length === 0 ? <div className="py-8"><Loader /></div> : null}

      {invoices?.map((invoice, index) => (
        <div key={invoice.id || index} className="border border-border p-4 rounded-md">
          <div className="flex justify-between mb-4">
            <div>
              <h4 className="text-[16px] font-medium text-brand-gray-800 mb-2">
                {invoice.invoiceNumber || invoice.id}
              </h4>
              <span className="text-sm text-brand-gray-500">
                {formatDate(invoice.dateTime || invoice.createdAt)} • {invoice.description || "Invoice"}
              </span>
            </div>
            <div className="flex flex-col items-end gap-2">
              <h4 className="text-[16px] font-semibold text-brand-gray-800">
                {invoice.amountDisplay || invoice.amount || `$${((invoice.totalCents || 0) / 100).toFixed(2)}`}
              </h4>
              {getStatus(invoice.status)}
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <h5 className="text-brand-gray-800">Items</h5>
            {/* <div className="flex justify-between">
              <span className="text-muted-foreground">Premium Plan:</span>
              <span className="text-brand-gray-800">{invoice.premiumPlan || invoice.items?.[0]?.description || ''}</span>
            </div> */}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Platform Fee:</span>
              {/* <span className="text-brand-gray-800">{`$${((invoice.items?.find(i => i.description === "Platform Fee")?.unitAmount || 0) / 100).toFixed(2)}` || ''}</span> */}
              <span className="text-brand-gray-800">{(invoice.platformFee / 100).toFixed(2)}</span>
            </div>
            {/* <div className="flex justify-between">
              <span className="text-muted-foreground">Tax:</span>
              <span className="text-brand-gray-800">{invoice.tax || ''}</span>
            </div> */}
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
                  }
                  else handleDownloadInvoice(invoice);
                }}
              >
                <Icon name={item === "PDF" ? "ArrowDownToLine" : "Eye"} size={18} className="text-brand-gray-800" />
                <span className="text-sm text-brand-gray-800">{item}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Invoice Modal */}
      {showInvoiceModal && selectedInvoice && (
        <InvoiceModal selectedInvoice={selectedInvoice} onClose={handleModalClose} />
      )}
    </div>
  );
};

export default Invoices;
