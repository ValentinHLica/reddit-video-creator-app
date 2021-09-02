import Jimp from "jimp";

import logger from "@utils/logger";

/**
 * Generate Image from text
 *
 * @param {string} text Text to create image
 * @param {string} path Image export path
 */
export default async (text: string, path: string) => {
  logger("Generating Image", "action");

  try {
    new Jimp(1920, 1080, async (err, image) => {
      const font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);

      image.print(font, 10, 10, text);

      await image.writeAsync(path);
    });
  } catch (err) {
    console.log(err);
    logger("Image could not generated successfully", "error");
  }

  logger("Image generated successfully", "success");
};
