"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, Tooltip, XAxis } from "recharts";

interface SalesRecord {
  id?: string;
  amount: number;
  productName?: string;
  date?: string;
}

interface MonthlySalesPoint {
  month: string;
  sales: number;
}

interface SalesAndCommunityProps {
  sales?: SalesRecord[];
  communityWins?: unknown[];
  onInteract?: () => void;
}

export const SalesAndCommunity = ({ sales }: SalesAndCommunityProps) => {
  const activeSales = sales || [];

  // Generate a continuous rolling window of 6 months ending at current/latest month
  const chartData = React.useMemo(() => {
    if (activeSales.length === 0) return [];

    const now = new Date();
    let latestDate = now;

    const salesByMonthYear: Record<string, number> = {};

    activeSales.forEach((s) => {
      let d = s.date ? new Date(s.date) : now;
      if (isNaN(d.getTime())) d = now;
      if (d > latestDate) latestDate = d;

      const mKey = `${d.getFullYear()}-${d.getMonth()}`;
      const amt = Number(s.amount) || 0;
      salesByMonthYear[mKey] = (salesByMonthYear[mKey] || 0) + amt;
    });

    const points: MonthlySalesPoint[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(latestDate.getFullYear(), latestDate.getMonth() - i, 1);
      const mKey = `${d.getFullYear()}-${d.getMonth()}`;
      const mName = d.toLocaleString("default", { month: "short" });
      points.push({
        month: mName,
        sales: salesByMonthYear[mKey] || 0,
      });
    }

    return points;
  }, [activeSales]);

  const totalRevenue = activeSales.reduce(
    (sum, s) => sum + (Number(s.amount) || 0),
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white/95 border border-[#ecdccb] p-5 sm:p-6 rounded-3xl h-full shadow-[0_10px_30px_-12px_rgba(90,55,20,0.08)] flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#fff2ea] flex items-center justify-center text-[#e86034] shrink-0">
            <TrendingUp size={16} />
          </div>
          <h2 className="text-sm sm:text-base font-bold text-stone-900">Sales & Income</h2>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[9px] uppercase tracking-wider text-stone-400 font-semibold block">
            TOTAL REVENUE
          </span>
          <span className="text-sm sm:text-base font-black text-stone-900 leading-tight">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Content: Empty state matching Portfolio Projects when no sales, dynamic bar chart when sales exist */}
      <div className="flex-1 flex flex-col justify-center py-2 sm:py-3">
        {totalRevenue === 0 || chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center">
            <TrendingUp size={34} className="text-[#e86034] mb-2" />
            <p className="text-stone-600 text-xs font-medium">No sales recorded yet.</p>
            <p className="text-stone-400 text-[11px] mt-0.5">
              Complete your first sale to see your revenue chart!
            </p>
          </div>
        ) : (
          <div className="h-24 sm:h-28 w-full pt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 6, left: 6, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e86034" />
                    <stop offset="100%" stopColor="#c4431d" />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#a8a29e", fontWeight: 500 }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(232, 96, 52, 0.06)", radius: 6 }}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#ecdccb",
                    borderRadius: "12px",
                    boxShadow: "0 6px 18px -2px rgba(90, 55, 20, 0.1)",
                    fontSize: "11px",
                    padding: "6px 10px",
                  }}
                  labelStyle={{ color: "#78716c", fontWeight: 600, marginBottom: "2px" }}
                  itemStyle={{ color: "#c4431d", fontWeight: "bold" }}
                  formatter={(value) => [`₹${Number(value || 0).toLocaleString("en-IN")}`, "Sales"]}
                />
                <Bar
                  dataKey="sales"
                  fill="url(#salesBarGradient)"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={28}
                  minPointSize={3}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </motion.div>
  );
};
