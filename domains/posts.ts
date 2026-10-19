export interface PostAuthor {
  name: string;
  avatarUrl: string;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  author: PostAuthor;
}