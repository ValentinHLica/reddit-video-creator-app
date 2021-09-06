import { join } from "path";
import { cwd } from "process";

import Jimp from "jimp";

import { logger } from "@utils/helpers";

import { FontFace } from "@interface/image";

const assetsPath = join(cwd(), "src", "assets");
const fontPath = join(assetsPath, "font");
const imagePath = join(assetsPath, "images");

const imageDetails = {
  width: 1920,
  height: 1080,
  background: "#121112",
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
 * Generate Image from text
 *
 * @param {string} text Text to create image
 * @param {string} path Image export path
 */
export default async (text: string, path: string) => {
  logger("Generating Image", "action");

  try {
    const image = new Jimp(
      imageDetails.width,
      imageDetails.height,
      imageDetails.background
    );

    const font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);

    image.print(font, 10, 10, text);

    await image.writeAsync(path);
  } catch (err) {
    console.log(err);
    logger("Image couldn't generate successfully", "error");
  }

  logger("Image generated successfully", "success");
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

export const generateThumbnail = async (
  post: {
    title: string;
    subreddit: string;
    awards: string[];
  },
  path: string
) => {};
