"use client";

import { FormEvent, useState } from "react";
import { validateName, validatePhone } from "@/lib/validation";

interface ContactFormProps {
  onAdd: (input: {
    name: string;
    phone: string;
  }) => Promise<{ fieldErrors?: { name?: string; phone?: string } } | void>;
}

export default function ContactForm({ onAdd }: ContactFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const nameError = validateName(name);
    const phoneError = validatePhone(phone);
    if (nameError || phoneError) {
      setErrors({ name: nameError, phone: phoneError });
      return;
    }
    setErrors({});

    setIsSubmitting(true);
    try {
      const result = await onAdd({ name, phone });
      if (result?.fieldErrors) {
        setErrors(result.fieldErrors);
        return;
      }
      setName("");
      setPhone("");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-xl border border-blue-100 bg-white/90 p-6 shadow-xl shadow-blue-950/5 backdrop-blur-sm sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="mb-2 block text-sm font-semibold text-[#334155]"
          >
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition duration-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/15"
          />
          {errors.name && (
            <p id="contact-name-error" className="mt-1.5 text-sm text-red-600">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="contact-phone"
            className="mb-2 block text-sm font-semibold text-[#334155]"
          >
            Phone Number
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "contact-phone-error" : undefined}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition duration-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/15"
          />
          {errors.phone && (
            <p id="contact-phone-error" className="mt-1.5 text-sm text-red-600">
              {errors.phone}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-center sm:justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25 active:scale-[.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          <span aria-hidden="true" className="text-lg leading-none">
            +
          </span>
          {isSubmitting ? "Adding…" : "Add Contact"}
        </button>
      </div>
    </form>
  );
}
