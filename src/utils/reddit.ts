import axios from "axios";

import {
  Post,
  Comment,
  CommentWrapper,
  Replies,
  RedditData,
  Award,
} from "../interface/post";

const redditUrl = "https://www.reddit.com";

/**
 * Convert sentence to time
 */
export const countWords = (sentence: string): number => {
  const words = sentence.split(" ");
  return parseFloat((words.length / 170).toFixed(1).replace(".0", ""));
};

/**
 * Fetch Post Data
 */
export const fetchPostData = async (url: string) => {
  console.log("📰 Fetching Post");

  // Check if Url is valid
  const { origin, pathname } = (() => {
    try {
      const postData = new URL(url);

      if (postData.origin !== redditUrl) {
        throw new Error("Invalid Post Url");
      }

      return postData;
    } catch (error) {
      throw new Error("Invalid Post Url");
    }
  })();

  // Fetch Post data
  const { data } = (await axios.get(`${origin}${pathname}.json?sort=top`)) as {
    data: RedditData;
  };

  const {
    all_awardings,
    title,
    num_comments,
    subreddit,
    selftext,
    author,
    created_utc,
    over_18,
    score,
  } = data[0].data.children[0].data;

  const postAwards = (all_awardings: Award[]) =>
    all_awardings.map((awards) => {
      const { count, name } = awards;
      return { count, name };
    });

  const postDetails: Post = {
    all_awardings: postAwards(all_awardings),
    title,
    author,
    num_comments,
    subreddit,
    selftext,
    created_utc,
    over_18,
    score,
  };

  const commentList: Comment[][] = [];
  let comments: Comment[] = [];

  for (const commentTree of data[1].data.children) {
    if (commentTree.kind === "more") {
      break;
    }

    const cleanUpComment = (commentDetails: CommentWrapper) => {
      const {
        data: {
          author,
          body,
          replies,
          all_awardings,
          created_utc,
          depth,
          score,
        },
      } = commentDetails;

      if (depth === 0) {
        if (comments.length > 0) {
          commentList.push(comments);
        }

        comments = [];
      }

      if (
        depth > 2 ||
        score < 1000 ||
        comments[depth] ||
        (body as string) === "[deleted]" ||
        (body as string) === "[removed]"
      ) {
        return;
      }

      comments.push({
        author,
        body,
        all_awardings: postAwards(all_awardings),
        created_utc,
        depth,
        score,
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

  let duration = 0;

  for (const cg of commentList) {
    for (const c of cg) {
      duration += countWords(c.body as string);
    }
  }

  return {
    post: postDetails,
    duration,
  };
};
