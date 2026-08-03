import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { isValidEntity, listEntities, createEntity, updateEntity, deleteEntity } from "@/lib/config-service";

type Params = { params: Promise<{ entity: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { entity } = await params;
  if (!isValidEntity(entity)) {
    return NextResponse.json({ error: "Invalid entity" }, { status: 400 });
  }
  const items = await listEntities(entity);
  return NextResponse.json(items);
}

export async function POST(request: NextRequest, { params }: Params) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { entity } = await params;
  if (!isValidEntity(entity)) {
    return NextResponse.json({ error: "Invalid entity" }, { status: 400 });
  }
  const data = await request.json();
  const item = await createEntity(entity, data);
  return NextResponse.json(item, { status: 201 });
}

export async function PUT(request: NextRequest, { params }: Params) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { entity } = await params;
  if (!isValidEntity(entity)) {
    return NextResponse.json({ error: "Invalid entity" }, { status: 400 });
  }
  const { id, ...data } = await request.json();
  const item = await updateEntity(entity, Number(id), data);
  return NextResponse.json(item);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { entity } = await params;
  if (!isValidEntity(entity)) {
    return NextResponse.json({ error: "Invalid entity" }, { status: 400 });
  }
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await deleteEntity(entity, Number(id));
  return NextResponse.json({ success: true });
}
