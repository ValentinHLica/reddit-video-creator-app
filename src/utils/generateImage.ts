import { join } from "path";
import { cwd } from "process";

import Jimp from "jimp";

import {
  logger,
  splitComment,
  getFolders,
  createRandomString,
} from "@utils/helpers";

import { FontFace } from "@interface/image";
import { Comments } from "@interface/video";

const assetsPath = join(cwd(), "src", "assets");
const fontPath = join(assetsPath, "font");
const imagePath = join(assetsPath, "images");
const tempPath = join(cwd(), "src", "temp");

const imageDetails = {
  width: 1920,
  height: 1080,
  background: "#121112",
};

const commentDetails = {
  margin: 30,
  indentation: 100,
};

/**
 * Generate voting image
 *
 * @param {number} width Voting Width
 * @param {string} voteCount Voting count
 */
export const generateVoting = async (width: number, voteCount: string) => {
  const arrowImage = await Jimp.read(join(imagePath, "arrow.png"));
  const arrowWidth = width - 30;
  const arrow = arrowImage.resize(arrowWidth, arrowWidth);

  const imageHeight = width * 2 + 50;

  const image = new Jimp(width, imageHeight);

  const font = await Jimp.loadFont(join(fontPath, FontFace.Medium));

  const textWidth = Jimp.measureText(font, voteCount);
  const textHeight = Jimp.measureTextHeight(font, voteCount, width);

  image.print(
    font,
    (width - textWidth) / 2,
    imageHeight / 2 - textHeight,
    voteCount
  );

  image.composite(arrow, (width - arrowWidth) / 2, 0);

  const downArrow = arrow.rotate(180);
  image.composite(downArrow, (width - arrowWidth) / 2, imageHeight - width);

  return image;
};

/**
 * Create Video for Reddit post title
 *
 * @param post Post details
 * @param {string} post.title Post title
 * @param {string} post.userName Post Author username
 * @param {number} post.points Post points
 * @param {Array} post.awards Array with paths to award image
 * @param {string} path Image export path
 * @returns
 */
export const createPostTitle = async (
  post: {
    title: string;
    userName: string;
    points: string;
    awards: string[];
  },
  path: string
) => {
  logger("Generating Image", "action");

  try {
    const image = new Jimp(
      imageDetails.width,
      imageDetails.height,
      imageDetails.background
    );

    const voting = await generateVoting(80, post.points);

    const font = await Jimp.loadFont(join(fontPath, FontFace.MediumTitle));

    const maxWidth = imageDetails.width - 200;
    const titleHeight = Jimp.measureTextHeight(font, post.title, maxWidth);

    // Print post title
    image.print(
      font,
      (imageDetails.width - maxWidth) / 2 + 50,
      (imageDetails.height - titleHeight) / 2,
      post.title,
      maxWidth
    );

    // Print post username
    const smallFont = await Jimp.loadFont(join(fontPath, FontFace.Medium));
    const usernameWidth = Jimp.measureText(
      smallFont,
      `Posted by /u/${post.userName}`
    );

    image.print(
      smallFont,
      (imageDetails.width - maxWidth) / 2 + 50,
      (imageDetails.height - titleHeight) / 2 - 50,
      `Posted by /u/${post.userName}`,
      maxWidth
    );

    // Add post award images
    const awardsPath = join(imagePath, "reddit-awards");
    for (let i = 0; i < post.awards.length; i++) {
      const award = post.awards[i];

      const awardImage = await Jimp.read(join(awardsPath, award));

      awardImage.resize(32, 32);

      image.composite(
        awardImage,
        (imageDetails.width - maxWidth) / 2 + 70 + usernameWidth + i * 40,
        (imageDetails.height - titleHeight) / 2 - 50 + 5
      );
    }

    // Add voting image
    image.composite(
      voting,
      (imageDetails.width - maxWidth) / 2 - 50,
      (imageDetails.height - titleHeight) / 2 + titleHeight / 2 - 80 * 2 + 50
    );

    // Write image
    await image.writeAsync(path);
  } catch (err) {
    console.log(err);
    logger("Image couldn't generate successfully", "error");
  }

  logger("Image generated successfully", "success");
};

