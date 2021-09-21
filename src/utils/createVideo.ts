import { logger, getFolders } from "../utils/helpers";

const { exec, execFile } = window.require("child_process");
const { join } = window.require("path");

const { slugify } = window.require("slugify");

const { app } = window.require("@electron/remote");

// Path for ffmpeg cli
const cliPath = join(app.getAppPath(), "build", "cli");
const ffmpegPath = join(cliPath, "ffmpeg", "ffmpeg.exe");

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
      (error: any, stdout: any) => {
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
 *
 * @param title Post title
 */
export const mergeVideos = async (title: string) => {
  logger("Merging Videos", "action");

  const tempPath = join(__dirname, "../temp");
  const folders = await getFolders(tempPath);

  const postTitle = `${slugify(title, {
    remove: /[*+~.()'"!:@]/g,
  })}.mp4`;
  const outPutFilePath = join(tempPath, postTitle);

  const videos = folders.map(
    (folder) => `echo file '${join(tempPath, folder, "video.mp4")}`
  );

  const listPath = join(tempPath, "list.txt");

  const createFileList = async () => {
    return new Promise((resolve) => {
      exec(`(${videos.join(" & ")})>${listPath}`, (error: any, stdout: any) => {
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
};
