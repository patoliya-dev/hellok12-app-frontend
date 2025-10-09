import { useState } from "react";
import PageHeader from "components/ui/PageHeader";
import RoleBasedHeader from "components/ui/RoleBasedHeader";
import EarningsHeader from "./components/EarningsHeader";
import { itemsPerPage, mockEarningsData } from "./data";
import EarningsChart from "./components/EarningsChart";
import FilterPanel from "./components/FilterPanel";
import EarningsTable from "./components/EarningsTable";
import Pagination from "components/ui/Pagination";
import InvoiceTable from "./components/InvoiceTable";
import DateRangePicker from "components/ui/DateRangePicker";

const Earnings = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("weekly");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageForInvoices, setCurrentPageForInvoices] = useState(1);
  const [filters, setFilters] = useState({
    lessonType: "all",
    paymentStatus: "all",
    amountRange: "all",
    dateRange: {
      startDate: "",
      endDate: "",
    },
  });
  const [filtersForInvoices, setFiltersForInvoices] = useState({
    startDate: "",
    endDate: "",
  });

  const handleSelectedPeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleFiltersChangeForInvoices = (newFilters) => {
    setFiltersForInvoices(newFilters);
  };

  const currentData = mockEarningsData?.[selectedPeriod];

  // Filter table data based on active filters
  const filteredTableData = currentData?.tableData?.filter((item) => {
    if (filters?.lessonType !== "all") {
      const lessonType = item?.description?.toLowerCase();
      if (
        filters?.lessonType === "individual" &&
        !lessonType?.includes("individual")
      )
        return false;
      if (filters?.lessonType === "group" && !lessonType?.includes("group"))
        return false;
      if (
        filters?.lessonType === "workshop" &&
        !lessonType?.includes("workshop")
      )
        return false;
      if (
        filters?.lessonType === "assessment" &&
        !lessonType?.includes("assessment")
      )
        return false;
    }

    if (filters?.paymentStatus !== "all") {
      const status = item?.status;
      if (filters?.paymentStatus === "completed" && status !== "completed")
        return false;
      if (filters?.paymentStatus === "pending" && status !== "pending")
        return false;
      if (filters?.paymentStatus === "processing" && status !== "processing")
        return false;
    }

    if (filters?.amountRange !== "all") {
      const amount = item?.amount;
      if (filters?.amountRange === "0-50" && (amount < 0 || amount > 50))
        return false;
      if (filters?.amountRange === "50-100" && (amount < 50 || amount > 100))
        return false;
      if (filters?.amountRange === "100-200" && (amount < 100 || amount > 200))
        return false;
      if (filters?.amountRange === "200+" && amount < 200) return false;
    }

    if (
      filters?.dateRange?.startDate !== "" &&
      filters?.dateRange?.endDate !== ""
    ) {
      const date = new Date(item?.date);
      const startDate = new Date(filters?.dateRange?.startDate);
      const endDate = new Date(filters?.dateRange?.endDate);
      if (date < startDate || date > endDate) return false;
    }

    return true;
  });

  // Pagination for earnings
  const totalPages = Math.ceil(filteredTableData?.length / itemsPerPage);
  const paginatedData = filteredTableData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Filter invoice data based on active filters
  const filteredInvoiceData = currentData?.invoiceData?.filter((item) => {
    if (
      filtersForInvoices?.startDate !== "" &&
      filtersForInvoices?.endDate !== ""
    ) {
      const date = new Date(item?.date);
      const startDate = new Date(filtersForInvoices?.startDate);
      const endDate = new Date(filtersForInvoices?.endDate);
      if (date < startDate || date > endDate) return false;
    }

    return true;
  });

  // Pagination for invoices
  const totalPagesForInvoices = Math.ceil(
    filteredInvoiceData?.length / itemsPerPage
  );
  const paginatedDataForInvoices = filteredInvoiceData?.slice(
    (currentPageForInvoices - 1) * itemsPerPage,
    currentPageForInvoices * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageChangeForInvoices = (page) => {
    setCurrentPageForInvoices(page);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <RoleBasedHeader />
      <main className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pb-8">
        <PageHeader
          title="Earnings Tracking"
          description="Monitor your teaching income and financial performance"
        />
        <EarningsHeader selectedPeriod={selectedPeriod} />
        <EarningsChart
          data={currentData?.chartData}
          selectedPeriod={selectedPeriod}
          onPeriodChange={handleSelectedPeriodChange}
        />
        <section className="bg-card rounded-lg p-4 shadow-card border border-border mb-8">
          <FilterPanel
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
          <EarningsTable data={paginatedData} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredTableData?.length}
            onPageChange={handlePageChange}
            isBorderTop={false}
          />
        </section>
        <section className="bg-card rounded-lg shadow-card border border-border">
          <div className="px-6">
            <div className="flex justify-between items-center pt-8 pb-2">
              <h2 className="text-lg font-semibold text-brand-gray-800">
                Earnings After Commission
              </h2>
              <DateRangePicker
                onChange={(values) => handleFiltersChangeForInvoices(values)}
              />
            </div>
            <InvoiceTable data={paginatedDataForInvoices} />
          </div>
          <Pagination
            currentPage={currentPageForInvoices}
            totalPages={totalPagesForInvoices}
            totalItems={filteredInvoiceData?.length}
            onPageChange={handlePageChangeForInvoices}
          />
        </section>
      </main>
    </div>
  );
};

export default Earnings;
