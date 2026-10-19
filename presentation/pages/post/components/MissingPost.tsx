import Link from "next/link";

import { PageContainer } from "../../../atoms/PageContainer";

export function MissingPost() {
  return (
    <PageContainer>
      <h1 className="text-3xl font-semibold tracking-tight">Post not found</h1>
      <p className="mt-4 text-muted">That post does not exist.</p>
      <Link
        className="mt-6 inline-flex min-h-11 items-center font-semibold underline-offset-4 hover:underline"
        href="/"
        scroll={false}
      >
        Back to the feed
      </Link>
    </PageContainer>
  );
}