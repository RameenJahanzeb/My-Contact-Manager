"use client";

import type { Contact } from "@/types/contact";
import ContactItem from "@/components/ContactItem";

interface ContactListProps {
  contacts: Contact[];
  isLoading: boolean;
  editingId: string | null;
  onStartEdit: (id: string) => void;
  onCancelEdit: () => void;
  onSave: (
    id: string,
    input: { name: string; phone: string },
  ) => Promise<{ fieldErrors?: { name?: string; phone?: string } } | void>;
  onRequestDelete: (contact: Contact) => void;
}

export default function ContactList({
  contacts,
  isLoading,
  editingId,
  onStartEdit,
  onCancelEdit,
  onSave,
  onRequestDelete,
}: ContactListProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm shadow-slate-900/5">
        <p className="text-sm font-medium text-slate-500">Loading contacts…</p>
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-blue-200 bg-white/80 p-10 text-center shadow-lg shadow-blue-950/5">
        <div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-blue-50 text-blue-600"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="h-9 w-9"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 4.75h8A2.25 2.25 0 0 1 18.25 7v10A2.25 2.25 0 0 1 16 19.25H8A2.25 2.25 0 0 1 5.75 17V7A2.25 2.25 0 0 1 8 4.75Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 4.75V3.5h6v1.25M9 10h6M9 13h3M9 16h5"
            />
          </svg>
        </div>
        <p className="mt-4 text-sm font-semibold text-[#334155]">
          No contacts added yet.
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Your next friendly connection can start here.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop / tablet: table layout */}
      <div className="hidden overflow-hidden rounded-xl border border-blue-100 bg-white/90 shadow-xl shadow-blue-950/5 sm:block">
        <table className="w-full table-fixed border-collapse">
          <caption className="sr-only">Your saved contacts</caption>
          <thead>
            <tr className="border-b border-blue-100 bg-blue-50/70 text-left text-xs font-bold uppercase tracking-[0.12em] text-blue-900/60">
              <th scope="col" className="w-2/5 px-5 py-3">
                Name
              </th>
              <th scope="col" className="w-2/5 px-5 py-3">
                Phone Number
              </th>
              <th scope="col" className="w-1/5 px-5 py-3 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <ContactItem
                key={contact.id}
                contact={contact}
                variant="row"
                isEditing={editingId === contact.id}
                onStartEdit={() => onStartEdit(contact.id)}
                onCancelEdit={onCancelEdit}
                onSave={onSave}
                onRequestDelete={() => onRequestDelete(contact)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: card layout */}
      <ul className="flex flex-col gap-3 sm:hidden">
        {contacts.map((contact) => (
          <ContactItem
            key={contact.id}
            contact={contact}
            variant="card"
            isEditing={editingId === contact.id}
            onStartEdit={() => onStartEdit(contact.id)}
            onCancelEdit={onCancelEdit}
            onSave={onSave}
            onRequestDelete={() => onRequestDelete(contact)}
          />
        ))}
      </ul>
    </>
  );
}
