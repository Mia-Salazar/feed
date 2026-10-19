import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Post } from "../domains/posts";

type PostsState = {
  byId: Partial<Record<number, Post>>;
  scrollY: number;
};

const initialState: PostsState = { byId: {}, scrollY: 0 };

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    savePosts(state, action: PayloadAction<readonly Post[]>) {
      for (const post of action.payload) {
        state.byId[post.id] = post;
      }
    },
    saveScroll(state, action: PayloadAction<number>) {
      state.scrollY = action.payload;
    },
    clearPosts() {
      // Fresh object. Returning initialState would let Immer mutate it.
      return { byId: {}, scrollY: 0 };
    },
  },
});

export const { savePosts, saveScroll, clearPosts } = postsSlice.actions;
export const postsReducer = postsSlice.reducer;