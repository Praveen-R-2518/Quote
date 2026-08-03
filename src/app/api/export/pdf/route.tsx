import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { QuotationPdfDocument } from "@/lib/export/pdf-document";
import { buildExportDocumentData } from "@/lib/export/build-doc-data";
import { getFullConfig } from "@/lib/config-service";
import type { QuotationDraft } from "@/lib/quotation-schema";

export async function POST(request: NextRequest) {
  try {
    const { draft } = await request.json() as { draft: QuotationDraft };
    const config = await getFullConfig();
    const data = buildExportDocumentData(draft, config);
    const buffer = await renderToBuffer(<QuotationPdfDocument data={data} />);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="quotation.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF export error:", error);
    return NextResponse.json({ error: "PDF export failed" }, { status: 500 });
  }
}
