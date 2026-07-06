"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#3b82f6", "#ef4444", "#8b5cf6"];

type FarmData = { name: string; revenue: number; costs: number; profit: number };
type OutletData = { name: string; value: number };

export function FarmRevenueChart({ data }: { data: FarmData[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
        <Tooltip formatter={(v: any) => [`$${Number(v).toLocaleString()}`, ""]} />
        <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey="revenue" name="Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
        <Bar dataKey="costs" name="Costs" fill="#f59e0b" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function OutletPieChart({ data }: { data: OutletData[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          dataKey="value"
          label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v: any) => `$${Number(v).toLocaleString()}`} />
      </PieChart>
    </ResponsiveContainer>
  );
}
