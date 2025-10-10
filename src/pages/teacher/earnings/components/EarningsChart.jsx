import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import PeriodTabs from "./PeriodTab";
import { capitalize } from "../../../../utils/utils";

const EarningsChart = ({ data, selectedPeriod, onPeriodChange }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    })?.format(value);
  };

  const formatTooltip = (value, name) => {
    if (name === "earnings") {
      return [formatCurrency(value), "Earnings"];
    }
    return [value, name];
  };

  return (
    <section className="bg-card rounded-lg p-6 shadow-card border border-border mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0 mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          {capitalize(selectedPeriod)} Earnings Trend
        </h3>
        <PeriodTabs
          selectedPeriod={selectedPeriod}
          onPeriodChange={onPeriodChange}
        />
      </div>

      <div className="h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="period"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              tickFormatter={formatCurrency}
            />
            <Tooltip
              formatter={formatTooltip}
              contentStyle={{
                backgroundColor: "var(--color-popover)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Line
              type="monotone"
              dataKey="earnings"
              stroke="var(--color-primary)"
              strokeWidth={3}
              dot={{ fill: "var(--color-primary)", strokeWidth: 2, r: 4 }}
              activeDot={{
                r: 6,
                stroke: "var(--color-primary)",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default EarningsChart;
