import { Suspense } from "react";
import { loadCachedPosts } from "@/app/cachedPosts";
import { Feed } from "@/presentation/pages/feed/Feed";
import { PageMain } from "@/presentation/atoms/PageMain";

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingFeed />}>
      <CachedFeed />
    </Suspense>
  );
}

function LoadingFeed() {
  return (
    <PageMain>
      <h1 className="text-3xl font-semibold tracking-tight">Feed</h1>
      <p className="mt-4 text-muted" role="status">
        Loading posts…
      </p>
    </PageMain>
  );
}

async function CachedFeed() {
  const page = await loadCachedPosts(0).catch(() => null);

  return <Feed initialPage={page ?? undefined} />;
}
