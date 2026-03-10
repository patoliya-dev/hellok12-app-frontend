import React from "react";
import Icon from "../../../../components/AppIcon";
import { successToast } from "../../../../utils/utils";

const InvoiceTable = ({
  data,
  isLoading = false,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    })?.format(amount);
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString("en-US", {
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
        className={`text-xs font-medium ${statusClasses[status] || "text-error"}`}
      >
        {status}
      </span>
    );
  };

  const handleDownloadInvoice = (invoice) => {
    if (invoice?.downloadUrl) {
      // Payout receipts are external assets; open directly to avoid proxying file bytes through UI.
      window.open(invoice.downloadUrl, "_blank");
      successToast("Invoice downloaded successfully!");
    } else {
      console.error(
        "No download URL available for invoice:",
        invoice?.invoiceId,
      );
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-16 bg-muted rounded"></div>
          <div className="h-16 bg-muted rounded"></div>
          <div className="h-16 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const safeTotalPages = Math.max(1, Number(totalPages || 1));
  const safeCurrentPage = Math.min(
    Math.max(1, Number(currentPage || 1)),
    safeTotalPages,
  );
  const startItem = totalItems > 0 ? (safeCurrentPage - 1) * pageSize + 1 : 0;
  const endItem =
    totalItems > 0 ? Math.min(safeCurrentPage * pageSize, totalItems) : 0;

  return (
    <div className="rounded-md border border-border">
      <div className="divide-y divide-border">
        {data?.map((item, index) => (
          <div key={index} className="py-3 px-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  name="Receipt"
                  size={14}
                  className="text-success mt-0.5 shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-foreground font-medium text-sm truncate">
                    {item?.invoiceId}
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(item?.date)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 sm:gap-6 ml-0 sm:ml-4">
                <span className="text-foreground font-semibold text-sm sm:text-base">
                  {formatCurrency(item?.amount)}
                </span>
                <div className="min-w-[48px]">{getStatus(item?.status)}</div>
                <button
                  type="button"
                  className={`inline-flex items-center gap-1.5 text-xs sm:text-sm ${item?.downloadUrl ? "text-foreground hover:text-primary" : "text-muted-foreground cursor-not-allowed"}`}
                  onClick={() => handleDownloadInvoice(item)}
                  disabled={!item?.downloadUrl}
                >
                  <Icon name="Download" size={14} />
                  Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {data?.length === 0 ? (
        <div className="p-8 text-center">
          <Icon
            name="Receipt"
            size={48}
            className="mx-auto text-muted-foreground mb-4"
          />
          <h4 className="text-lg font-medium text-foreground mb-2">
            No invoice data
          </h4>
        </div>
      ) : (
        <div className="px-4 py-3 border-t border-border flex flex-col sm:flex-row gap-3 sm:gap-2 sm:items-center sm:justify-between">
          <div className="text-xs text-muted-foreground">
            Showing {startItem} to {endItem} of {totalItems} payments
          </div>
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              className={`inline-flex items-center gap-1 px-2 py-1 rounded ${safeCurrentPage === 1 ? "text-muted-foreground cursor-not-allowed" : "text-foreground hover:text-primary"}`}
              onClick={() => onPageChange?.(safeCurrentPage - 1)}
              disabled={safeCurrentPage === 1}
            >
              <Icon name="ChevronLeft" size={14} />
              Previous
            </button>
            <span className="inline-flex min-w-8 justify-center rounded bg-primary text-primary-foreground px-2 py-1 font-medium">
              {safeCurrentPage}
            </span>
            <button
              type="button"
              className={`inline-flex items-center gap-1 px-2 py-1 rounded ${safeCurrentPage >= safeTotalPages ? "text-muted-foreground cursor-not-allowed" : "text-foreground hover:text-primary"}`}
              onClick={() => onPageChange?.(safeCurrentPage + 1)}
              disabled={safeCurrentPage >= safeTotalPages}
            >
              Next
              <Icon name="ChevronRight" size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceTable;
