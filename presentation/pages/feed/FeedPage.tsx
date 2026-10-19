"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { PostList } from "./components/PostList";

import { Post } from "../../../domains/posts";
import { AppDispatch } from "../../../store/store";
import { savePosts, saveScroll } from "../../../store/postsSlice";
import { subscribeToNewPosts } from "../../../api/livePosts";
import { loadPosts } from "../../../api/posts";
import { PageContainer } from "../../atoms/PageContainer";


const highlightMs = 4000;

type FeedPage = {
  posts: readonly Post[];
  total: number;
};

type FeedList = FeedPage & {
  fetchedCount: number;
};

function reachedTheBottom() {
  const scrollHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
  );

  return scrollHeight - window.scrollY - window.innerHeight <= 1;
}

function errorMessage(caught: unknown) {
  return caught instanceof Error ? caught.message : "Could not load the posts.";
}

function toFeedList(page: FeedPage): FeedList {
  return {
    posts: page.posts,
    total: page.total,
    fetchedCount: page.posts.length,
  };
}

export function FeedPage({ initialPage }: { initialPage?: FeedPage }) {
  const dispatch = useDispatch<AppDispatch>();
  const [list, setList] = useState<FeedList | null>(initialPage ? toFeedList(initialPage) : null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [freshPost, setFreshPost] = useState<Post | null>(null);
  // Posts fetched from DummyJSON. A live post at the top must not move the next page.
  const fetchedCount = list?.fetchedCount ?? 0;
  const total = list?.total ?? 0;

  useEffect(() => {
    let active = true;
    let unsubscribe = () => {};
    let highlightTimer = 0;

    function rememberLivePost(post: Post) {
      dispatch(savePosts([post]));
      setList((current) =>
        current
          ? {
              ...current,
              posts: [post, ...current.posts.filter((item) => item.id !== post.id)],
            }
          : current,
      );
      setFreshPost(post);
      window.clearTimeout(highlightTimer);
      highlightTimer = window.setTimeout(() => {
        // A newer post may already own the mark.
        setFreshPost((current) => (current?.id === post.id ? null : current));
      }, highlightMs);
    }

    function connect(posts: readonly Post[]) {
      dispatch(savePosts(posts));
      unsubscribe = subscribeToNewPosts(rememberLivePost);
    }

    if (initialPage) {
      connect(initialPage.posts);
    } else {
      void loadPosts(0)
        .then((page) => {
          if (!active) {
            return;
          }

          setList(toFeedList(page));
          connect(page.posts);
        })
        .catch((caught: unknown) => {
          if (active) {
            setError(errorMessage(caught));
          }
        });
    }

    return () => {
      active = false;
      unsubscribe();
      window.clearTimeout(highlightTimer);
    };
  }, [dispatch, initialPage]);

  useEffect(() => {
    if (fetchedCount === 0 || fetchedCount >= total) {
      return;
    }

    const skip = fetchedCount;
    let loadingPage = false;

    function loadNextPage() {
      if (!reachedTheBottom() || loadingPage) {
        return;
      }

      loadingPage = true;
      setLoadingMore(true);

      void loadPosts(skip)
        .then((page) => {
          dispatch(savePosts(page.posts));
          setList((current) =>
            current
              ? {
                  posts: [...current.posts, ...page.posts],
                  total: page.total,
                  fetchedCount: skip + page.posts.length,
                }
              : current,
          );
        })
        .catch((caught: unknown) => {
          setError(errorMessage(caught));
        })
        .finally(() => {
          loadingPage = false;
          setLoadingMore(false);
        });
    }

    loadNextPage();
    window.addEventListener("scroll", loadNextPage, { passive: true });

    return () => {
      window.removeEventListener("scroll", loadNextPage);
    };
  }, [dispatch, fetchedCount, total]);

  return (
    <PageContainer>
      <h1 className="text-3xl font-semibold tracking-tight">Feed</h1>
      {freshPost ? (
        <p className="sr-only" role="status">
          New post: {freshPost.title}
        </p>
      ) : null}
      {error ? (
        <p className="mt-4 text-muted" role="alert">
          {error}
        </p>
      ) : null}
      {list === null && error === null ? (
        <p className="mt-4 text-muted" role="status">
          Loading posts…
        </p>
      ) : null}
      {list !== null && list.posts.length === 0 ? (
        <p className="mt-4 text-muted">There are no posts.</p>
      ) : null}
      {list !== null && list.posts.length > 0 ? (
        <div className="mt-8">
          <PostList
            highlightedId={freshPost?.id}
            onOpen={() => dispatch(saveScroll(window.scrollY))}
            posts={list.posts}
          />
          {loadingMore ? (
            <p className="py-4 text-muted" role="status">
              Loading more posts…
            </p>
          ) : null}
        </div>
      ) : null}
    </PageContainer>
  );
}
