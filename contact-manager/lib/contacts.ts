import { query } from "@/lib/db";
import type { Contact } from "@/types/contact";

interface ContactRow {
  id: string;
  name: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

function mapRow(row: ContactRow): Contact {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listContacts(): Promise<Contact[]> {
  const result = await query<ContactRow>(
    `SELECT id, name, phone, created_at, updated_at
     FROM contacts
     ORDER BY created_at DESC`
  );
  return result.rows.map(mapRow);
}

export async function getContact(id: string): Promise<Contact | null> {
  const result = await query<ContactRow>(
    `SELECT id, name, phone, created_at, updated_at
     FROM contacts
     WHERE id = $1`,
    [id]
  );
  return result.rows[0] ? mapRow(result.rows[0]) : null;
}

export async function createContact(input: {
  name: string;
  phone: string;
}): Promise<Contact> {
  const result = await query<ContactRow>(
    `INSERT INTO contacts (name, phone)
     VALUES ($1, $2)
     RETURNING id, name, phone, created_at, updated_at`,
    [input.name, input.phone]
  );
  return mapRow(result.rows[0]);
}

export async function updateContact(
  id: string,
  input: { name: string; phone: string }
): Promise<Contact | null> {
  const result = await query<ContactRow>(
    `UPDATE contacts
     SET name = $1, phone = $2, updated_at = now()
     WHERE id = $3
     RETURNING id, name, phone, created_at, updated_at`,
    [input.name, input.phone, id]
  );
  return result.rows[0] ? mapRow(result.rows[0]) : null;
}

export async function deleteContact(id: string): Promise<boolean> {
  const result = await query(`DELETE FROM contacts WHERE id = $1`, [id]);
  return (result.rowCount ?? 0) > 0;
}
