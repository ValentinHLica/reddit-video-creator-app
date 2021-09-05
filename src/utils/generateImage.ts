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

  return new Jimp(width, imageHeight, async (err, image) => {
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
  });
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
    new Jimp(
      imageDetails.width,
      imageDetails.height,
      imageDetails.background,
      async (err, image) => {
        const font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);

        image.print(font, 10, 10, text);

        await image.writeAsync(path);
      }
    );
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
 * @param {string} path Image export path
 * @returns
 */
export const createPostTitle = async (
  post: {
    title: string;
    userName: string;
    points: string;
  },
  path: string
) => {
  logger("Generating Image", "action");

  try {
    const voting = await generateVoting(80, post.points);

    new Jimp(
      imageDetails.width,
      imageDetails.height,
      imageDetails.background,
      async (err, image) => {
        const font = await Jimp.loadFont(join(fontPath, FontFace.MediumTitle));

        const maxWidth = imageDetails.width - 200;
        const textHeight = Jimp.measureTextHeight(font, post.title, maxWidth);

        image.print(
          font,
          (imageDetails.width - maxWidth) / 2 + 50,
          (imageDetails.height - textHeight) / 2,
          post.title,
          maxWidth
        );

        image.composite(
          voting,
          (imageDetails.width - maxWidth) / 2 - 50,
          (imageDetails.height - textHeight) / 2 + 10
        );

        await image.writeAsync(path);
      }
    );
  } catch (err) {
    console.log(err);
    logger("Image couldn't generate successfully", "error");
  }

  logger("Image generated successfully", "success");
};
