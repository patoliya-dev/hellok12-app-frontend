import React, { useState, useEffect } from "react";
import Icon from "../../../../components/AppIcon";
import { fetchEarningsSummary } from "../../../../services/earningsService";

const EarningsHeader = ({ selectedPeriod }) => {
  const [earningsData, setEarningsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEarningsData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchEarningsSummary();

        // Transform API response to component format
        const transformedData = [
          {
            period: "weekly",
            total: data.thisWeek.amount,
            percentageChange: data.thisWeek.percentageChange,
            comparisonPeriod: data.thisWeek.comparisonPeriod,
          },
          {
            period: "monthly",
            total: data.thisMonth.amount,
            percentageChange: data.thisMonth.percentageChange,
            comparisonPeriod: data.thisMonth.comparisonPeriod,
          },
          {
            period: "yearly",
            total: data.thisYear.amount,
            percentageChange: data.thisYear.percentageChange,
            comparisonPeriod: data.thisYear.comparisonPeriod,
          },
        ];

        setEarningsData(transformedData);
      } catch (err) {
        console.error("Failed to fetch earnings summary:", err);
        setError(err.message || "Failed to load earnings data");
      } finally {
        setLoading(false);
      }
    };

    loadEarningsData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    })?.format(amount);
  };

  const getPeriodLabel = (period) => {
    switch (period) {
      case "weekly":
        return "This Week";
      case "monthly":
        return "This Month";
      case "yearly":
        return "This Year";
      default:
        return "Total";
    }
  };

  if (loading) {
    return (
      <section className="bg-card rounded-lg p-6 shadow-card border border-border flex justify-center items-center mb-8 h-40">
        <div className="text-muted-foreground">Loading earnings data...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-card rounded-lg p-6 shadow-card border border-border flex justify-center items-center mb-8 h-40">
        <div className="text-error">Error: {error}</div>
      </section>
    );
  }

  return (
    <section className="bg-card rounded-lg p-6 shadow-card border border-border flex justify-around flex-wrap mb-8">
      {earningsData?.map((item, index) => (
        <div className="text-center" key={index}>
          <h2 className="text-lg font-medium text-muted-foreground mb-2">
            {getPeriodLabel(item?.period)} Earnings
          </h2>
          <div
            className={`text-h1 font-bold mb-4 ${selectedPeriod === item?.period
                ? "text-brand-blue"
                : "text-foreground"
              }`}
          >
            {formatCurrency(item?.total)}
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${item?.percentageChange >= 0
                  ? "bg-success/10 text-success"
                  : "bg-error/10 text-error"
                }`}
            >
              <Icon
                name={
                  item?.percentageChange >= 0 ? "TrendingUp" : "TrendingDown"
                }
                size={16}
              />
              <span>{Math.abs(item?.percentageChange)}%</span>
            </div>
            <span className="text-muted-foreground text-sm">
              {item?.comparisonPeriod}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
};

export default EarningsHeader;
