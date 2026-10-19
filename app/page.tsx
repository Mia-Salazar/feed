import { Suspense } from "react";

import { loadCachedPosts } from "./cachedPosts";
import { PageContainer } from "../presentation/atoms/PageContainer";
import { FeedPage } from "../presentation/pages/feed/FeedPage";

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingFeed />}>
      <CachedFeed />
    </Suspense>
  );
}

function LoadingFeed() {
  return (
    <PageContainer>
      <h1 className="text-3xl font-semibold tracking-tight">Feed</h1>
      <p className="mt-4 text-muted" role="status">
        Loading posts…
      </p>
    </PageContainer>
  );
}

async function CachedFeed() {
  const page = await loadCachedPosts(0).catch(() => null);

  return <FeedPage initialPage={page ?? undefined} />;
}

