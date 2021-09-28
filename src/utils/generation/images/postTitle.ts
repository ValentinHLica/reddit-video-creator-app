import { join } from "path";

import Jimp from "jimp";

import { assetsPath, dataPath, fontPath, tempPath } from "@config/paths";
import { commentDetails, imageDetails } from "@config/image";
import { FontFace } from "@interface/image";
import { generateVoting } from "./voting";
import { getFolders, createRandomString, logger } from "@utils/helpers";
import generateAudio from "@utils/generation/audio";
import { generateVideo } from "@utils/generation/video";

const { writeFileSync, existsSync, mkdirSync, readFileSync } =
  window.require("fs");

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
export const createPostTitle = async ({
  title,
  userName,
  points,
  awards,
}: {
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

    const voting = await generateVoting(80, points);

    const font = await Jimp.loadFont(join(fontPath, FontFace.MediumTitle));

    const maxWidth = imageDetails.width - commentDetails.widthMargin;
    const titleHeight = Jimp.measureTextHeight(font, title, maxWidth);

    // Print post title
    image.print(
      font,
      (imageDetails.width - maxWidth) / 2 + 50,
      (imageDetails.height - titleHeight) / 2,
      title,
      maxWidth
    );

    // Print post username
    const userNameText = `Posted by /u/${userName}`;
    const smallFont = await Jimp.loadFont(join(fontPath, FontFace.Medium));
    const usernameWidth = Jimp.measureText(smallFont, userNameText);

    image.print(
      smallFont,
      (imageDetails.width - maxWidth) / 2 + 50,
      (imageDetails.height - titleHeight) / 2 - 50,
      userNameText,
      maxWidth
    );

    // Add post award images
    const awardsPath = join(assetsPath, "images", "reddit-awards");
    const awardsList = JSON.parse(
      readFileSync(join(dataPath, "reddit-awards.json")).toString()
    ) as {
      title: string;
      path: string;
    }[];
    const filteredAwards = awards.filter((_, index) => index < 7);

    for (let i = 0; i < filteredAwards.length; i++) {
      const award = filteredAwards[i];
      let awardImagePath: string | null = null;

      for (const item of awardsList) {
        if (item.title === award) {
          awardImagePath = item.path;
          break;
        }
      }

      if (!awardImagePath) {
        break;
      }

      if (!existsSync(join(awardsPath, awardImagePath))) {
        continue;
      }

      const awardImage: Jimp | null = await Jimp.read(
        join(awardsPath, awardImagePath)
      );

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
    const folders = getFolders(tempPath);

    const folderPath = join(
      tempPath,
      `${folders.length}-${createRandomString(4)}`
    );

    if (!existsSync(folderPath)) {
      mkdirSync(folderPath);
    }

    const imagePath = join(folderPath, "image.jpg");
    const textPath = join(folderPath, "text.txt");
    const audioPath = join(folderPath, "audio.wav");

    // Write image
    logger("Creating post title image", "action");
    const base64 = await image.getBase64Async(Jimp.MIME_JPEG);
    const base64Data = base64.replace(/^data:image\/jpeg;base64,/, "");
    writeFileSync(imagePath, base64Data, "base64");
    logger("Image created successfully", "success");

    writeFileSync(textPath, title);

    const duration = await generateAudio(textPath, audioPath);

    await generateVideo(imagePath, audioPath, folderPath, duration);
  } catch (err) {
    console.log(err);
  }
};
