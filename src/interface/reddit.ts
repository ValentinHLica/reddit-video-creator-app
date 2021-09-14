export interface SearchItem {
  display_name: string;
  title: string;
  display_name_prefixed: string;
  subscribers: number;
  public_description: string;
  id: string;
  url: string;
}

export interface Search {
  kind: string;
  data: SearchItem;
}

export interface Award {
  award_sub_type: string;
  icon_url: string;
  count: number;
  name: string;
}

export interface Post {
  subreddit: string;
  title: string;
  subreddit_name_prefixed: string;
  ups: number;
  total_awards_received: number;
  score: number;
  all_awardings: Award[];
  id: string;
  author: string;
  num_comments: number;
  permalink: string;
}

export interface Posts {
  kind: string;
  data: Post;
}

export type Filter = "day" | "week" | "month" | "year" | "all";

export interface Comment {
  data: {
    ups: number;
    id: string;
    author: string;
    body: string;
    replies: Replies;
  };
}

export interface Replies {
  kind: string;
  data: {
    children: Comment[];
  };
}
