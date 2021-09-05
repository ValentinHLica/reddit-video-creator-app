import { join } from "path";
import { cwd } from "process";

import Jimp from "jimp";

import { logger } from "@utils/helpers";

import { FontFace } from "@interface/image";

const fontPath = join(cwd(), "src", "assets", "font");

const imageDetails = {
  width: 1920,
  height: 1080,
  background: "#121112",
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
    userName?: string;
    points?: number;
  },
  path: string
) => {
  logger("Generating Image", "action");

  try {
    new Jimp(
      imageDetails.width,
      imageDetails.height,
      imageDetails.background,
      async (err, image) => {
        const font = await Jimp.loadFont(join(fontPath, FontFace.Regular));

        image.print(font, 10, 10, post.title, 600);

        await image.writeAsync(path);
      }
    );
  } catch (err) {
    console.log(err);
    logger("Image couldn't generate successfully", "error");
  }

  logger("Image generated successfully", "success");
};
