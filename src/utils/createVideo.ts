import { exec, execFile } from "child_process";
import { join } from "path";
import { cwd } from "process";

import { logger, getFolders } from "@utils/helpers";

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
export const generateVideo = async (
  image: string,
  audio: string,
  path: string,
  duration: number
) => {
  logger("Creating Video", "action");

  return new Promise((resolve) => {
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

        resolve(null);
      }
    );
  });
};

/**
 * Merge All Videos together
 */
export const mergeVideos = async () => {
  logger("Merging Videos", "action");

  const tempPath = join(cwd(), "src", "temp");
  const folders = await getFolders(tempPath);
  const outPutFilePath = join(tempPath, "output.mp4");

  const videos = folders.map(
    (folder) => `echo file '${join(tempPath, folder, "video.mp4")}`
  );

  const listPath = join(tempPath, "list.txt");

  const createFileList = async () => {
    return new Promise((resolve) => {
      exec(`(${videos.join(" & ")})>${listPath}`, (error, stdout) => {
        if (error) {
          throw error;
        }

        resolve(null);
      });
    });
  };

  await createFileList();

  return new Promise((resolve) => {
    execFile(
      cliPath,
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
      (error, stdout) => {
        if (error) {
          logger("Videos couldn't merge successfully", "error");
          throw error;
        }

        logger("Videos merged successfully", "success");
        resolve(null);
      }
    );
  });
};
