import { execFile } from "child_process";
import { join } from "path";
import { cwd } from "process";
import { mkdirSync } from "fs";

import generateImage from "@utils/generateImage";
import generateAudio from "@utils/generateAudio";
import { logger, createRandomString, splitComment } from "@utils/helpers";

import { VideoDetails } from "@interface/video";

// Path for ffmpeg cli
const cliPath = "./src/cli/ffmpeg/ffmpeg.exe";

/**
 * Generate Video from image and audio
 *
 * @param {string} image Path for image file
 * @param {string} audio Path for audio file
 * @param {string} path Export assets path
 * @param {number} duration Video duration
 */
const generateVideo = async (
  image: string,
  audio: string,
  path: string,
  duration: number
) => {
  logger("Creating Video", "action");

  execFile(
    cliPath,
    [
      "-loop",
      "1",
      "-i",
      image,
      "-i",
      audio,
      "-c:v",
      "libx264",
      "-tune",
      "stillimage",
      "-c:a",
      "aac",
      "-b:a",
      "192k",
      "-pix_fmt",
      "yuv420p",
      "-shortest",
      "-t",
      duration.toString(),
      join(path, `video.mp4`),
    ],
    (error, stdout) => {
      if (error) {
        logger("Video couldn't create successfully", "error");
        throw error;
      }

      logger("Video created successfully", "success");
    }
  );
};

/**
 * Create single chunk video
 *
 * @param {string} prevText Previous text
 * @param {string} text Text to create video
 */
const createSingleVideo = async (
  prevText: string | null,
  text: string
): Promise<string> => {
  const assetsPath = join(cwd(), "src", "temp", createRandomString(5));

  mkdirSync(assetsPath);

  const imagePath = join(assetsPath, "image.jpg");
  const audioPath = join(assetsPath, "audio.wav");

  generateImage(`${prevText ? `${prevText} ` : ""}${text}`, imagePath);
  const duration = await generateAudio(text, audioPath);

  generateVideo(imagePath, audioPath, assetsPath, duration);

  return assetsPath;
};

/**
 * Create video
 *
 * @param {object} details Video Details
 */
export const createVideo = async (details: VideoDetails) => {};
