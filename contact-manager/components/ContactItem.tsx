"use client";

import type { Contact } from "@/types/contact";
import EditContactForm from "@/components/EditContactForm";

interface ContactItemProps {
  contact: Contact;
  variant: "row" | "card";
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSave: (
    id: string,
    input: { name: string; phone: string },
  ) => Promise<{ fieldErrors?: { name?: string; phone?: string } } | void>;
  onRequestDelete: () => void;
}

export default function ContactItem({
  contact,
  variant,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onSave,
  onRequestDelete,
}: ContactItemProps) {
  if (variant === "row") {
    if (isEditing) {
      return (
        <tr className="border-b border-blue-50 last:border-b-0">
          <td colSpan={3} className="px-5 py-4">
            <EditContactForm
              contact={contact}
              onSave={onSave}
              onCancel={onCancelEdit}
            />
          </td>
        </tr>
      );
    }

    return (
      <tr className="border-b border-blue-50 last:border-b-0 transition-colors hover:bg-blue-50/40">
        <td className="px-5 py-4 text-sm font-medium text-slate-900">
          {contact.name}
        </td>
        <td className="px-5 py-4 text-sm text-slate-600">{contact.phone}</td>
        <td className="px-5 py-4 text-right text-sm">
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onStartEdit}
              className="inline-flex items-center gap-1.5 rounded-xl px-2 py-1 font-semibold text-blue-600 transition hover:bg-blue-50 hover:text-blue-700 active:scale-[.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-3.5 w-3.5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m15.5 5.5 3 3M4.75 19.25l.75-3.75L15.5 5.5a2.12 2.12 0 0 1 3 3l-10 10-3.75.75Z"
                />
              </svg>
              Edit
            </button>
            <button
              type="button"
              onClick={onRequestDelete}
              className="inline-flex items-center gap-1.5 rounded-xl px-2 py-1 font-semibold text-red-600 transition hover:bg-red-50 hover:text-red-700 active:scale-[.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-3.5 w-3.5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.5 7.5h13M9 7.5V5.75h6V7.5m-8.5 0 .75 11h7.5l.75-11M10 11v4M14 11v4"
                />
              </svg>
              Delete
            </button>
          </div>
        </td>
      </tr>
    );
  }

  // Card variant (mobile)
  if (isEditing) {
    return (
      <li className="rounded-xl border border-blue-100 bg-white p-4 shadow-lg shadow-blue-950/5">
        <EditContactForm
          contact={contact}
          onSave={onSave}
          onCancel={onCancelEdit}
        />
      </li>
    );
  }

  return (
    <li className="rounded-xl border border-blue-100 bg-white p-4 shadow-lg shadow-blue-950/5">
      <p className="text-sm font-semibold text-slate-900">{contact.name}</p>
      <p className="mt-0.5 text-sm text-slate-600">{contact.phone}</p>
      <div className="mt-3 flex gap-4 border-t border-slate-100 pt-3">
        <button
          type="button"
          onClick={onStartEdit}
          className="inline-flex items-center gap-1.5 rounded-xl px-2 py-1 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 hover:text-blue-700 active:scale-[.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-3.5 w-3.5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m15.5 5.5 3 3M4.75 19.25l.75-3.75L15.5 5.5a2.12 2.12 0 0 1 3 3l-10 10-3.75.75Z"
            />
          </svg>
          Edit
        </button>
        <button
          type="button"
          onClick={onRequestDelete}
          className="inline-flex items-center gap-1.5 rounded-xl px-2 py-1 text-sm font-semibold text-red-600 transition hover:bg-red-50 hover:text-red-700 active:scale-[.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-3.5 w-3.5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.5 7.5h13M9 7.5V5.75h6V7.5m-8.5 0 .75 11h7.5l.75-11M10 11v4M14 11v4"
            />
          </svg>
          Delete
        </button>
      </div>
    </li>
  );
}
