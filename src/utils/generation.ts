import { join } from "path";

import {
  assetsPath,
  dataPath,
  tempPath,
  balconPath,
  ffmpegPath,
  ffprobePath,
  renderPath,
} from "@config/paths";
import { Post } from "@interface/reddit";
import { Comment } from "@interface/video";

import { logger } from "@utils/helpers";

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
  exportPath: string,
  options: {
    signal: AbortSignal;
  }
): Promise<any> => {
  try {
    if (!existsSync(tempPath)) {
      mkdirSync(tempPath);
    }

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

    return new Promise((resolve) => {
      logger("Rendering Video", "action");

      const args = [
        `BALCON=${balconPath}`,
        `FFMPEG=${ffmpegPath}`,
        `FFPROBE=${ffprobePath}`,
        `DATA=${dataPath}`,
        `ASSETS=${assetsPath}`,
        `POST=${postPath}`,
        ...(() => (voice ? [`VOICE=${voice}`] : []))(),
      ];

      execFile(renderPath, args, options, (error: any, stdout: string) => {
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
