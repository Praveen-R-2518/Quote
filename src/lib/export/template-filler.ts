import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import type { ExportDocumentData } from "./build-doc-data";

/** Original Pumpkin Tours template — never modify structure, styles, logo, or fixed labels. */
const TEMPLATE_PATH = path.join(process.cwd(), "templates", "quotation-template-source.docx");

type ParagraphMatch = { xml: string; index: number };

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Replace text in an existing w:t node by global index — never adds or removes nodes. */
function setTextAtIndex(xml: string, index: number, value: string): string {
  const regex = /<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g;
  let i = 0;
  return xml.replace(regex, (match) => {
    if (i === index) {
      i++;
      const preserve = match.includes('xml:space="preserve"');
      const escaped = escapeXml(value);
      return preserve
        ? `<w:t xml:space="preserve">${escaped}</w:t>`
        : `<w:t>${escaped}</w:t>`;
    }
    i++;
    return match;
  });
}

function splitDate(dateStr: string): [string, string, string] {
  const parts = dateStr.split(".");
  if (parts.length >= 3) {
    const year = parts[2];
    return [`${parts[0]}.${parts[1]}`, `.${year.slice(0, 3)}`, year.slice(3) || year.slice(-1)];
  }
  return [dateStr, "", ""];
}

function findParagraphs(xml: string): ParagraphMatch[] {
  const results: ParagraphMatch[] = [];
  const regex = /<w:p[\s>][\s\S]*?<\/w:p>/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(xml)) !== null) {
    results.push({ xml: match[0], index: match.index });
  }
  return results;
}

function isListParagraph(paraXml: string): boolean {
  return paraXml.includes('w:val="ListParagraph"') || paraXml.includes("<w:numPr>");
}

function setParagraphText(paraXml: string, text: string): string {
  let first = true;
  return paraXml.replace(/<w:t([^>]*)>[^<]*<\/w:t>/g, (_match, attrs: string) => {
    if (first) {
      first = false;
      return `<w:t${attrs}>${escapeXml(text)}</w:t>`;
    }
    return `<w:t${attrs}></w:t>`;
  });
}

/** Blank paragraph with extra vertical spacing (twips) for section gaps in the export. */
function createSpacerParagraph(templateParaXml: string, spacingTwips = 360): string {
  const spacing = `<w:spacing w:before="${spacingTwips}" w:after="${Math.round(spacingTwips / 3)}"/>`;
  const withoutRuns = templateParaXml.replace(/<w:r[\s\S]*?<\/w:r>/g, "");
  if (withoutRuns.includes("<w:pPr>")) {
    return withoutRuns.replace(/<w:pPr>([\s\S]*?)<\/w:pPr>/, (_m, inner: string) => {
      const cleaned = inner.replace(/<w:spacing[^/]*\/>/g, "");
      return `<w:pPr>${cleaned}${spacing}</w:pPr>`;
    });
  }
  return withoutRuns.replace(/<w:p([^>]*)>/, `<w:p$1><w:pPr>${spacing}</w:pPr>`);
}

/** Sample duration "3N 4D" split across w:t indices 12–15 and 18–21. */
function fillDuration(xml: string, nights: number, days: number): string {
  let result = xml;
  for (const idx of [12, 18]) result = setTextAtIndex(result, idx, String(nights));
  for (const idx of [14, 20]) result = setTextAtIndex(result, idx, String(days));
  return result;
}

/** Sample quotation / expiration dates at indices 39–41 and 49–51. */
function fillDates(xml: string, quotationDate: string, expirationDate: string): string {
  let result = xml;
  const [q1, q2, q3] = splitDate(quotationDate);
  const [e1, e2, e3] = splitDate(expirationDate);
  result = setTextAtIndex(result, 39, q1);
  result = setTextAtIndex(result, 40, q2);
  result = setTextAtIndex(result, 41, q3);
  result = setTextAtIndex(result, 49, e1);
  result = setTextAtIndex(result, 50, e2);
  result = setTextAtIndex(result, 51, e3);
  return result;
}

/** Tour plan table layout in the official template (see scripts/inspect-tour-table.mjs). */
const TOUR_PLAN_FIRST_DATA_ROW = 5;
const TOUR_PLAN_DATA_ROW_STEP = 3;
const TOUR_PLAN_MIDDLE_BLOCK_START = 6;
const TOUR_PLAN_MIDDLE_BLOCK_END = 9;
const TOUR_PLAN_LAST_BLOCK_START = 12;
const TOUR_PLAN_TEMPLATE_DATA_ROWS = 4;

