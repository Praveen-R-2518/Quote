import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
} from "docx";
import type { ExportDocumentData } from "./build-doc-data";

export async function buildDocxBuffer(data: ExportDocumentData): Promise<Buffer> {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({ text: data.title, heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
        new Paragraph({ text: data.companyName, alignment: AlignmentType.CENTER }),
        ...(data.companyAddress ? [new Paragraph({ text: data.companyAddress, alignment: AlignmentType.CENTER })] : []),
        ...(data.companyPhone ? [new Paragraph({ text: `Tel: ${data.companyPhone}`, alignment: AlignmentType.CENTER })] : []),
        ...(data.companyEmail ? [new Paragraph({ text: `Email: ${data.companyEmail}`, alignment: AlignmentType.CENTER })] : []),
        new Paragraph({ text: "" }),
        new Paragraph({ text: "Customer Details", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ children: [new TextRun({ text: "Customer: ", bold: true }), new TextRun(data.customerName || "N/A")] }),
        new Paragraph({ children: [new TextRun({ text: "Duration: ", bold: true }), new TextRun(`${data.nights} nights / ${data.days} days`)] }),
        new Paragraph({ text: "Tour Places", heading: HeadingLevel.HEADING_2 }),
        ...data.stayingLocations.map((s) => new Paragraph({ text: `- ${s.location}: ${s.nights} night(s)` })),
        new Paragraph({ text: "Passengers", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: `Adults: ${data.passengers.adults}, Children: ${data.passengers.children}, Infants: ${data.passengers.infants}, FOCs: ${data.passengers.focs}` }),
        new Paragraph({ text: `Total: ${data.totalPax} passengers` }),
        new Paragraph({ children: [new TextRun({ text: `Total Price: ${data.formattedPrice}`, bold: true, size: 28 })] }),
        new Paragraph({ text: "Room Allocation", heading: HeadingLevel.HEADING_2 }),
        ...data.roomAllocations.map((r) => new Paragraph({ text: `- ${r.count}x ${r.roomTypeName} (capacity ${r.capacity})` })),
        new Paragraph({ text: "Transport", heading: HeadingLevel.HEADING_2 }),
        ...data.transport.map((t) => new Paragraph({ text: `- ${t.count}x ${t.vehicleName} (capacity ${t.capacity})` })),
        new Paragraph({ text: "Hotels", heading: HeadingLevel.HEADING_2 }),
        ...data.hotels.map((h) => new Paragraph({ text: `- ${h.location}: ${h.hotelName || "TBD"} (${h.nights} nights)` })),
        new Paragraph({ text: "Inclusions", heading: HeadingLevel.HEADING_2 }),
        ...data.inclusions.map((item) => new Paragraph({ text: `- ${item}` })),
        new Paragraph({ text: "Exclusions", heading: HeadingLevel.HEADING_2 }),
        ...data.exclusions.map((item) => new Paragraph({ text: `- ${item}` })),
        ...(data.termsAndConditions ? [
          new Paragraph({ text: "Terms & Conditions", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: data.termsAndConditions }),
        ] : []),
        new Paragraph({ text: "" }),
        new Paragraph({ text: `Generated on ${new Date(data.generatedAt).toLocaleString()}`, alignment: AlignmentType.RIGHT }),
      ],
    }],
  });

  return Buffer.from(await Packer.toBuffer(doc));
}