// export const generateThumbnail = async (
//   post: {
//     title: string;
//     subreddit: string;
//     awards: string[];
//   },
//   path: string
// ) => {};

/**
 * Get Width, Height and Indentation for each comment
 *
 * @param comments Post Comment Tree
 * @returns Post Comment Tree with width, height and indentation for each comment
 */
export const measureText = async (comments: Comments) => {
  let indentation: number = 0;
  let totalHeight: number = 0;
  let commentCount: number = 0;

  const font = await Jimp.loadFont(join(fontPath, FontFace.Medium));

  const measure = (comment: Comments) => {
    const commentWidth =
      imageDetails.width - 200 - indentation * commentDetails.indentation;
    const commentHeight = Jimp.measureTextHeight(
      font,
      comment.text,
      commentWidth
    );

    comment.text = splitComment(comment.text as string);
    comment.width = commentWidth;
    comment.height = commentHeight;
    comment.indentation = indentation;

    totalHeight += commentHeight;
    commentCount++;

    for (let i = 0; i < comment.subComment.length; i++) {
      if (i === 0) {
        indentation++;
      }

      measure(comment.subComment[i]);
    }

    if (comment.subComment.length) {
      indentation--;
    }

    return comment;
  };

  measure(comments);

  // Todo
  // Split comments into two arrays if text overflows screen

  return { comments, totalHeight, commentCount };
};

export const createCommentImage = async ({
  comments,
  totalHeight,
  commentCount,
}: {
  comments: Comments;
  totalHeight: number;
  commentCount: number;
}) => {
  try {
    let currentHeight =
      (imageDetails.height - totalHeight) / 2 -
      (commentCount - 1) * commentDetails.margin;

    const image = new Jimp(
      imageDetails.width,
      imageDetails.height,
      imageDetails.background
    );

    const font = await Jimp.loadFont(join(fontPath, FontFace.Medium));

    const writeText = async (comment: Comments, image: Jimp): Promise<Jimp> => {
      if (typeof comment.text === "string") {
        image.print(
          font,
          (imageDetails.width - (comment.width as number)) / 2 +
            (comment.indentation as number) * commentDetails.indentation,
          currentHeight,
          comment.text,
          comment.width
        );

        currentHeight += (comment.height as number) + commentDetails.margin;

        return image;
      }

      image.print(
        font,
        (imageDetails.width - (comment.width as number)) / 2 +
          (comment.indentation as number) * 100,
        currentHeight,
        comment.text[0],
        comment.width
      );

      const mergedText = `${comment.text[0]}${
        comment.text[1] ? ` ${comment.text[1]}` : ""
      }`;

      comment.text =
        comment.text.length > 2
          ? [mergedText, ...comment.text.slice(2)]
          : mergedText;

      const folders = await getFolders(tempPath);

      const folderPath = join(
        tempPath,
        `${folders.length}-${createRandomString(4)}`
      );

      await image.writeAsync(join(folderPath, "image.jpg"));

      return await writeText(comment, image);
    };

    const recursion = async (comment: Comments) => {
      await writeText(comment, image);

      for (let i = 0; i < comment.subComment.length; i++) {
        await recursion(comment.subComment[i]);
      }
    };

    await recursion(comments);
  } catch (err) {
    console.log(err);
    logger("Comment Image couldn't generate successfully", "error");
  }
};

/**
 * Generate single comment tree images
 *
 * @param comments Comments Object
 */
export const createPostComments = async (comments: Comments) => {
  logger("Generating Comments Images", "action");

  try {
    const newComments = await measureText(comments);

    await createCommentImage(newComments);
  } catch (err) {
    console.log(err);
    logger("Images couldn't generate successfully", "error");
  }

  logger("Images generated successfully", "success");
};
