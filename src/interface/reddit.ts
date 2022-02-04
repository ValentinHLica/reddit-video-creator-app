export interface Subreddit {
  display_name: string;
  title: string;
  display_name_prefixed: string;
  subscribers: number;
  public_description: string;
  id: string;
  url: string;
  added?: boolean;
}

export interface Search {
  kind: string;
  data: Subreddit;
}

export interface Pagination {
  next: null;
  before: null;
}

export interface Award {
  count: number;
  name: string;
  icon_url: string;
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
  added?: boolean;
  created?: boolean;
  selftext?: string;
}

export interface Posts {
  kind: string;
  data: Post;
}

export type Filter = "hot" | "new" | "top" | "rising";

export type TopFilter = "day" | "week" | "month" | "year" | "all";

export type Controls = {
  filter: Filter;
  topFilter?: TopFilter;
};

export type ControlsListItem = {
  icon?: JSX.Element;
  text: string;
  onClick: () => void;
};

export type ControlsList = {
  icon: JSX.Element;
  text: Filter;
  items?: ControlsListItem[];
};

export interface Comment {
  ups: number;
  id: string;
  author: string;
  body: string;
  replies?: Replies | "";
  parent_id?: string;
  score: number;
  all_awardings: Award[];
  created_utc: number;
  depth: number;
  selected?: boolean;
  collapse?: boolean;
  visible?: boolean;
}

export interface CommentWrapper {
  kind: string | "more";
  data: Comment;
}

export interface Replies {
  kind: string | "more";
  data: {
    after: string;
    children: CommentWrapper[] | string[];
    before: string;
  };
}

export type BookmarkPost = {
  [subredditId: string]: {
    [postSlug: string]: {
      created?: Date | null;
      minutes?: number;
      bookmarked: boolean;
      comments?: {
        [commentId: string]: true;
      };
      post: Post;
    };
  };
};

export interface Created extends Post {
  isBookmarked: boolean;
}

export interface Colors {
  subreddit: string;
  background: string;
  color: string;
}

export interface PostFile {
  post: Post;
  comments: {
    content: string;
    user: string;
    depth: number;
    score: number;
  }[];
  exportPath: string;
  colors: Colors;
  poster: string | null;
  voice: string | null;
  cli: {
    ffprobe: string | null;
    ffmpeg: string | null;
    balcon: string | null;
    bal4web: string | null;
  };
  customAudio: boolean;
  audioTrimDuration: number;
  outro: string | null;
  outroImage: string | null;
}
