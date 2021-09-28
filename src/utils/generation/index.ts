import { Post } from "@interface/reddit";
import { Comment } from "@interface/video";

import { resetTemp, roundUp } from "@utils/helpers";
import { measureComments } from "@utils/generation/images/measureComments";
import { transformComments } from "@utils/generation/images/transfromComments";
import { createCommentImage } from "@utils/generation/images/image";
import { createPostTitle } from "./images/postTitle";
import { mergeVideos } from "./video";

/**
 * Generate single comment tree images
 * @param title Post Title
 * @param comments Comments List
 * @param path Path to export final output
 */
export const createPost = async (
  post: Post,
  comments: Comment[],
  path: string
): Promise<any> => {
  try {
    await resetTemp();

    await createPostTitle({
      awards: post.all_awardings.map((award) => award.name),
      points: roundUp(post.ups),
      title: post.title,
      userName: post.author,
    });

    const measuredComments = await measureComments(comments);

    const transformedComments = await transformComments(measuredComments);

    for (const comment of transformedComments) {
      await createCommentImage(comment);
    }

    return await mergeVideos(post.title, path);
  } catch (err) {
    console.log(err);
  }
};
