"use client";

import { useState, type FormEvent } from "react";

type Operation = "CREATE" | "READ" | "UPDATE" | "DELETE" | "UNKNOWN";

interface ChatResponse {
  reply: string;
  operation: Operation;
  success: boolean;
}

interface AssistantChatProps {
  onContactsChanged: () => Promise<void>;
}

function isChatResponse(value: unknown): value is ChatResponse {
  if (!value || typeof value !== "object") return false;
  const response = value as Record<string, unknown>;
  return (
    typeof response.reply === "string" &&
    typeof response.success === "boolean" &&
    ["CREATE", "READ", "UPDATE", "DELETE", "UNKNOWN"].includes(
      response.operation as string,
    )
  );
}

export default function AssistantChat({
  onContactsChanged,
}: AssistantChatProps) {
  const [message, setMessage] = useState("");
  const [exchange, setExchange] = useState<{
    message: string;
    reply: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submittedMessage = message.trim();
    if (!submittedMessage || isSending) return;

    setIsSending(true);
    setError(null);
    try {
      const response = await fetch("/agent-api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: submittedMessage }),
      });
      if (!response.ok) {
        throw new Error("The assistant is unavailable right now.");
      }

      const data: unknown = await response.json();
      if (!isChatResponse(data)) {
        throw new Error("The assistant returned an unexpected response.");
      }

      setExchange({ message: submittedMessage, reply: data.reply });
      setMessage("");
      if (
        data.success &&
        ["CREATE", "UPDATE", "DELETE"].includes(data.operation)
      ) {
        await onContactsChanged();
      }
    } catch {
      setError(
        "I couldn't reach the assistant. Please check that it's running and try again.",
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section
      aria-labelledby="assistant-chat-heading"
      className="mt-6 rounded-xl border border-blue-100 bg-white/90 p-6 shadow-xl shadow-blue-950/5 backdrop-blur-sm sm:p-8"
    >
      <div className="mb-5">
        <h2
          id="assistant-chat-heading"
          className="text-lg font-bold text-[#172033]"
        >
          Ask your contact assistant
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Add, find, update, or delete a contact with a message.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 sm:flex-row sm:items-stretch"
      >
        <label htmlFor="assistant-message" className="sr-only">
          Message for your contact assistant
        </label>
        <textarea
          id="assistant-message"
          name="message"
          rows={2}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="e.g. Add Maria Lopez, phone 555-2211"
          disabled={isSending}
          className="min-h-12 flex-1 resize-y rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition duration-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/15 disabled:cursor-not-allowed disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={isSending || !message.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25 active:scale-[.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:bg-blue-400"
        >
          {isSending ? "Sending…" : "Send"}
        </button>
      </form>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {exchange && (
        <div
          aria-live="polite"
          className="mt-5 rounded-xl border border-blue-100 bg-blue-50/70 p-4"
        >
          <p className="text-sm text-blue-900">
            <span className="font-semibold">You:</span> {exchange.message}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            <span className="font-semibold text-blue-800">Assistant:</span>{" "}
            {exchange.reply}
          </p>
        </div>
      )}
    </section>
  );
}
