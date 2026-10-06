import { NextRequest, NextResponse } from "next/server";
import { listContacts, createContact } from "@/lib/contacts";
import { validateContactInput, normalizeContactInput } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const contacts = await listContacts();
    return NextResponse.json({ contacts });
  } catch (error) {
    console.error("GET /api/contacts failed:", error);
    return NextResponse.json(
      { error: "Unable to load contacts right now. Please try again." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    const normalized = normalizeContactInput({
      name: name as string,
      phone: phone as string,
    });
    const contact = await createContact(normalized);
    return NextResponse.json({ contact }, { status: 201 });
  } catch (error) {
    console.error("POST /api/contacts failed:", error);
    return NextResponse.json(
      { error: "Unable to save the contact right now. Please try again." },
      { status: 500 }
    );
  }
}
