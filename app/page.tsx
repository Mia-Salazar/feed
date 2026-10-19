import { Suspense } from "react";

import { loadPosts } from "@/api/posts";
import { PageContainer } from "@/presentation/atoms/PageContainer";
import { FeedPage } from "@/presentation/pages/feed/FeedPage";

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingFeed />}>
      <HomeFeed />
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

async function HomeFeed() {
  const page = await loadPosts(0).catch(() => null);

  return <FeedPage initialPage={page ?? undefined} />;
}

