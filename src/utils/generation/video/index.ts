import slugify from "slugify";

import { logger, getFolders, createRandomString } from "@utils/helpers";
import { ffmpegPath, renderDir } from "@config/paths";

const { exec, execFile } = window.require("child_process");
const { join } = window.require("path");
const { writeFileSync } = window.require("fs");

/**
 * Generate Video from image and audio
 *
 * @param {string} image Path for image file
 * @param {string} audio Path for audio file
 * @param {string} path Export assets path
 * @param {number} duration Video duration
 */
export const generateVideo = async (
  image: string,
  audio: string,
  path: string,
  duration: number
) => {
  return new Promise((resolve) => {
    logger("Creating Video", "action");

    execFile(
      ffmpegPath,
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
      (error: any) => {
        if (error) {
          logger("Video couldn't create successfully", "error");
          throw error;
        }

        logger("Video created successfully", "success");

        resolve(null);
      }
    );
  });
};

/**
 * Merge All Videos together
 * @param title Post title
 * @param path Path to export final output
 */
export const mergeVideos = async (title: string, path: string) => {
  logger("Merging Videos", "action");

  const folders = getFolders(renderDir);

  let randomString = createRandomString(3);

  const postTitle = slugify(title, {
    remove: /[*+~.()'"?!:@]/g,
    lower: true,
    strict: true,
  });

  const outPutFilePath = join(path, `${postTitle}-${randomString}.mp4`);

  // const videos = folders.map(
  //   (folder) => `echo file '${join(renderDir, folder, "video.mp4")}`
  // );

  // file 'C:\Users\licav\AppData\Local\Temp\reddit-video-creator\render\0-558obq3p\video.mp4
  // file 'C:\Users\licav\AppData\Local\Temp\reddit-video-creator\render\1-ncv5m21n\video.mp4
  // file 'C:\Users\licav\AppData\Local\Temp\reddit-video-creator\render\2-8duqx6ag\video.mp4
  // file 'C:\Users\licav\AppData\Local\Temp\reddit-video-creator\render\3-xo9gvzx5\video.mp4
  // file 'C:\Users\licav\AppData\Local\Temp\reddit-video-creator\render\4-mseyigp6\video.mp4
  // file 'C:\Users\licav\AppData\Local\Temp\reddit-video-creator\render\5-15ea2hdt\video.mp4
  // file 'C:\Users\licav\AppData\Local\Temp\reddit-video-creator\render\6-gibpyck6\video.mp4
  // file 'C:\Users\licav\AppData\Local\Temp\reddit-video-creator\render\7-mh7606vz\video.mp4
  // file 'C:\Users\licav\AppData\Local\Temp\reddit-video-creator\render\8-p05m1w8l\video.mp4

  const listPath = join(renderDir, "list.txt");

  const createFileList = async () => {
    const videos = folders.map(
      (folder) => `file '${join(renderDir, folder, "video.mp4")}`
    );

    writeFileSync(listPath, videos.join(" \n"));
  };

  await createFileList();

  const merge = () =>
    new Promise((resolve) => {
      execFile(
        ffmpegPath,
        [
          "-safe",
          "0",
          "-f",
          "concat",
          "-i",
          listPath,
          "-c",
          "copy",
          outPutFilePath,
        ],
        (error: any, stdout: any) => {
          if (error) {
            logger("Videos couldn't merge successfully", "error");
            throw error;
          }

          logger("Videos merged successfully", "success");
          resolve(null);
        }
      );
    });

  await merge();

  return outPutFilePath;
};
