import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions, downloadTransactionReceipt } from "../../../../reducers/payments/paymentsThunks";
import Icon from "components/AppIcon";
import Image from "components/AppImage";
import Button from "components/ui/Button";
import Loader from "components/ui/Loader";
import { errorToast, infoToast } from "../../../../utils/utils";

const TransactionsHistory = () => {
  const dispatch = useDispatch();
  const filterButton = ["All Transactions", "Completed", "Failed"];
  const [activeFilter, setActiveFilter] = useState("All Transactions");

  // read from store
  const transactionsState = useSelector((s) => s.payments?.transactions || {});
  const { items: transactions = [], loading, total = 0, page = 1, limit = 20 } = transactionsState;
  const currentUser = useSelector((s) => s.auth?.user || null);
  const selectedStudentId = useSelector((s) => s.payments?.selectedStudentId || null) || currentUser?.selectedStudentId || null;

  const load = useCallback(
    (opts = {}) => {
      const map = { "All Transactions": "", Completed: "SUCCEEDED", Failed: "FAILED" };
      const filter = opts.filter || activeFilter;
      const statusParam = map[filter] || "";
      dispatch(fetchTransactions({ status: statusParam, page: opts.page || 1, pageSize: opts.pageSize || limit, studentId: opts.studentId || selectedStudentId }))
        .unwrap()
        .catch((err) => errorToast(err?.message || "Failed to load transactions"));
    },
    [dispatch, activeFilter, limit, selectedStudentId]
  );

  useEffect(() => { load({ page: 1 }); }, [load]);

  const handleFilter = (e) => {
    const filter = e.target.textContent;
    setActiveFilter(filter);
    load({ filter, page: 1 });
  };

  const loadMore = () => {
    load({ page: page + 1 });
  };

  const formatDate = (dateTime) =>
    new Date(dateTime).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const getStatus = (status) => {
    const isCompleted = status === "SUCCEEDED" || status === "COMPLETED" || status === "Completed";
    return (
      <div className="flex items-center gap-2">
        {isCompleted ? <Icon name="CheckCircle" size={16} className="text-green-600" /> : <Image src={"/assets/images/failed.svg"} className="w-4 h-4 object-contain" />}
        <span className={`text-xs font-medium ${isCompleted ? "text-green-600" : "text-red-600"}`}>{status}</span>
      </div>
    );
  };

  const handleDownloadReceipt = async (tx) => {
    try {
      if (tx?.downloadUrl) {
        window.open(tx.downloadUrl, "_blank");
        return;
      }
      const res = await dispatch(downloadTransactionReceipt(tx.id)).unwrap();
      const url = res?.url || res?.receipt_url || res?.data?.url;
      if (url) window.open(url, "_blank");
      else infoToast("Receipt not available");
    } catch (err) {
      errorToast("Receipt download failed");
    }
  };

  return (
    <div>
      <div className="flex gap-4 flex-wrap">
        {filterButton.map((button, index) => (
          <Button key={index} className={`px-6 py-2 text-sm font-medium rounded-md transition-colors ${activeFilter === button ? "bg-brand-blue text-white" : "bg-[#F4F4F4] text-brand-gray-500 hover:bg-gray-100"}`} onClick={(e) => handleFilter(e)}>
            {button}
          </Button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-6 h-[450px] md:h-[480px] xl:h-[550px] overflow-auto">
        {loading && transactions.length === 0 ? <div className="py-8"><Loader /></div> : (
          transactions?.map((transaction, index) => (
            <div key={transaction.id || index} className="border border-border p-4 rounded-md">
              <div className="flex justify-between mb-8">
                <div>
                  <h4 className="text-[16px] font-medium text-brand-gray-800 mb-2">
                    {transaction.title || transaction.description || transaction.id}
                  </h4>
                  <span className="text-sm text-brand-gray-500">
                    {formatDate(transaction.dateTime || transaction.createdAt)} • ID: {transaction.reference || transaction.id}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <h4 className="text-[16px] font-semibold text-brand-gray-800">
                    {transaction.amountDisplay || transaction.amount || `$${((transaction.amountCents || transaction.amount || 0) / 100).toFixed(2)}`}
                  </h4>
                  {getStatus(transaction.status)}
                </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between gap-5 md:gap-0">
                <div className="flex flex-col md:flex-row gap-4 md:gap-12 text-sm">
                  <h4 className="text-brand-gray-500">
                    Payment Method:
                    <span className="text-brand-gray-800 ml-2">
                      {transaction.method || transaction.paymentMethod || ''}
                    </span>
                  </h4>
                  <h4 className="text-brand-gray-500">
                    Reference:
                    <span className="text-brand-gray-800 ml-2">
                      {transaction.reference || transaction.invoiceId || ''}
                    </span>
                  </h4>
                </div>

                {(transaction?.status === "SUCCEEDED" || transaction?.status === "COMPLETED" || transaction?.status === "Completed") && (
                  <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleDownloadReceipt(transaction)}>
                    <Icon name="ArrowDownToLine" size={18} className="text-brand-blue" />
                    <span className="text-sm text-brand-blue">Receipt</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {transactions?.length > 0 && transactions.length < total && (
          <div className="flex justify-center py-4">
            <Button onClick={loadMore} className="px-6 py-2">{loading ? 'Loading...' : 'Load more'}</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsHistory;
