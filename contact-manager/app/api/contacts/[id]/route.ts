import { NextRequest, NextResponse } from "next/server";
import { deleteContact, getContact, updateContact } from "@/lib/contacts";
import { validateContactInput, normalizeContactInput } from "@/lib/validation";

export const dynamic = "force-dynamic";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type RouteContext = { params: Promise<{ id: string }> };

async function updateHandler(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  if (!UUID_REGEX.test(id)) {
    return NextResponse.json({ error: "Contact not found." }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { name, phone } = (body ?? {}) as { name?: unknown; phone?: unknown };
  const validation = validateContactInput({ name, phone });

  if (!validation.valid) {
    return NextResponse.json(
      { error: "Validation failed.", fieldErrors: validation.errors },
      { status: 422 }
    );
  }

  try {
    const existing = await getContact(id);
    if (!existing) {
      return NextResponse.json(
        { error: "Contact not found." },
        { status: 404 }
      );
    }

    const normalized = normalizeContactInput({
      name: name as string,
      phone: phone as string,
    });
    const contact = await updateContact(id, normalized);
    return NextResponse.json({ contact });
  } catch (error) {
    console.error(`PUT /api/contacts/${id} failed:`, error);
    return NextResponse.json(
      { error: "Unable to update the contact right now. Please try again." },
      { status: 500 }
    );
  }
}

export const PUT = updateHandler;
export const PATCH = updateHandler;

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  if (!UUID_REGEX.test(id)) {
    return NextResponse.json({ error: "Contact not found." }, { status: 404 });
  }

  try {
    const deleted = await deleteContact(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Contact not found." },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`DELETE /api/contacts/${id} failed:`, error);
    return NextResponse.json(
      { error: "Unable to delete the contact right now. Please try again." },
      { status: 500 }
    );
  }
}
