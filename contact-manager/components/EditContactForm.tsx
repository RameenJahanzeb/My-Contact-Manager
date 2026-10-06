"use client";

import { FormEvent, useState } from "react";
import type { Contact } from "@/types/contact";
import { validateName, validatePhone } from "@/lib/validation";

interface EditContactFormProps {
  contact: Contact;
  onSave: (
    id: string,
    input: { name: string; phone: string },
  ) => Promise<{ fieldErrors?: { name?: string; phone?: string } } | void>;
  onCancel: () => void;
}

export default function EditContactForm({
  contact,
  onSave,
  onCancel,
}: EditContactFormProps) {
  const [name, setName] = useState(contact.name);
  const [phone, setPhone] = useState(contact.phone);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving) return;

    const nameError = validateName(name);
    const phoneError = validatePhone(phone);
    if (nameError || phoneError) {
      setErrors({ name: nameError, phone: phoneError });
      return;
    }
    setErrors({});

    setIsSaving(true);
    try {
      const result = await onSave(contact.id, { name, phone });
      if (result?.fieldErrors) {
        setErrors(result.fieldErrors);
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="grid gap-4 sm:grid-cols-2 sm:items-start"
    >
      <div>
        <label
          htmlFor={`edit-name-${contact.id}`}
          className="mb-2 block text-sm font-semibold text-[#334155]"
        >
          Name
        </label>
        <input
          id={`edit-name-${contact.id}`}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={Boolean(errors.name)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm text-slate-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/15"
        />
        {errors.name && (
          <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label
          htmlFor={`edit-phone-${contact.id}`}
          className="mb-2 block text-sm font-semibold text-[#334155]"
        >
          Phone Number
        </label>
        <input
          id={`edit-phone-${contact.id}`}
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          aria-invalid={Boolean(errors.phone)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm text-slate-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/15"
        />
        {errors.phone && (
          <p className="mt-1.5 text-sm text-red-600">{errors.phone}</p>
        )}
      </div>

      <div className="flex gap-2 sm:col-span-2">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700 active:scale-[.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {isSaving ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 active:scale-[.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
