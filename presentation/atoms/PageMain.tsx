import type { ReactNode } from "react";

export function PageMain({ children }: { children: ReactNode }) {
  return (
    <main
      className="mx-auto w-full max-w-xl flex-1 px-4 py-10 outline-none"
      id="content"
      tabIndex={-1}
    >
      {children}
    </main>
  );
}