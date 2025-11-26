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
import {
  fetchEarningsTrend,
  fetchEarningsList,
} from "../../../services/earningsService";

const Earnings = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("weekly");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageForInvoices, setCurrentPageForInvoices] = useState(1);
  const [chartData, setChartData] = useState([]);
  const [isLoadingChart, setIsLoadingChart] = useState(false);
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
  // State for earnings data from API
  const [earningsData, setEarningsData] = useState([]);
  const [isLoadingEarnings, setIsLoadingEarnings] = useState(false);
  const [earningsPagination, setEarningsPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  // Fetch earnings trend data when period changes
  useEffect(() => {
    const loadTrendData = async () => {
      setIsLoadingChart(true);
      try {
        const data = await fetchEarningsTrend(selectedPeriod);
        // Transform API response to match chart format
        const transformedData = data.dataPoints.map((point) => ({
          period: point.label,
          earnings: point.amount,
        }));
        setChartData(transformedData);
      } catch (error) {
        console.error("Failed to fetch earnings trend:", error);
        // Fallback to mock data on error
        setChartData(mockEarningsData?.[selectedPeriod]?.chartData || []);
      } finally {
        setIsLoadingChart(false);
      }
    };

    loadTrendData();
  }, [selectedPeriod]);

  // Fetch earnings list data when filters or page changes
  useEffect(() => {
    const loadEarningsData = async () => {
      setIsLoadingEarnings(true);
      try {
        // Build query params from filters
        const queryParams = {
          page: currentPage,
          limit: itemsPerPage,
        };

        // Add lesson type filter
        if (filters.lessonType !== "all") {
          queryParams.lessonType = filters.lessonType;
        }

        // Add payment status filter
        if (filters.paymentStatus !== "all") {
          queryParams.status = filters.paymentStatus.toUpperCase();
        }

        // Add amount range filter
        if (filters.amountRange !== "all") {
          const [min, max] = filters.amountRange.split("-");
          if (max === "+") {
            queryParams.minAmount = parseInt(min);
          } else {
            queryParams.minAmount = parseInt(min);
            queryParams.maxAmount = parseInt(max);
          }
        }

        // Add date range filter
        if (filters.dateRange.startDate && filters.dateRange.endDate) {
          queryParams.startDate = filters.dateRange.startDate;
          queryParams.endDate = filters.dateRange.endDate;
        }

        const response = await fetchEarningsList(queryParams);

        // Transform API response to match component format
        const transformedData = response.data.map((item) => ({
          date: item.date,
          description: item.lessonService,
          amount: item.amount,
          status: item.status.toLowerCase(),
          lessonType: item.lessonType,
        }));

        setEarningsData(transformedData);
        setEarningsPagination(response.pagination);
      } catch (error) {
        console.error("Failed to fetch earnings list:", error);
        // Fallback to empty array on error
        setEarningsData([]);
        setEarningsPagination({
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 1,
        });
      } finally {
        setIsLoadingEarnings(false);
      }
    };

    loadEarningsData();
  }, [filters, currentPage]);

  const handleSelectedPeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleFiltersChangeForInvoices = (newFilters) => {
    setFiltersForInvoices(newFilters);
  };

  const currentData = mockEarningsData?.[selectedPeriod];

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
          data={chartData}
          selectedPeriod={selectedPeriod}
          onPeriodChange={handleSelectedPeriodChange}
          isLoading={isLoadingChart}
        />
        <section className="bg-card rounded-lg p-4 shadow-card border border-border mb-8">
          <FilterPanel
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
          <EarningsTable data={earningsData} />
          <Pagination
            currentPage={earningsPagination.page}
            totalPages={earningsPagination.totalPages}
            totalItems={earningsPagination.total}
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
