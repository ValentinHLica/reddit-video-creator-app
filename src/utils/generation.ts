import { join } from "path";

import { tempPath, cliPath } from "@config/paths";
import { Post } from "@interface/reddit";
import { Comment } from "@interface/video";

import { copyFolderRecursiveSync, logger } from "@utils/helpers";

const { execFile } = window.require("child_process");
const { writeFileSync, existsSync, mkdirSync } = window.require("fs");

/**
 * Generate single comment tree images
 * @param title Post Title
 * @param comments Comments List
 * @param path Path to export final output
 */
export const createPost = async (
  post: Post,
  comments: Comment[],
  exportPath: string
): Promise<any> => {
  try {
    if (!existsSync(tempPath)) {
      mkdirSync(tempPath);
    }

    copyFolderRecursiveSync(cliPath, tempPath);

    const postPath = join(tempPath, "post.json");

    writeFileSync(
      postPath,
      JSON.stringify({
        post,
        comments,
        exportPath,
      })
    );

    const voice = localStorage.getItem("voice");

    return new Promise(async (resolve) => {
      logger("Rendering Video", "action");

      const cliPath = join(tempPath, "cli");
      const balconPath = join(cliPath, "balcon", "balcon.exe");
      const ffprobePath = join(cliPath, "ffmpeg", "ffprobe.exe");
      const ffmpegPath = join(cliPath, "ffmpeg", "ffmpeg.exe");
      const renderPath = join(cliPath, "render", "render.exe");

      const args = [
        `BALCON=${balconPath}`,
        `FFMPEG=${ffmpegPath}`,
        `FFPROBE=${ffprobePath}`,
        `POST=${postPath}`,
        ...(() => (voice ? [`VOICE=${voice}`] : []))(),
      ];

      await execFile(renderPath, args, (error: any, stdout: string) => {
        if (error) {
          logger("Video couldn't render successfully", "error");
          throw error;
        }

        logger("Video rendered successfully", "success");

        resolve(stdout);
      });
    });
  } catch (err) {
    console.log(err);
  }
};
