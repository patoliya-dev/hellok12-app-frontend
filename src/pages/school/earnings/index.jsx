import { useState, useEffect } from "react";
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

  // Get current period data from mock data
  const currentData = mockEarningsData?.[selectedPeriod];

  // Get chart data for selected period
  const chartData = currentData?.chartData || [];

  // Filter earnings table data based on filters
  const getFilteredEarningsData = () => {
    let data = currentData?.tableData || [];

    // Apply lesson type filter
    if (filters.lessonType !== "all") {
      data = data.filter((item) => {
        if (filters.lessonType === "1-on-1") {
          return !item.description.includes("Group") && !item.description.includes("Workshop");
        } else if (filters.lessonType === "group") {
          return item.description.includes("Group") || item.description.includes("Workshop");
        }
        return true;
      });
    }

    // Apply payment status filter
    if (filters.paymentStatus !== "all") {
      data = data.filter((item) => item.status === filters.paymentStatus.toLowerCase());
    }

    // Apply amount range filter
    if (filters.amountRange !== "all") {
      data = data.filter((item) => {
        const [min, max] = filters.amountRange.split("-");
        if (max === "+") {
          return item.amount >= parseInt(min);
        } else {
          return item.amount >= parseInt(min) && item.amount <= parseInt(max);
        }
      });
    }

    // Apply date range filter
    if (filters.dateRange.startDate && filters.dateRange.endDate) {
      data = data.filter((item) => {
        const itemDate = new Date(item.date);
        const startDate = new Date(filters.dateRange.startDate);
        const endDate = new Date(filters.dateRange.endDate);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    return data;
  };

  // Filter invoice data based on date range
  const getFilteredInvoiceData = () => {
    let data = currentData?.invoiceData || [];

    // Apply date range filter
    if (filtersForInvoices.startDate && filtersForInvoices.endDate) {
      data = data.filter((item) => {
        const itemDate = new Date(item.date);
        const startDate = new Date(filtersForInvoices.startDate);
        const endDate = new Date(filtersForInvoices.endDate);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    return data;
  };

  const filteredEarningsData = getFilteredEarningsData();
  const filteredInvoiceData = getFilteredInvoiceData();

  // Pagination for earnings table
  const totalEarningsPages = Math.ceil(filteredEarningsData.length / itemsPerPage);
  const startEarningsIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEarningsData = filteredEarningsData.slice(
    startEarningsIndex,
    startEarningsIndex + itemsPerPage
  );

  // Pagination for invoice table
  const totalInvoicePages = Math.ceil(filteredInvoiceData.length / itemsPerPage);
  const startInvoiceIndex = (currentPageForInvoices - 1) * itemsPerPage;
  const paginatedInvoiceData = filteredInvoiceData.slice(
    startInvoiceIndex,
    startInvoiceIndex + itemsPerPage
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  useEffect(() => {
    setCurrentPageForInvoices(1);
  }, [filtersForInvoices]);

  const handleSelectedPeriodChange = (period) => {
    setSelectedPeriod(period);
    setCurrentPage(1);
    setCurrentPageForInvoices(1);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleFiltersChangeForInvoices = (newFilters) => {
    setFiltersForInvoices(newFilters);
  };

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
          data={chartData}
          selectedPeriod={selectedPeriod}
          onPeriodChange={handleSelectedPeriodChange}
          isLoading={false}
        />
        <section className="bg-card rounded-lg p-4 shadow-card border border-border mb-8">
          <FilterPanel
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
          <EarningsTable data={paginatedEarningsData} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalEarningsPages}
            totalItems={filteredEarningsData.length}
            onPageChange={handlePageChange}
            isBorderTop={false}
          />
        </section>
        <section className="bg-card rounded-lg shadow-card border border-border">
          <div className="px-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center pt-8 pb-2 gap-2 md:gap-0">
              <h2 className="text-lg font-semibold text-brand-gray-800">
                Earnings After Commission
              </h2>
              <DateRangePicker
                onChange={(values) => handleFiltersChangeForInvoices(values)}
              />
            </div>
            <InvoiceTable data={paginatedInvoiceData} isLoading={false} />
          </div>
          <Pagination
            currentPage={currentPageForInvoices}
            totalPages={totalInvoicePages}
            totalItems={filteredInvoiceData.length}
            onPageChange={handlePageChangeForInvoices}
          />
        </section>
      </main>
    </div>
  );
};

export default Earnings;
