"use client";

import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { formatPnL, formatDateTime } from "@thirdleaf/utils";

// Minimal Sparkline SVG component rendering intra-day variation proxies
const Sparkline = ({ values }: { values: number[] }) => {
  if (!values.length) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const scaleY = (v: number) => 15 - ((v - min) / ((max - min) || 1)) * 15;
  const points = values.map((v, i) => `${i * (60 / Math.max(1, values.length - 1))},${scaleY(v)}`).join(" ");
  const isPositive = values[values.length - 1] > values[0];
  
  return (
    <svg width="60" height="20" className="overflow-visible inline-block ml-2">
      <polyline
        points={points}
        fill="none"
        stroke={isPositive ? "#10b981" : "#ef4444"}
        strokeWidth="1.5"
      />
    </svg>
  );
};

export const TradeTable = ({ data, onRowClick }: { data: any[]; onRowClick: (trade: any) => void }) => {
  const [rowSelection, setRowSelection] = useState({});

  const columns: ColumnDef<any>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <input 
          type="checkbox" 
          onChange={table.getToggleAllRowsSelectedHandler()}
          checked={table.getIsAllRowsSelected()}
          className="rounded border-zinc-700 bg-zinc-900"
        />
      ),
      cell: ({ row }) => (
        <input 
          type="checkbox" 
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          onClick={(e) => e.stopPropagation()}
          className="rounded border-zinc-700 bg-zinc-900"
        />
      ),
      size: 40,
    },
    {
      accessorKey: "entryTime",
      header: "Date",
      cell: (info) => (
        <span className="whitespace-nowrap font-medium">{formatDateTime(info.getValue() as string)}</span>
      ),
    },
    {
      accessorKey: "symbol",
      header: "Symbol",
      cell: (info) => <div className="font-semibold text-white">{info.getValue() as string}</div>,
    },
    {
      accessorKey: "direction",
      header: "Dir",
      cell: (info) => {
        const val = info.getValue() as string;
        return (
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${val === "LONG" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
            {val}
          </span>
        );
      },
    },
    {
      accessorKey: "tags",
      header: "Setup Tags",
      cell: () => <span className="text-zinc-400 text-xs truncate max-w-[100px] block">Tags...</span>,
    },
    {
      accessorKey: "netPnl",
      header: "Net P&L",
      cell: (info) => {
        const pnl = info.getValue() as number | null;
        if (!pnl) return "-";
        const { formatted, colorClass } = formatPnL(pnl);
        const color = colorClass === "success" ? "text-emerald-400" : colorClass === "danger" ? "text-red-400" : "text-zinc-400";
        // Dummy values array for the SVG sparkline based strictly off PnL trajectory proxy
        const dummyPath = pnl > 0 ? [0, pnl * 0.2, pnl * 0.8, pnl] : [0, pnl * 0.3, pnl * 0.5, pnl];
        
        return (
          <div className="flex items-center">
            <span className={`tabular-nums ${color}`}>{formatted}</span>
            <Sparkline values={dummyPath} />
          </div>
        );
      },
    },
    {
      accessorKey: "rMultipleActual",
      header: "R-Mult",
      cell: (info) => {
        const r = info.getValue() as number;
        return <span className="tabular-nums opacity-80">{r ? `${r}R` : "-"}</span>;
      }
    }
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full relative overflow-x-auto border border-white/5 rounded-xl bg-black scrollbar-hide">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50 sticky top-0 z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header, idx) => (
                <th key={header.id} className={`px-4 py-3 ${idx === 1 ? 'sticky left-0 bg-zinc-900 border-r border-white/5' : ''}`}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            const pnl = row.original?.netPnl || 0;
            const bgHover = pnl > 0 ? "hover:bg-emerald-900/10" : pnl < 0 ? "hover:bg-red-900/10" : "hover:bg-zinc-800/40";
            return (
              <tr 
                key={row.id} 
                onClick={() => onRowClick(row.original)}
                className={`border-b border-white/5 cursor-pointer transition-colors ${bgHover}`}
              >
                {row.getVisibleCells().map((cell, idx) => (
                  <td key={cell.id} className={`px-4 py-3 ${idx === 1 ? 'sticky left-0 bg-black group-hover:bg-zinc-900 border-r border-white/5 z-0' : ''}`}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