type TourPlanRowData = ExportDocumentData["tourPlanRows"][number];

function setRowTexts(rowXml: string, values: string[]): string {
  let vi = 0;
  return rowXml.replace(/<w:t([^>]*)>[^<]*<\/w:t>/g, (_match, attrs: string) => {
    if (vi >= values.length) {
      return `<w:t${attrs}></w:t>`;
    }
    const val = escapeXml(values[vi] ?? "");
    vi++;
    return `<w:t${attrs}>${val}</w:t>`;
  });
}

function clearRowTexts(rowXml: string): string {
  return rowXml.replace(/<w:t([^>]*)>[^<]*<\/w:t>/g, (_match, attrs: string) => `<w:t${attrs}></w:t>`);
}

function findTourPlanTable(xml: string): string | null {
  const tables = xml.match(/<w:tbl>[\s\S]*?<\/w:tbl>/g);
  if (!tables) return null;
  return (
    tables.find((t) => t.includes("DAY") && t.includes("FROM") && t.includes("HOTEL NAME")) ?? null
  );
}

function splitTableParts(tableXml: string): { prefix: string; rows: string[] } {
  const firstTr = tableXml.indexOf("<w:tr");
  if (firstTr === -1) return { prefix: tableXml, rows: [] };
  const prefix = tableXml.slice(0, firstTr);
  const rowParts = tableXml.slice(firstTr).split("<w:tr").slice(1);
  const rows = rowParts.map((r, i) =>
    i === rowParts.length - 1 ? r.replace(/<\/w:tbl>\s*$/, "") : r
  );
  return { prefix, rows };
}

function joinTableRows(prefix: string, rows: string[]): string {
  return `${prefix}${rows.map((r) => "<w:tr" + r).join("")}</w:tbl>`;
}

function expandTourPlanTableRows(rows: string[], neededDataRows: number): string[] {
  if (neededDataRows <= TOUR_PLAN_TEMPLATE_DATA_ROWS) return [...rows];
  const extraBlocks = neededDataRows - TOUR_PLAN_TEMPLATE_DATA_ROWS;
  const middleBlock = rows.slice(TOUR_PLAN_MIDDLE_BLOCK_START, TOUR_PLAN_MIDDLE_BLOCK_END);
  const before = rows.slice(0, TOUR_PLAN_LAST_BLOCK_START);
  const lastBlock = rows.slice(TOUR_PLAN_LAST_BLOCK_START);
  const insertions = Array.from({ length: extraBlocks }, () => [...middleBlock]).flat();
  return [...before, ...insertions, ...lastBlock];
}

function tourPlanDataRowIndex(dayIndex: number): number {
  return TOUR_PLAN_FIRST_DATA_ROW + dayIndex * TOUR_PLAN_DATA_ROW_STEP;
}

function valuesForTourPlanRow(row: TourPlanRowData, isLastDay: boolean): string[] {
  if (isLastDay) {
    return [row.dayLabel, row.from, row.to, row.hotelName];
  }
  return [row.dayLabel, row.from, row.to, row.hotelName, row.stayLocation, row.roomCategory];
}

function fillTourPlanTable(tableXml: string, tourPlanRows: TourPlanRowData[]): string {
  const { prefix, rows: templateRows } = splitTableParts(tableXml);
  let rows = expandTourPlanTableRows(templateRows, tourPlanRows.length);

  for (let d = 0; d < tourPlanRows.length; d++) {
    const idx = tourPlanDataRowIndex(d);
    const isLast = d === tourPlanRows.length - 1;
    rows[idx] = setRowTexts(rows[idx]!, valuesForTourPlanRow(tourPlanRows[d]!, isLast));
  }

  if (tourPlanRows.length < TOUR_PLAN_TEMPLATE_DATA_ROWS) {
    for (let d = tourPlanRows.length; d < TOUR_PLAN_TEMPLATE_DATA_ROWS; d++) {
      const idx = tourPlanDataRowIndex(d);
      if (rows[idx]) rows[idx] = clearRowTexts(rows[idx]!);
    }
  }

  return joinTableRows(prefix, rows);
}

