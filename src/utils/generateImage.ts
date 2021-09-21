import { join } from "path";
import JimpType from "jimp";

import { splitComment, getFolders, createRandomString } from "../utils/helpers";
import generateAudio from "../utils/generateAudio";
import { generateVideo } from "../utils/createVideo";

import { FontFace } from "../interface/image";
import { Comment, Comments } from "../interface/video";

const Jimp = window.require("jimp");
const { app } = window.require("@electron/remote");

const assetsPath = join(app.getAppPath(), "build", "assets");
const fontPath = join(assetsPath, "font");
const imagePath = join(assetsPath, "images");
const tempPath = join(app.getAppPath(), "..", "temp");

const imageDetails = {
  width: 1920,
  height: 1080,
  background: "#121112",
};

const commentDetails = {
  margin: 50,
  indentation: 100,
  heightMargin: 200,
  widthMargin: 200,
};

/**
 * Generate voting image
 *
 * @param {number} width Voting Width
 * @param {string} voteCount Voting count
 */
export const generateVoting = async (
  width: number,
  voteCount: string | undefined
) => {
  const arrowImage = await Jimp.read(join(imagePath, "arrow.png"));
  const arrowWidth = width - 30;
  const arrow = arrowImage.resize(arrowWidth, arrowWidth);

  const imageHeight = width * 2 + (voteCount ? 50 : 10);

  const image = new Jimp(width, imageHeight);

  const font = await Jimp.loadFont(join(fontPath, FontFace.Medium));

  if (voteCount) {
    const textWidth = Jimp.measureText(font, voteCount);
    const textHeight = Jimp.measureTextHeight(font, voteCount, width);

    image.print(
      font,
      (width - textWidth) / 2,
      imageHeight / 2 - textHeight,
      voteCount
    );
  }

  image.composite(arrow, (width - arrowWidth) / 2, 0);

  const downArrow = arrow.rotate(180);
  image.composite(downArrow, (width - arrowWidth) / 2, imageHeight - width);

  await image.writeAsync(join(tempPath, "image.png"));
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
 * @returns
 */
export const createPostTitle = async (post: {
  title: string;
  userName: string;
  points: string;
  awards: string[];
}) => {
  try {
    const image = new Jimp(
      imageDetails.width,
      imageDetails.height,
      imageDetails.background
    );

    const voting = await generateVoting(80, post.points);

    const font = await Jimp.loadFont(join(fontPath, FontFace.MediumTitle));

    const maxWidth = imageDetails.width - commentDetails.widthMargin;
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
    const userName = `Posted by /u/${post.userName}`;
    const smallFont = await Jimp.loadFont(join(fontPath, FontFace.Medium));
    const usernameWidth = Jimp.measureText(smallFont, userName);

    image.print(
      smallFont,
      (imageDetails.width - maxWidth) / 2 + 50,
      (imageDetails.height - titleHeight) / 2 - 50,
      userName,
      maxWidth
    );

    // Add post award images
    const awardsPath = join(__dirname, "../assets", "images", "reddit-awards");
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

    // Read text
    const folders = await getFolders(tempPath);

    const folderPath = join(
      tempPath,
      `${folders.length}-${createRandomString(4)}`
    );

    const imagePath = join(folderPath, "image.jpg");
    const audioPath = join(folderPath, "audio.wav");

    // Write image
    await image.writeAsync(imagePath);

    const duration = await generateAudio(post.title, audioPath);

    await generateVideo(imagePath, audioPath, folderPath, duration);
  } catch (err) {
    console.log(err);
  }
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

  const font = await Jimp.loadFont(join(fontPath, FontFace.Medium));

  // Get Text Width, Height and Indentation
  const measure = (comment: Comments) => {
    const commentWidth =
      imageDetails.width -
      commentDetails.widthMargin -
      indentation * commentDetails.indentation;
    const commentHeight = Jimp.measureTextHeight(
      font,
      comment.text,
      commentWidth
    );

    comment.text = splitComment(comment.text as string);
    comment.width = commentWidth;
    comment.height = commentHeight;
    comment.indentation = indentation;

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

  let transformedComments: Comment[] = [];

  const transformComments = (comment: Comments) => {
    transformedComments.push({
      text: comment.text,
      width: comment.width,
      height: comment.height,
      indentation: comment.indentation,
      userName: comment.userName,
    });

    for (let i = 0; i < comment.subComment.length; i++) {
      const element = comment.subComment[i];

      transformComments(element);
    }
  };

  transformComments(comments);

  const commentList: Comment[] = [];
  let maxHeight = imageDetails.height - commentDetails.heightMargin;

  const splitComments = (comment: Comment) => {
    let mergedText: string[] = [];

    for (let i = 0; i < comment.text.length; i++) {
      const text = comment.text[i];

      mergedText.push(text);

      const commentWidth =
        imageDetails.width -
        commentDetails.widthMargin -
        (comment.indentation as number) * commentDetails.indentation;
      const commentHeight = Jimp.measureTextHeight(
        font,
        mergedText.join(" "),
        commentWidth
      );

      if (maxHeight - commentHeight < 0) {
        const slicedText = mergedText.slice(0, -1);
        const slicedComments = Jimp.measureTextHeight(
          font,
          slicedText.join(" "),
          commentWidth
        );

        commentList.push({
          ...comment,
          text: slicedText,
          height: slicedComments,
        });

        mergedText = [];

        maxHeight = imageDetails.height - commentDetails.heightMargin;

        const unUsedText = comment.text.slice(i) as string[];
        const unUsedComment = Jimp.measureTextHeight(
          font,
          unUsedText.join(" "),
          commentWidth
        );

        splitComments({
          text: unUsedText,
          height: unUsedComment,
          width: comment.width,
          indentation: comment.indentation,
          userName: comment.userName,
        });
      }
    }

    if (mergedText.length !== 0) {
      commentList.push(comment);
    }
  };

  for (const comment of transformedComments) {
    if (maxHeight - (comment.height as number) > 0) {
      commentList.push(comment);
      maxHeight -= comment.height as number;
    } else {
      splitComments(comment);
    }
  }

  let newMaxHeight = imageDetails.height - commentDetails.heightMargin;
  const newTransformedComments: Comment[][] = [];
  let newCommentList: Comment[] = [];

  for (const comment of commentList) {
    if (newMaxHeight - (comment.height as number) > 0) {
      newCommentList.push(comment);
      newMaxHeight -= comment.height as number;
    } else {
      newTransformedComments.push(newCommentList);
      newMaxHeight =
        imageDetails.height -
        commentDetails.heightMargin -
        (comment.height as number);
      newCommentList = [comment];
    }
  }

  newTransformedComments.push(newCommentList);

  return newTransformedComments;
};

export const createCommentImage = async (commentsList: Comment[][]) => {
  try {
    const font = await Jimp.loadFont(join(fontPath, FontFace.Medium));
    const fontLight = await Jimp.loadFont(join(fontPath, FontFace.Light));
    const indentationLine = await Jimp.read(
      join(imagePath, "comment-line.png")
    );

    for (const comments of commentsList) {
      let totalHeight = 0;
      for (const comment of comments) {
        totalHeight += comment.height as number;
      }

      const image = new Jimp(
        imageDetails.width,
        imageDetails.height,
        imageDetails.background
      );

      let currentHeight =
        (imageDetails.height - totalHeight) / 2 -
        (comments.length - 1) * commentDetails.margin;

      let addedText: string;

      const writeText = async (
        comment: Comment,
        image: JimpType
      ): Promise<JimpType> => {
        const textX =
          (imageDetails.width - (comment.width as number)) / 2 +
          (comment.indentation as number) * commentDetails.indentation;

        // Write username
        const userNameText = `/u/${comment.userName}`;
        const userNameWidth = Jimp.measureText(fontLight, userNameText);
        const userNameHeight = Jimp.measureTextHeight(
          fontLight,
          userNameText,
          userNameWidth
        );

        // Print text
        image.print(
          fontLight,
          textX,
          currentHeight - userNameHeight,
          userNameText
        );

        if (typeof comment.text === "string") {
          image.print(font, textX, currentHeight, comment.text, comment.width);

          // Composite indentation line
          indentationLine.resize(5, comment.height as number);
          image.composite(indentationLine, textX - 20, currentHeight);

          currentHeight += (comment.height as number) + commentDetails.margin;

          return image;
        }

        const writtenText = addedText ? addedText : comment.text[0];

        image.print(font, textX, currentHeight, comment.text[0], comment.width);

        const textHeight = Jimp.measureTextHeight(
          fontLight,
          comment.text[0],
          comment.width as number
        );

        // Composite indentation line
        indentationLine.resize(5, textHeight);
        image.composite(indentationLine, textX - 20, currentHeight);

        const mergedText = `${comment.text[0]}${
          comment.text[1] ? ` ${comment.text[1]}` : ""
        }`;

        addedText = comment.text[1] ?? undefined;

        comment.text =
          comment.text.length > 1
            ? [mergedText, ...comment.text.slice(2)]
            : mergedText;

        const folders = await getFolders(tempPath);

        const folderPath = join(
          tempPath,
          `${folders.length}-${createRandomString(4)}`
        );

        const imagePath = join(folderPath, "image.jpg");
        const audioPath = join(folderPath, "audio.wav");

        await image.writeAsync(imagePath);

        const duration = await generateAudio(writtenText, audioPath);

        await generateVideo(imagePath, audioPath, folderPath, duration);

        return await writeText(comment, image);
      };

      for (const comment of comments) {
        await writeText(comment, image);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

/**
 * Generate single comment tree images
 *
 * @param comments Comments Object
 */
export const createPostComments = async (comments: Comments) => {
  try {
    const newComments = await measureText(comments);
    await createCommentImage(newComments);
  } catch (err) {
    console.log(err);
  }
};
