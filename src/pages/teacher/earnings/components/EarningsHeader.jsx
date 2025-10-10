import React from "react";
import Icon from "../../../../components/AppIcon";
import { mockEarningHeaderData } from "../data";

const EarningsHeader = ({ selectedPeriod }) => {
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

  return (
    <section className="bg-card rounded-lg p-6 shadow-card border border-border flex justify-around flex-wrap mb-8">
      {mockEarningHeaderData?.map((item, index) => (
        <div className="text-center" key={index}>
          <h2 className="text-lg font-medium text-muted-foreground mb-2">
            {getPeriodLabel(item?.period)} Earnings
          </h2>
          <div
            className={`text-h1 font-bold mb-4 ${
              selectedPeriod === item?.period
                ? "text-brand-blue"
                : "text-foreground"
            }`}
          >
            {formatCurrency(item?.total)}
          </div>
          <div className="flex items-center justify-center space-x-2">
            <div
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${
                item?.percentageChange >= 0
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
              vs previous {item?.period?.replace("ly", "")}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
};

export default EarningsHeader;
