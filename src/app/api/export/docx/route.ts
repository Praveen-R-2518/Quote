import { NextRequest, NextResponse } from "next/server";
import { fillQuotationTemplate } from "@/lib/export/template-filler";
import { buildExportDocumentData } from "@/lib/export/build-doc-data";
import { getFullConfig } from "@/lib/config-service";
import type { QuotationDraft } from "@/lib/quotation-schema";

export async function POST(request: NextRequest) {
  try {
    const { draft } = await request.json() as { draft: QuotationDraft };
    const config = await getFullConfig();
    const data = buildExportDocumentData(draft, config);
    const buffer = await fillQuotationTemplate(data);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="quotation.docx"`,
      },
    });
  } catch (error) {
    console.error("DOCX export error:", error);
    return NextResponse.json({ error: "Word export failed" }, { status: 500 });
  }
}
