import { NextRequest, NextResponse } from "next/server";
import { fillQuotationTemplate } from "@/lib/export/template-filler";
import { buildExportDocumentData } from "@/lib/export/build-doc-data";
import { convertDocxBufferToPdf, PdfConversionError } from "@/lib/export/docx-to-pdf";
import { getFullConfig } from "@/lib/config-service";
import type { QuotationDraft } from "@/lib/quotation-schema";

export async function POST(request: NextRequest) {
  try {
    const { draft } = await request.json() as { draft: QuotationDraft };
    const config = await getFullConfig();
    const data = buildExportDocumentData(draft, config);
    const docxBuffer = await fillQuotationTemplate(data);
    const buffer = await convertDocxBufferToPdf(docxBuffer);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="quotation.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF export error:", error);
    if (error instanceof PdfConversionError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    return NextResponse.json({ error: "PDF export failed" }, { status: 500 });
  }
}
