import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Contact Manager",
  description: "Save, edit, and organize your contacts in one place.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-50 font-[family-name:var(--font-body)] text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
