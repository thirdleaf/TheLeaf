import React from "react";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import { format } from "date-fns";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", backgroundColor: "#fff" },
  header: { marginBottom: 20, borderBottom: 1, paddingBottom: 10 },
  title: { fontSize: 24, fontWeight: "bold", color: "#1a1a1a" },
  subTitle: { fontSize: 14, color: "#666", marginTop: 4 },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 14, fontWeight: "bold", marginBottom: 10, color: "#2d3748" },
  table: { width: "100%", marginTop: 10 },
  tableRow: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: "#e2e8f0", paddingVertical: 6, alignItems: "center" },
  tableHeader: { fontWeight: "bold", backgroundColor: "#f7fafc" },
  tableCol: { flex: 1, paddingRight: 4 },
  tableColLarge: { flex: 2, paddingRight: 4 },
  pnlPositive: { color: "#2f855a" },
  pnlNegative: { color: "#c53030" },
  footer: { position: "absolute", bottom: 40, left: 40, right: 40, fontSize: 8, color: "#a0aec0", textAlign: "center", borderTopWidth: 0.5, borderTopColor: "#e2e8f0", paddingTop: 10 },
  disclaimer: { marginTop: 20, fontSize: 9, color: "#718096", fontStyle: "italic" }
});

interface TradeReportProps {
  userName: string;
  fy: string;
  trades: any[];
  summary: any;
}

export const TradeWiseTaxReport = ({ userName, fy, trades, summary }: TradeReportProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Cover Section */}
      <View style={styles.header}>
        <Text style={styles.title}>TRADE-WISE TAX REPORT</Text>
        <Text style={styles.subTitle}>TradeForge Tax Analysis | Financial Year {fy}</Text>
        <Text style={{ marginTop: 10 }}>Generated for: {userName}</Text>
        <Text>Date: {format(new Date(), "PPpp")}</Text>
      </View>

      {/* Summary Table */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financial Summary</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCol}>Category</Text>
            <Text style={styles.tableCol}>Turnover</Text>
            <Text style={styles.tableCol}>Realized P&L</Text>
            <Text style={styles.tableCol}>Est. Tax</Text>
          </View>
          {Object.entries(summary.equity || {}).map(([key, val]: any) => (
            <View key={key} style={styles.tableRow}>
              <Text style={styles.tableCol}>Equity {key}</Text>
              <Text style={styles.tableCol}>₹{(val.turnover / 100).toLocaleString()}</Text>
              <Text style={styles.tableCol}>₹{(val.netPnl / 100).toLocaleString()}</Text>
              <Text style={styles.tableCol}>₹{(val.estimatedTax / 100).toLocaleString()}</Text>
            </View>
          ))}
          <View style={styles.tableRow}>
            <Text style={styles.tableCol}>F&O Total</Text>
            <Text style={styles.tableCol}>₹{(summary.totals.turnover / 100).toLocaleString()}</Text>
            <Text style={styles.tableCol}>₹{(summary.totals.netPnl / 100).toLocaleString()}</Text>
            <Text style={styles.tableCol}>Business Income</Text>
          </View>
        </View>
      </View>

      <Text style={styles.disclaimer}>
        TradeForge provides tax estimates for reference only. Actual tax liability may vary. 
        Consult a qualified Chartered Accountant for filing.
      </Text>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>© 2026 TradeForge. Built for Indian Traders.</Text>
      </View>
    </Page>

    {/* Detail Table Page */}
    <Page size="A4" orientation="landscape" style={styles.page}>
      <Text style={styles.sectionTitle}>Trade-Wise Breakdown</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableColLarge}>Symbol</Text>
          <Text style={styles.tableCol}>Entry Date</Text>
          <Text style={styles.tableCol}>Exit Date</Text>
          <Text style={styles.tableCol}>Qty</Text>
          <Text style={styles.tableCol}>Realized P&L</Text>
          <Text style={styles.tableCol}>Category</Text>
        </View>
        {trades.map((t, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.tableColLarge}>{t.symbol}</Text>
            <Text style={styles.tableCol}>{format(new Date(t.entryTime), "dd MMM yy")}</Text>
            <Text style={styles.tableCol}>{format(new Date(t.exitTime), "dd MMM yy")}</Text>
            <Text style={styles.tableCol}>{t.quantity}</Text>
            <Text style={[styles.tableCol, t.grossPnl >= 0 ? styles.pnlPositive : styles.pnlNegative]}>
              ₹{(t.grossPnl / 100).toLocaleString()}
            </Text>
            <Text style={styles.tableCol}>{t.taxCategory || "Uncategorized"}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);
