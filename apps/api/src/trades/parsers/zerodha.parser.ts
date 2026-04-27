import { parse } from "csv-parse/sync";

export interface ParsedCsvRow {
  symbol: string;
  trade_date: string; // ISO or local
  trade_type: "buy" | "sell";
  quantity: number;
  price: number;
  order_execution_time: string;
}

export class ZerodhaParser {
  /**
   * Zerodha Tradebook mapping.
   * Expected CSV headers from Zerodha console:
   * symbol, trade_date, exchange, segment, trade_type, quantity, price, order_id, order_execution_time
   */
  static parse(csvBuffer: Buffer): ParsedCsvRow[] {
    const rawData = parse(csvBuffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    return rawData.map((row: any) => ({
      symbol: row["symbol"],
      trade_date: row["trade_date"],
      trade_type: row["trade_type"].toLowerCase() as "buy" | "sell",
      quantity: parseInt(row["quantity"], 10),
      price: parseFloat(row["price"]),
      order_execution_time: row["order_execution_time"],
    }));
  }
}
