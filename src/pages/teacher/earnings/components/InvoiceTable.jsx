import React, { useState } from "react";
import Icon from "../../../../components/AppIcon";
import Button from "../../../../components/ui/Button";
import { successToast } from "../../../../utils/utils";

const InvoiceTable = ({ data, isLoading = false }) => {
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
        className={`text-xs font-medium ${statusClasses[status] || "text-error"
          }`}
      >
        {status}
      </span>
    );
  };

  const handleDownloadInvoice = (invoice) => {
    if (invoice?.downloadUrl) {
      // Open the download URL in a new tab
      window.open(invoice.downloadUrl, "_blank");
      successToast("Invoice downloaded successfully!");
    } else {
      console.error("No download URL available for invoice:", invoice?.invoiceId);
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
  console.log(data)
  return (
    <div>
      <div>
        {data?.map((item, index) => (
          <div
            key={index}
            className="py-3 border-b border-border last:border-b-0"
          >
            <div className="flex flex-col md:flex-row md:justify-between items-start mb-2 gap-2 md:gap-0">
              <div className="flex items-center gap-4">
                <Icon name="Receipt" size={16} className="text-success" />
                <div>
                  <h4 className="text-brand-gray-800 font-medium text-[16px]">
                    {item?.invoiceId}
                  </h4>
                  <span className="text-sm text-brand-500">
                    {formatDate(item?.date)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <span className="text-brand-gray-800 font-semibold text-[16px]">
                  {formatCurrency(item?.amount)}
                </span>
                {getStatus(item?.status)}
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Download"
                  onClick={() => handleDownloadInvoice(item)}
                >
                  Download
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {data?.length === 0 && (
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
      )}
    </div>
  );
};

export default InvoiceTable;
