import { join } from "path";

import { tempPath, cliPath } from "@config/paths";
import { Colors, Post } from "@interface/reddit";

import { copyFolderRecursiveSync, logger } from "@utils/helpers";
import { Dispatch, SetStateAction } from "react";

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
  comments: { [x: string]: any }[],
  exportPath: string,
  setProgress: Dispatch<SetStateAction<number>>,
  setTotalProgress: Dispatch<SetStateAction<number>>,
  setVideoPath: Dispatch<SetStateAction<string | null>>,
  colors: Colors
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
        colors,
      })
    );

    const voice = localStorage.getItem("voice");

    return new Promise(async (resolve) => {
      logger("Rendering Video", "action");

      const cliPath = join(tempPath, "cli");
      const renderPath = join(cliPath, "render", "render.exe");

      const args = [
        // `BALCON=${balconPath}`,
        // `FFMPEG=${ffmpegPath}`,
        // `FFPROBE=${ffprobePath}`,
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
      }).stdout.on("data", (data: string) => {
        if (data.includes("process-count=")) {
          setTotalProgress((prevState) => {
            if (prevState !== 0) {
              return prevState;
            }

            return parseInt(data.split("=")[1]);
          });
        }

        if (data.includes("-generated")) {
          setProgress((prevState) => {
            return prevState + 1;
          });
        }

        if (data.includes("process-done")) {
          const path = data.split("=")[1];
          setVideoPath(path);
        }
      });
    });
  } catch (err) {
    console.log(err);
  }
};
