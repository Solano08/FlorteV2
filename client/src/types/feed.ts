export type PostReactionTotals = Record<string, number>;

export interface FeedPost {
  id: number;
  content: string | null;
  type: "texto" | "imagen" | "video";
  mediaUrl: string | null;
  createdAt: string;
  project: { id: number; title: string } | null;
  author: { id: number; name: string; avatarUrl: string | null };
  reactions: { totals: PostReactionTotals; totalCount: number; userReaction: string | null };
  comments: { totalCount: number };
}

export interface FeedComment {
  id: number;
  content: string | null;
  mediaUrl: string | null;
  createdAt: string;
  author: { id: number; name: string; avatarUrl: string | null };
}
