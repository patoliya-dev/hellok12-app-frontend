import Icon from "components/AppIcon";
import Image from "components/AppImage";
import Button from "components/ui/Button";
import { useState } from "react";

const baseTransactions = [
  {
    title: "Game Subscription - Monthly",
    id: "txn_001",
    dateTime: "2024-08-01T10:30:00Z",
    amount: "$100",
    status: "Completed",
    method: "Visa ****4532",
    reference: "INV-2024-001",
  },
  {
    title: "E-learning Course - Annual",
    id: "txn_002",
    dateTime: "2024-08-15T14:45:00Z",
    amount: "$250",
    status: "Failed",
    method: "Mastercard ****8271",
    reference: "INV-2024-002",
  },
  {
    title: "Cloud Storage Upgrade",
    id: "txn_003",
    dateTime: "2024-09-05T09:15:00Z",
    amount: "$50",
    status: "Failed",
    method: "PayPal",
    reference: "INV-2024-003",
  },
  {
    title: "Fitness App - 6 Months",
    id: "txn_004",
    dateTime: "2024-09-20T19:20:00Z",
    amount: "$75",
    status: "Completed",
    method: "Visa ****9987",
    reference: "INV-2024-004",
  },
  {
    title: "Online Workshop - Design Basics",
    id: "txn_005",
    dateTime: "2024-10-01T11:00:00Z",
    amount: "$120",
    status: "Completed",
    method: "UPI",
    reference: "INV-2024-005",
  },
];

const TransactionsHistory = () => {
  const filterButton = ["All Transactions", "Completed", "Failed"];
  const [activeFilter, setActiveFilter] = useState("All Transactions");
  const [transactions, setTransactions] = useState(baseTransactions);

  const formatDate = (dateTime) => {
    return new Date(dateTime).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatus = (status) => {
    const isCompleted = status === "Completed";
    return (
      <div className="flex items-center gap-2">
        {isCompleted ? (
          <Icon name="CheckCircle" size={16} className="text-green-600" />
        ) : (
          <Image
            src={"/assets/images/failed.svg"}
            className="w-4 h-4 object-contain"
          />
        )}
        <span
          className={`text-xs font-medium ${
            isCompleted ? "text-green-600" : "text-red-600"
          }`}
        >
          {status}
        </span>
      </div>
    );
  };

  const handleFilter = (e) => {
    const filter = e.target.textContent;
    setActiveFilter(filter);

    if (filter === "All Transactions") {
      setTransactions(baseTransactions);
    } else {
      const filteredTransactions = baseTransactions.filter(
        (transaction) => transaction.status === filter
      );
      setTransactions(filteredTransactions);
    }
  };

  const handleDownloadReceipt = (receipt) => {
    // Handle receipt download logic here
    console.log("Downloading receipt:", receipt?.id);
    alert("Receipt downloaded successfully!");
  };

  return (
    <div>
      <div className="flex gap-4 flex-wrap">
        {filterButton.map((button, index) => (
          <Button
            key={index}
            className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${
              activeFilter === button
                ? "bg-brand-blue text-white"
                : "bg-[#F4F4F4] text-brand-gray-500 hover:bg-gray-100"
            }`}
            onClick={(e) => handleFilter(e)}
          >
            {button}
          </Button>
        ))}
      </div>
      <div className="mt-6 flex flex-col gap-6 h-[450px] md:h-[480px] xl:h-[550px] overflow-auto">
        {transactions?.map((transaction, index) => (
          <div key={index} className="border border-border p-4 rounded-md">
            <div className="flex justify-between mb-8">
              <div>
                <h4 className="text-[16px] font-medium text-brand-gray-800 mb-2">
                  {transaction.title}
                </h4>
                <span className="text-sm text-brand-gray-500">
                  {formatDate(transaction.dateTime)} • ID: {transaction.id}
                </span>
              </div>
              <div className="flex flex-col items-end gap-2">
                <h4 className="text-[16px] font-semibold text-brand-gray-800">
                  {transaction.amount}
                </h4>
                {getStatus(transaction.status)}
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between gap-5 md:gap-0">
              <div className="flex flex-col md:flex-row gap-4 md:gap-12 text-sm">
                <h4 className="text-brand-gray-500">
                  Payment Method:
                  <span className="text-brand-gray-800 ml-2">
                    {transaction.method}
                  </span>
                </h4>
                <h4 className="text-brand-gray-500">
                  Reference:
                  <span className="text-brand-gray-800 ml-2">
                    {transaction.reference}
                  </span>
                </h4>
              </div>
              {transaction?.status === "Completed" && (
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => handleDownloadReceipt(transaction)}
                >
                  <Icon
                    name="ArrowDownToLine"
                    size={18}
                    className="text-brand-blue"
                  />
                  <span className="text-sm text-brand-blue">Receipt</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionsHistory;
