"use client";

import { useCallback, useEffect, useState } from "react";
import type { Contact } from "@/types/contact";
import ContactForm from "@/components/ContactForm";
import ContactList from "@/components/ContactList";
import AssistantChat from "@/components/AssistantChat";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import Toast, { type ToastState } from "@/components/Toast";

type FieldErrors = { name?: string; phone?: string };

async function parseJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export default function ContactManager() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const loadContacts = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const response = await fetch("/api/contacts");
      const data = await parseJson(response);
      if (!response.ok) {
        throw new Error(data?.error || "Unable to load contacts.");
      }
      setContacts(data.contacts ?? []);
    } catch {
      setLoadError(
        "Unable to load contacts. Check your connection and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    loadContacts();
  }, [loadContacts]);

  async function handleAdd(input: {
    name: string;
    phone: string;
  }): Promise<{ fieldErrors?: FieldErrors } | void> {
    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await parseJson(response);

      if (response.status === 422) {
        return { fieldErrors: data?.fieldErrors as FieldErrors };
      }
      if (!response.ok) {
        throw new Error(data?.error || "Unable to add contact.");
      }

      setContacts((prev) => [data.contact as Contact, ...prev]);
      setToast({ type: "success", message: "Contact added successfully." });
    } catch {
      setToast({
        type: "error",
        message: "Unable to add the contact. Please try again.",
      });
    }
  }

  async function handleSaveEdit(
    id: string,
    input: { name: string; phone: string },
  ): Promise<{ fieldErrors?: FieldErrors } | void> {
    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await parseJson(response);

      if (response.status === 422) {
        return { fieldErrors: data?.fieldErrors as FieldErrors };
      }
      if (!response.ok) {
        throw new Error(data?.error || "Unable to update contact.");
      }

      setContacts((prev) =>
        prev.map((c) => (c.id === id ? (data.contact as Contact) : c)),
      );
      setEditingId(null);
      setToast({ type: "success", message: "Contact updated successfully." });
    } catch {
      setToast({
        type: "error",
        message: "Unable to update the contact. Please try again.",
      });
    }
  }

  async function handleConfirmDelete() {
    if (!deletingContact) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/contacts/${deletingContact.id}`, {
        method: "DELETE",
      });
      const data = await parseJson(response);
      if (!response.ok) {
        throw new Error(data?.error || "Unable to delete contact.");
      }

      setContacts((prev) => prev.filter((c) => c.id !== deletingContact.id));
      setToast({ type: "success", message: "Contact deleted successfully." });
      setDeletingContact(null);
    } catch {
      setToast({
        type: "error",
        message: "Unable to delete the contact. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      <ContactForm onAdd={handleAdd} />
      <AssistantChat onContactsChanged={loadContacts} />

      <div className="mt-10">
        <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-wide text-slate-500 sm:text-left">
          Your Contacts
        </h2>

        {loadError ? (
          <div className="rounded-xl border border-red-200 bg-white p-6 text-center shadow-lg shadow-red-950/5">
            <p className="text-sm text-red-600">{loadError}</p>
            <button
              type="button"
              onClick={loadContacts}
              className="mt-3 inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 active:scale-[.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              Try again
            </button>
          </div>
        ) : (
          <ContactList
            contacts={contacts}
            isLoading={isLoading}
            editingId={editingId}
            onStartEdit={setEditingId}
            onCancelEdit={() => setEditingId(null)}
            onSave={handleSaveEdit}
            onRequestDelete={setDeletingContact}
          />
        )}
      </div>

      {deletingContact && (
        <DeleteConfirmation
          contact={deletingContact}
          isDeleting={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingContact(null)}
        />
      )}
    </>
  );
}
