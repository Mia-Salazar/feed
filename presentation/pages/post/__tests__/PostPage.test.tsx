import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

import { jsonResponse } from "../../../../tests/jsonResponse";
import { PostPage } from "../PostPage";
import { store } from "../../../../store/store";
import { clearPosts, savePosts } from "../../../../store/postsSlice";

jest.mock("next/navigation", () => ({
  usePathname: () => "/posts/7",
}));

const fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>;

const author = {
  id: 3,
  firstName: "Ada",
  lastName: "Lovelace",
  image: "https://dummyjson.com/icon/ada/128",
};

const fullBody = `${"Full text of the publication. ".repeat(12)}End.`;

function mockPublicationSeven() {
  fetchMock.mockImplementation((input) => {
    const url = String(input);

    if (url === "https://dummyjson.com/posts/7") {
      return Promise.resolve(
        jsonResponse({ id: 7, title: "Story", body: fullBody, userId: 3 }),
      );
    }

    if (url === "https://dummyjson.com/users?limit=0") {
      return Promise.resolve(jsonResponse({ users: [author] }));
    }

    return Promise.reject(new Error(url));
  });
}

function openPublication(id: string) {
  render(
    <Provider store={store}>
      <PostPage id={id} />
    </Provider>,
  );
}

beforeEach(() => {
  store.dispatch(clearPosts());
});

describe("Given that publication exists", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock;
    mockPublicationSeven();
  });

  describe("When they open it", () => {
    it("Then they see only that post and its full text", async () => {
      openPublication("7");

      expect(await screen.findByText("Ada Lovelace")).toBeVisible();
      expect(screen.getByText(fullBody)).toBeVisible();
    });
  });
});

describe("Given the address is not a publication", () => {
  describe("When they open it", () => {
    it("Then they are told that post does not exist", () => {
      openPublication("no");

      expect(screen.getByRole("heading", { name: "Post not found" })).toBeVisible();
      expect(screen.getByText("That post does not exist.")).toBeVisible();
    });
  });
});

describe("Given DummyJSON does not have that publication", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock;
    fetchMock.mockImplementation((input) => {
      if (String(input) === "https://dummyjson.com/posts/7") {
        return Promise.resolve(jsonResponse({}, 404));
      }

      return Promise.reject(new Error(String(input)));
    });
  });

  describe("When they open it", () => {
    it("Then they are told that post does not exist", async () => {
      openPublication("7");

      expect(await screen.findByRole("heading", { name: "Post not found" })).toBeVisible();
      expect(screen.getByText("That post does not exist.")).toBeVisible();
    });
  });
});

describe("Given the post request fails", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock;
    fetchMock.mockResolvedValue(jsonResponse({}, 500));
  });

  describe("When they open it", () => {
    it("Then they are told the post could not be loaded", async () => {
      openPublication("7");

      expect(await screen.findByText("Could not load the post (500).")).toBeVisible();
    });
  });
});

describe("Given the feed already saved that post", () => {
  const saved = {
    id: 900,
    title: "Fresh story",
    body: "It just arrived and the whole text stays here.",
    author: { name: "Grace Hopper", avatarUrl: "" },
  };

  beforeEach(() => {
    fetchMock.mockReset();
    fetchMock.mockRejectedValue(new Error("offline"));
    global.fetch = fetchMock;
    store.dispatch(savePosts([saved]));
  });

  describe("When they open it", () => {
    it("Then they see its full text", async () => {
      openPublication("900");

      expect(await screen.findByRole("heading", { name: "Fresh story" })).toBeVisible();
      expect(screen.getByText("Grace Hopper")).toBeVisible();
      expect(screen.getByText(saved.body)).toBeVisible();
    });
  });
});
