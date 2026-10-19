import { ReactNode } from "react";

import { PageContainer } from "../../../atoms/PageContainer";

export function ErrorMessage({ children, role }: { children: ReactNode; role: "status" | "alert" }) {
  return (
    <PageContainer>
      <h1 className="text-3xl font-semibold tracking-tight">Post</h1>
      <p className="mt-4 text-muted" role={role}>
        {children}
      </p>
    </PageContainer>
  );
}
