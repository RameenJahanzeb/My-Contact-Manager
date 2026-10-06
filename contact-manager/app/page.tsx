import ContactManager from "@/components/ContactManager";

export default function Home() {
  return (
    <div className="relative flex flex-1 justify-center overflow-hidden px-4 py-8 sm:px-6 sm:py-14">
      <main className="relative z-10 w-full max-w-3xl">
        <div className="mb-8 text-center sm:mb-10">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-medium tracking-tight text-[#172033] sm:text-4xl">
            Contact Manager
          </h1>
          <p className="mt-3 text-sm text-slate-500 sm:text-base">
            Manage your contacts easily
          </p>
        </div>

        <ContactManager />
      </main>
    </div>
  );
}