/** Fallback when the tour plan table cannot be located in document.xml. */
const TOUR_PLAN_ROW_STARTS = [66, 72, 78, 84] as const;
const TOUR_PLAN_FIELD_COUNTS = [6, 6, 6, 4] as const;
const TOUR_PLAN_FIELDS = [
  ["dayLabel", "from", "to", "hotelName", "stayLocation", "roomCategory"],
  ["dayLabel", "from", "to", "hotelName", "stayLocation", "roomCategory"],
  ["dayLabel", "from", "to", "hotelName", "stayLocation", "roomCategory"],
  ["dayLabel", "from", "to", "hotelName"],
] as const;

function fillTourPlanRowsByIndex(xml: string, rows: TourPlanRowData[]): string {
  let result = xml;
  for (let r = 0; r < TOUR_PLAN_ROW_STARTS.length; r++) {
    const startIdx = TOUR_PLAN_ROW_STARTS[r];
    const fieldCount = TOUR_PLAN_FIELD_COUNTS[r];
    const fields = TOUR_PLAN_FIELDS[r];
    const row = rows[r];
    for (let f = 0; f < fieldCount; f++) {
      const value = row ? String(row[fields[f] as keyof typeof row] ?? "") : "";
      result = setTextAtIndex(result, startIdx + f, value);
    }
  }
  return result;
}

function fillTourPlanRows(xml: string, rows: TourPlanRowData[]): string {
  const table = findTourPlanTable(xml);
  if (!table) return fillTourPlanRowsByIndex(xml, rows);
  const filled = fillTourPlanTable(table, rows);
  return xml.replace(table, filled);
}

/**
 * Fill inclusion list items in place and append exclusions as plain list paragraphs
 * before the footer. Uses paragraph structure from the template — never clones
 * from the document start (which would duplicate tables).
 */
function fillInclusionsAndExclusions(
  xml: string,
  inclusions: string[],
  exclusions: string[]
): string {
  const paragraphs = findParagraphs(xml);
  const headingIdx = paragraphs.findIndex((p) => p.xml.includes("Entry Tickets Included:"));
  const footerIdx = paragraphs.findIndex((p) => p.xml.includes("Please feel free to reach out"));
  if (headingIdx === -1 || footerIdx === -1) {
    return fillInclusionsByIndex(xml, inclusions);
  }

  const sectionParagraphs = paragraphs.slice(headingIdx + 1, footerIdx);
  const listParagraphs = sectionParagraphs.filter((p) => isListParagraph(p.xml));
  const listTemplate =
    listParagraphs.find((p) => p.xml.includes("Hanuman temple")) ??
    listParagraphs.find((p) => p.xml.includes("<w:t")) ??
    listParagraphs[0];

  if (!listTemplate) return fillInclusionsByIndex(xml, inclusions);

  const emptyParagraphTemplate =
    sectionParagraphs.find((p) => !p.xml.includes("<w:t"))?.xml ??
    sectionParagraphs[sectionParagraphs.length - 1]?.xml ??
    listTemplate.xml;
  const sectionSpacer = () => createSpacerParagraph(emptyParagraphTemplate);

  let result = xml;

  for (let i = 0; i < listParagraphs.length; i++) {
    result = result.replace(
      listParagraphs[i].xml,
      setParagraphText(listParagraphs[i].xml, inclusions[i]?.trim() ?? "")
    );
  }

  let insertBlock = "";

  const extraInclusions = inclusions.map((item) => item.trim()).filter(Boolean).slice(listParagraphs.length);
  if (extraInclusions.length > 0) {
    insertBlock += extraInclusions
      .map((item) => setParagraphText(listTemplate.xml, item))
      .join("");
  }

  const exclusionItems = exclusions.map((item) => item.trim()).filter(Boolean);
  if (exclusionItems.length > 0) {
    insertBlock += sectionSpacer();
    insertBlock += setParagraphText(paragraphs[headingIdx].xml, "Exclusions:");
    insertBlock += exclusionItems
      .map((item) => setParagraphText(listTemplate.xml, item))
      .join("");
  }

  if (insertBlock) {
    insertBlock += sectionSpacer();
    const footerPara = paragraphs[footerIdx].xml;
    const insertAt = result.indexOf(footerPara);
    if (insertAt !== -1) {
      result = result.slice(0, insertAt) + insertBlock + result.slice(insertAt);
    }
  } else {
    const emptyBeforeFooter = [...sectionParagraphs].reverse().find((p) => !p.xml.includes("<w:t"));
    if (emptyBeforeFooter) {
      result = result.replace(emptyBeforeFooter.xml, sectionSpacer());
    }
  }

  return result;
}

