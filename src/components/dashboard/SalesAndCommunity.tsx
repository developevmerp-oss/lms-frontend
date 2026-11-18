"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, Tooltip, XAxis } from "recharts";

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

  const chartData = activeSales.reduce((acc: MonthlySalesPoint[], s: SalesRecord) => {
    const month = s.date
      ? new Date(s.date).toLocaleString("default", { month: "short" })
      : "Now";
    const existing = acc.find((e) => e.month === month);
    if (existing) {
      existing.sales += s.amount;
    } else {
      acc.push({ month, sales: s.amount });
    }
    return acc;
  }, []);

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

      {/* Content: Empty state matching Portfolio Projects when no sales, dynamic chart when sales exist */}
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
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSalesOrange" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e86034" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#e86034" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#ecdccb",
                    borderRadius: "12px",
                    fontSize: "11px",
                  }}
                  itemStyle={{ color: "#c4431d", fontWeight: "bold" }}
                  formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Sales"]}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#e86034"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSalesOrange)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </motion.div>
  );
};
