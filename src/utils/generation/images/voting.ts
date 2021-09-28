import { join } from "path";

import Jimp from "jimp";

import { fontPath, imagePath } from "@config/paths";
import { FontFace } from "@interface/image";

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

  return image;
};
