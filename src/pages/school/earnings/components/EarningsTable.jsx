import React, { useState } from "react";
import Icon from "../../../../components/AppIcon";
import Button from "../../../../components/ui/Button";
import Loader from "../../../../components/ui/Loader";

const EarningsTable = ({ data, isLoading = false }) => {
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");

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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedData = [...data]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];

    if (sortField === "date") {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    } else if (sortField === "amount") {
      aValue = parseFloat(aValue);
      bValue = parseFloat(bValue);
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleExport = () => {
    const csvContent = [
      ["Date", "Description", "Amount"],
      ...data?.map((item) => [
        formatDate(item?.date),
        item?.description,
        item?.amount,
      ]),
    ]
      ?.map((row) => row?.join(","))
      ?.join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL?.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `earnings-${new Date()?.toISOString()?.split("T")?.[0]}.csv`;
    a?.click();
    window.URL?.revokeObjectURL(url);
  };

  return (
    <div className="bg-card rounded-lg shadow-card border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <h3 className="text-lg font-semibold text-foreground">Earnings</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            iconName="Download"
            iconPosition="left"
          >
            Export CSV
          </Button>
        </div>
      </div>
      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader />
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="md:hidden">
            {sortedData?.map((item, index) => (
              <div
                key={index}
                className="p-4 border-b border-border last:border-b-0"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm font-medium text-foreground">
                    {formatDate(item?.date)}
                  </div>
                  <div className="text-lg font-semibold text-primary">
                    {formatCurrency(item?.amount)}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {item?.description}
                </div>
              </div>
            ))}
          </div>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4">
                    <button
                      onClick={() => handleSort("date")}
                      className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                    >
                      <span>Date</span>
                      <Icon
                        name={
                          sortField === "date" && sortDirection === "asc"
                            ? "ChevronUp"
                            : "ChevronDown"
                        }
                        size={16}
                      />
                    </button>
                  </th>
                  <th className="text-left p-4">
                    <button
                      onClick={() => handleSort("description")}
                      className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                    >
                      <span>Lesson/Service</span>
                      <Icon
                        name={
                          sortField === "description" && sortDirection === "asc"
                            ? "ChevronUp"
                            : "ChevronDown"
                        }
                        size={16}
                      />
                    </button>
                  </th>
                  <th className="text-right p-4">
                    <button
                      onClick={() => handleSort("amount")}
                      className="flex items-center justify-end space-x-1 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                    >
                      <span>Amount</span>
                      <Icon
                        name={
                          sortField === "amount" && sortDirection === "asc"
                            ? "ChevronUp"
                            : "ChevronDown"
                        }
                        size={16}
                      />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedData?.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-border last:border-b-0 hover:bg-muted/50 transition-smooth"
                  >
                    <td className="p-4 text-sm text-foreground w-[300px]">
                      {formatDate(item?.date)}
                    </td>
                    <td className="p-4 text-sm text-foreground w-[1000px]">
                      {item?.description}
                    </td>
                    <td className="p-4 text-sm font-semibold text-primary">
                      {formatCurrency(item?.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {sortedData?.length === 0 && (
            <div className="p-8 text-center">
              <Icon
                name="Receipt"
                size={48}
                className="mx-auto text-muted-foreground mb-4"
              />
              <h4 className="text-lg font-medium text-foreground mb-2">
                No earnings data
              </h4>
              <p className="text-muted-foreground">
                No earnings found for the selected period. Start teaching to see
                your earnings here!
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EarningsTable;