/** Fallback when paragraph markers cannot be found. */
function fillInclusionsByIndex(xml: string, inclusions: string[]): string {
  let result = xml;
  for (let i = 0; i < 4; i++) {
    result = setTextAtIndex(result, 89 + i, inclusions[i] ?? "");
  }
  return result;
}

/**
 * Fill an empty table cell using the cell's existing paragraph run properties
 * from the template (preserves font, size, color, alignment).
 */
function fillEmptyParagraph(paragraphXml: string, value: string): string {
  if (!value || paragraphXml.includes("<w:t")) return paragraphXml;
  const rPrMatch = paragraphXml.match(
    /<w:pPr>[\s\S]*?<w:rPr>([\s\S]*?)<\/w:rPr>[\s\S]*?<\/w:pPr>/
  );
  const rPr = rPrMatch?.[1] ?? "";
  const run = `<w:r><w:rPr>${rPr}</w:rPr><w:t>${escapeXml(value)}</w:t></w:r>`;
  return paragraphXml.replace("</w:p>", `${run}</w:p>`);
}

function fillSummaryRowCells(tableXml: string, rowIndex: number, values: string[]): string {
  const rowParts = tableXml.split("<w:tr");
  if (rowParts.length <= rowIndex + 1) return tableXml;

  const rowContent = rowParts[rowIndex + 1];
  const cellParts = rowContent.split("<w:tc");
  let valueIndex = 0;

  const updatedCells = cellParts.map((cell, ci) => {
    if (ci === 0) return cell;
    const paragraphs = cell.match(/<w:p[\s\S]*?<\/w:p>/g) ?? [];
    if (paragraphs.length === 0 || valueIndex >= values.length) return cell;

    const paragraph = paragraphs[0];
    if (paragraph && !paragraph.includes("<w:t") && values[valueIndex]) {
      const filled = fillEmptyParagraph(paragraph, values[valueIndex]!);
      valueIndex++;
      return cell.replace(paragraph, filled);
    }
    return cell;
  });

  rowParts[rowIndex + 1] = updatedCells.join("<w:tc");
  return rowParts.join("<w:tr");
}

function fillSummaryTable(xml: string, data: ExportDocumentData): string {
  const tables = xml.match(/<w:tbl>[\s\S]*?<\/w:tbl>/g);
  if (!tables || tables.length === 0) return xml;

  const summaryTable = tables.find(
    (t) => t.includes("QTY") && t.includes("TRANSPORTATION") && t.includes("PER PERSON")
  );
  if (!summaryTable) return xml;

  const updated = fillSummaryRowCells(summaryTable, 5, [
    data.paxQtyLabel,
    data.transportDescription,
    data.roomsDescription || String(data.roomsQty),
    data.packageDescription,
    data.formattedPrice,
    data.formattedTotalPrice,
  ]);

  return xml.replace(summaryTable, updated);
}

/**
 * Fill the official Pumpkin quotation template.
 * Only replaces sample data values and empty summary cells.
 * Does NOT alter: logo, branding, labels, colors, layout, footer, or PER PERSON (INR).
 */
export async function fillQuotationTemplate(data: ExportDocumentData): Promise<Buffer> {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    throw new Error(
      "Official template missing. Place Quotation TEMPLATE.docx at templates/quotation-template-source.docx"
    );
  }

  const zip = new PizZip(fs.readFileSync(TEMPLATE_PATH));

  let xml = zip.file("word/document.xml")!.asText();

  xml = fillDuration(xml, data.nights, data.days);
  xml = fillDates(xml, data.quotationDate, data.expirationDate);
  xml = fillTourPlanRows(xml, data.tourPlanRows);
  xml = fillInclusionsAndExclusions(xml, data.inclusions, data.exclusions);
  xml = fillSummaryTable(xml, data);

  zip.file("word/document.xml", xml);

  return zip.generate({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
}
