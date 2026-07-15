"use client";

import React from "react";

export function ExportCSVButton({ headers, rows, filename, label = "Export CSV" }: { headers: string[], rows: (string | number)[][], filename: string, label?: string }) {
  const handleExport = () => {
    const csvRows = rows.map(r => r.map(cell => {
      let val = String(cell ?? "");
      val = val.replace(/"/g, '""');
      return `"${val}"`;
    }));
    const csvContent = [headers.map(h => `"${h}"`).join(","), ...csvRows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <button className="client-btn btn-sm" onClick={handleExport}>
      {label}
    </button>
  );
}
