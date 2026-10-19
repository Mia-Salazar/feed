"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { DetailPost } from "./components/DetailPost";
import { MissingPost } from "./components/MissingPost";
import { LoadingPost } from "./components/LoadingPost";
import { ErrorMessage } from "./components/ErrorMessage";

import { Post } from "../../../domains/posts";
import { RootState } from "../../../store/store";
import { loadPost } from "../../../api/posts";
import { PageContainer } from "../../atoms/PageContainer";


type Status =
  | { kind: "loading" }
  | { kind: "ready"; post: Post }
  | { kind: "missing" }
  | { kind: "error"; message: string };

export function PostPage({ id, initialPost }: { id: string; initialPost?: Post | null }) {
  const numericId = Number(id);
  const valid = Number.isInteger(numericId) && numericId > 0;
  const known = useSelector((state: RootState) => state.posts.byId[numericId]) ?? initialPost;
  const [status, setStatus] = useState<Status>({ kind: "loading" });

  useEffect(() => {
    if (!valid) {
      return;
    }

    let active = true;

    async function load() {
      try {
        // Yield once so the first paint says "Loading", even when the post is already here.
        await Promise.resolve();
        const post = known ?? (await loadPost(numericId));

        if (active) {
          setStatus(post ? { kind: "ready", post } : { kind: "missing" });
        }
      } catch (caught: unknown) {
        if (active) {
          setStatus({
            kind: "error",
            message: caught instanceof Error ? caught.message : "Could not load the post.",
          });
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [valid, numericId, known]);

  useEffect(() => {
    if (status.kind === "ready") {
      document.getElementById("content")?.focus();
    }
  }, [status]);

  if (!valid || status.kind === "missing") {
    return <MissingPost />;
  }

  if (status.kind === "error") {
    return <ErrorMessage role="alert">{status.message}</ErrorMessage>;
  }

  if (status.kind === "loading") {
    return <LoadingPost />;
  }

  return (
    <PageContainer>
      <DetailPost post={status.post} />
    </PageContainer>
  );
}



