import {
  Search,
  Filter,
  Post,
  Posts,
  Comment,
  SearchItem,
} from "../interface/reddit";

const redditUrl = "https://www.reddit.com";

/**
 * Search SubReddit
 * @param query Search Query
 */
export const search = async (query: string): Promise<SearchItem[]> => {
  const url = `${redditUrl}/search.json?q=${query}&type=sr%2Cuser`;
  const res = await fetch(url);
  const data = await res.json();

  return data.data.children.map((item: Search) => {
    const {
      data: {
        display_name,
        display_name_prefixed,
        id,
        public_description,
        subscribers,
        title,
        url,
      },
    } = item;

    return {
      display_name,
      title,
      display_name_prefixed,
      subscribers,
      public_description,
      id,
      url,
    };
  });
};

/**
 * Get SubReddit Posts
 * @param subReddit Subreddit link
 * @param filter Sort Filter
 */
export const getPosts = async (
  subReddit: string,
  filter: Filter
): Promise<Post[]> => {
  const url = `${redditUrl}/r/${subReddit}/top.json?t=${filter}`;

  const res = await fetch(url);
  const data = await res.json();

  return data.data.children.map((item: Posts) => {
    const {
      data: {
        all_awardings,
        id,
        title,
        author,
        num_comments,
        permalink,
        score,
        subreddit,
        subreddit_name_prefixed,
        total_awards_received,
        ups,
      },
    } = item;

    return {
      all_awardings: all_awardings.map((awards) => {
        const { award_sub_type, count, icon_url, name } = awards;

        return { award_sub_type, count, icon_url, name };
      }),
      id,
      title,
      author,
      num_comments,
      permalink,
      score,
      subreddit,
      subreddit_name_prefixed,
      total_awards_received,
      ups,
    };
  });
};

/**
 * Get Post comments
 * @param permalink SubReddit Post Permalink
 */

// todo clean up content to match desired input for creating video
export const getComments = async (permalink: string) => {
  const url = `${redditUrl}${permalink}.json?sort=top`;

  const res = await fetch(url);
  const data = await res.json();

  return data[1].data.children.map((item: Comment) => {
    const {
      data: { author, ups, id, body, replies },
    } = item;

    return {};
  });
};
