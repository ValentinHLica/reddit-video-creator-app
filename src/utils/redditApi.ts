import {
  Search,
  TopFilter,
  Post,
  Posts,
  Comment,
  SearchItem,
  Filter,
  Pagination,
  CommentWrapper,
  Replies,
} from "@interface/reddit";

const redditUrl = "https://www.reddit.com";

/**
 * Search SubReddit
 * @param query Search Query
 */
export const search = async (
  query: string,
  page?: string
): Promise<{ pagination: Pagination; data: SearchItem[] }> => {
  const url = `${redditUrl}/search.json?q=${query}&type=sr%2Cuser${
    page ? `&after=${page}` : ""
  }`;
  const res = await fetch(url);
  const data = await res.json();

  const fileredData = data.data.children.map((item: Search) => {
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

    // todo check export also how may comments in post

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

  return {
    pagination: {
      next: data.data.after,
      before: data.data.before,
    },
    data: fileredData,
  };
};

/**
 * Get SubReddit Posts
 * @param subReddit Subreddit link
 * @param topFilter Sort Filter
 */
export const getPosts = async (
  subReddit: string,
  filter: Filter,
  topFilter?: TopFilter,
  page?: string
): Promise<{
  pagination: Pagination;
  data: Post[];
}> => {
  const url = `${redditUrl}/r/${subReddit}/${filter}.json${
    filter === "top" ? `?t=${topFilter}` : ""
  }${page ? `${filter !== "top" ? "?" : "&"}after=${page}` : ""}`;

  const res = await fetch(url);
  const data = await res.json();

  const fileredData = data.data.children.map((item: Posts): Post => {
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
        const { count, name, icon_url } = awards;
        return { count, name, icon_url };
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
      added: false,
    };
  });

  return {
    pagination: {
      next: data.data.after,
      before: data.data.before,
    },
    data: fileredData,
  };
};

/**
 * Check if reddit is online
 */
export const redditCheckup = async () => {
  // const url = `https://reddit-online-status.herokuapp.com/`;
  // const res = await fetch(url);
  // const data = await res.json();
};

/**
 * Get Post comments
 * @param subredditId SubReddit Id
 * @param commentId Comment Id
 * @param commentSlug Comment Slug
 */

export const getComments = async (
  subredditId: string,
  commentId: string,
  commentSlug: string
) => {
  const url = `${redditUrl}/r/${subredditId}/comments/${commentId}/${commentSlug}.json?sort=top`;

  const res = await fetch(url);
  const data = await res.json();

  const getPostDetails = (): Post => {
    const {
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
      selftext,
    } = data[0].data.children[0].data as Post;

    return {
      all_awardings: all_awardings.map((awards) => {
        const { count, name, icon_url } = awards;

        return { count, name, icon_url };
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
      selftext,
    };
  };

  const postDetails = getPostDetails();

  const comments: Comment[] = [];

  for (const commentTree of data[1].data.children) {
    if (commentTree.kind === "more") {
      break;
    }

    const cleanUpComment = (commentDetails: CommentWrapper) => {
      const {
        data: {
          author,
          ups,
          id,
          body,
          replies,
          all_awardings,
          created_utc,
          depth,
          parent_id,
          score,
        },
      } = commentDetails;
      comments.push({
        author,
        ups,
        id,
        body: body,
        all_awardings: all_awardings.map((awards) => {
          const { count, name, icon_url } = awards;
          return { count, name, icon_url };
        }),
        created_utc,
        depth,
        parent_id,
        score,
        selected: false,
        collapse:
          replies !== "" &&
          replies?.data.children.length !== 1 &&
          typeof replies?.data.children[0] !== "string" &&
          replies?.data.children[0].kind !== "more",
        visible: true,
      });

      if (replies !== "") {
        for (let i = 0; i < (replies as Replies).data.children.length; i++) {
          const element = (replies as Replies).data.children[
            i
          ] as CommentWrapper;

          if (element.kind !== "more") {
            cleanUpComment(element);
          }
        }
      }
    };

    cleanUpComment(commentTree);
  }

  if (postDetails.selftext !== "") {
    comments.unshift({
      ...postDetails,
      body: postDetails.selftext as string,
      created_utc: 1,
      depth: 0,
      selected: false,
      collapse: false,
      visible: true,
    });
  }

  return {
    postDetails,
    comments,
  };
};
