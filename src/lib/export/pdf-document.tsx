import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ExportDocumentData } from "./build-doc-data";

const styles = StyleSheet.create({
  page: { padding: 36, fontSize: 9, fontFamily: "Helvetica" },
  header: { marginBottom: 12, textAlign: "center" },
  companyName: { fontSize: 16, fontWeight: "bold", marginBottom: 2 },
  title: { fontSize: 13, fontWeight: "bold", marginBottom: 4 },
  duration: { fontSize: 11, marginBottom: 2 },
  address: { fontSize: 9, color: "#333" },
  metaRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8, marginBottom: 10, fontSize: 9 },
  table: { marginTop: 8, marginBottom: 10, border: "1 solid #ccc" },
  tableRow: { flexDirection: "row", borderBottom: "1 solid #ddd" },
  tableHeader: { backgroundColor: "#ffe599", fontWeight: "bold" },
  tableCell: { flex: 1, padding: 4, fontSize: 8 },
  tableCellWide: { flex: 1.5, padding: 4, fontSize: 8 },
  sectionTitle: { fontSize: 10, fontWeight: "bold", marginTop: 10, marginBottom: 4 },
  listItem: { marginBottom: 2, paddingLeft: 6, fontSize: 8 },
  footer: { marginTop: 16, fontSize: 8, textAlign: "center", color: "#444" },
});

function SummaryTable({ data }: { data: ExportDocumentData }) {
  return (
    <View style={styles.table}>
      <View style={[styles.tableRow, styles.tableHeader]}>
        <Text style={styles.tableCell}>QTY</Text>
        <Text style={styles.tableCellWide}>TRANSPORTATION</Text>
        <Text style={styles.tableCell}>ROOMS</Text>
        <Text style={styles.tableCellWide}>DESCRIPTION</Text>
        <Text style={styles.tableCell}>PER PERSON ({data.currencyCode})</Text>
        <Text style={styles.tableCell}>TOTAL ({data.currencyCode})</Text>
      </View>
      <View style={styles.tableRow}>
        <Text style={styles.tableCell}>{String(data.roomsQty)}</Text>
        <Text style={styles.tableCellWide}>{data.transportDescription || "—"}</Text>
        <Text style={styles.tableCell}>{data.roomsDescription || String(data.roomsQty)}</Text>
        <Text style={styles.tableCellWide}>{data.packageDescription || "—"}</Text>
        <Text style={styles.tableCell}>{data.formattedPrice}</Text>
        <Text style={styles.tableCell}>{data.formattedTotalPrice}</Text>
      </View>
    </View>
  );
}

function TourPlanTable({ rows }: { rows: ExportDocumentData["tourPlanRows"] }) {
  if (rows.length === 0) return null;
  return (
    <View>
      <Text style={styles.sectionTitle}>TOUR PLAN</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>DAY</Text>
          <Text style={styles.tableCell}>FROM</Text>
          <Text style={styles.tableCell}>TO</Text>
          <Text style={styles.tableCellWide}>HOTEL NAME</Text>
          <Text style={styles.tableCell}>STAY LOCATION</Text>
          <Text style={styles.tableCell}>ROOM CATEGORY</Text>
        </View>
        {rows.slice(0, 4).map((row, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.tableCell}>{row.dayLabel}</Text>
            <Text style={styles.tableCell}>{row.from}</Text>
            <Text style={styles.tableCell}>{row.to}</Text>
            <Text style={styles.tableCellWide}>{row.hotelName}</Text>
            <Text style={styles.tableCell}>{row.stayLocation}</Text>
            <Text style={styles.tableCell}>{row.roomCategory}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function ListSection({ title, items }: { title: string; items: string[] }) {
  const active = items.filter(Boolean);
  if (active.length === 0) return null;
  return (
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      {active.map((item, i) => (
        <Text key={i} style={styles.listItem}>• {item}</Text>
      ))}
    </View>
  );
}

export function QuotationPdfDocument({ data }: { data: ExportDocumentData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.companyName}>{data.companyName}</Text>
          <Text style={styles.duration}>{data.durationLabel}</Text>
          <Text style={styles.title}>{data.title}</Text>
          {data.companyAddress ? <Text style={styles.address}>{data.companyAddress}</Text> : null}
        </View>

        <View style={styles.metaRow}>
          <Text>Date: {data.quotationDate}</Text>
          <Text>{data.companyPhone}</Text>
          <Text>Expiration: {data.expirationDate}</Text>
        </View>

        <SummaryTable data={data} />
        <TourPlanTable rows={data.tourPlanRows} />
        <ListSection title="Entry Tickets Included:" items={data.inclusions} />
        <ListSection title="Exclusions:" items={data.exclusions} />

        <View style={styles.footer}>
          <Text>
            Please feel free to reach out to us at {data.companyEmail} or {data.companyPhone} should you need further details.
          </Text>
          <Text style={{ marginTop: 6, fontWeight: "bold" }}>THANK YOU FOR YOUR BUSINESS</Text>
          <Text>{data.companyWebsite}</Text>
        </View>
      </Page>
    </Document>
  );
}
