import Icon from "components/AppIcon";
import Button from "components/ui/Button";
import Loader from "components/ui/Loader";
import { errorToast } from "../../../../utils/utils";

const InvoiceModal = ({ selectedInvoice, onClose }) => {
  if (!selectedInvoice) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card border border-border rounded-lg max-w-2xl w-full p-8 text-center">
          <Loader />
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      PAID: {
        color: "bg-success/10 text-success",
        label: "Paid",
        icon: "CheckCircle",
      },
      PENDING: {
        color: "bg-warning/10 text-warning",
        label: "Pending",
        icon: "Clock",
      },
      OVERDUE: {
        color: "bg-destructive/10 text-destructive",
        label: "Overdue",
        icon: "AlertCircle",
      },
      REFUNDED: {
        color: "bg-muted text-muted-foreground",
        label: "Refunded",
        icon: "RotateCcw",
      },
      CANCELLED: {
        color: "bg-muted text-muted-foreground",
        label: "Cancelled",
        icon: "XCircle",
      },
    };

    const config = statusConfig?.[status] || statusConfig?.PENDING;
    return (
      <div
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}
      >
        <Icon name={config?.icon} size={12} className="mr-1" />
        {config?.label}
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toISOString().split("T")[0];
  };

  const handleDownloadInvoice = (invoice) => {
    if (invoice?.pdfUrl) {
      window.open(invoice.pdfUrl, '_blank');
      return;
    }
    // fallback: if invoice has hostedInvoiceUrl
    if (invoice?.hostedInvoiceUrl) {
      window.open(invoice.hostedInvoiceUrl, '_blank');
      return;
    }
    errorToast("Invoice download not available");
  };

  const handlePayInvoice = (invoice) => {
    // Keep payment flow unchanged - caller can implement createPaymentIntent etc.
    console.log("Pay Invoice requested", invoice?._id);
    errorToast("Pay flow not implemented in modal — use existing booking/payment flow.");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-large">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            Invoice Details
          </h3>
          <Button variant="ghost" size="icon" iconName="X" onClick={onClose} />
        </div>

        {/* Invoice Content */}
        <div className="p-6 space-y-6">
          {/* Invoice Header */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                HelloK12
              </h2>
              <p className="text-sm text-muted-foreground">
                123 Education Street
                <br />
                Learning City, LC 12345
                <br />
                contact@hellok12.com
              </p>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                INVOICE
              </h3>
              <p className="text-sm text-muted-foreground">
                Invoice #: {selectedInvoice?.number || selectedInvoice?._id}
                <br />
                Date: {formatDate(selectedInvoice?.createdAt || selectedInvoice?.date)}
                <br />
              </p>
            </div>
          </div>

          {/* Bill To */}
          <div>
            <h4 className="font-medium text-foreground mb-2">Bill To:</h4>
            <p className="text-sm text-muted-foreground">
              {selectedInvoice?.customerName || 'Customer'}
              <br />
              {selectedInvoice?.customerEmail || ''}
            </p>
          </div>

          {/* Invoice Items */}
          <div>
            <h4 className="font-medium text-foreground mb-3">Items:</h4>
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left py-2 px-4 text-sm font-medium text-muted-foreground">
                      Description
                    </th>
                    {/* <th className="text-center py-2 px-4 text-sm font-medium text-muted-foreground">
                      Qty
                    </th> */}
                    <th className="text-right py-2 px-4 text-sm font-medium text-muted-foreground">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice?.items?.map((item, index) => (
                    <tr key={index} className="border-t border-border">
                      <td className="py-2 px-4 text-sm text-foreground">
                        {item?.description}
                      </td>
                      {/* <td className="py-2 px-4 text-sm text-center text-foreground">
                        {item?.quantity}
                      </td> */}
                      <td className="py-2 px-4 text-sm text-right font-medium text-foreground">
                        {item?.priceDisplay}
                      </td>
                    </tr>
                  )) || <tr />}
                </tbody>
              </table>
            </div>
          </div>

          {/* Invoice Total */}
          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-2 border-t border-border">
                <span className="font-medium text-foreground">Total:</span>
                <span className="font-bold text-foreground text-lg">
                  {selectedInvoice?.priceDisplay || selectedInvoice?.total || selectedInvoice?.amountDisplay}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Payment Status:</p>
                <p className="text-sm text-muted-foreground">
                  Method: {selectedInvoice?.paymentMethod}
                </p>
              </div>
              {getStatusBadge(selectedInvoice?.status)}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            iconName="Download"
            onClick={() => handleDownloadInvoice(selectedInvoice)}
          >
            Download PDF
          </Button>
          {selectedInvoice?.status === "Overdue" && (
            <Button
              variant="default"
              onClick={() => handlePayInvoice(selectedInvoice)}
            >
              Pay Now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
