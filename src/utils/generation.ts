import { join } from "path";

import { tempPath, cliPath, buildPath } from "@config/paths";
import { Colors, Post, PostFile } from "@interface/reddit";

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
  comments: {
    content: string;
    user: string;
    depth: number;
    score: number;
  }[],
  exportPath: string,
  setProgress: Dispatch<SetStateAction<number>>,
  setTotalProgress: Dispatch<SetStateAction<number>>,
  setVideoPath: Dispatch<SetStateAction<string | null>>,
  colors: Colors,
  poster: string
): Promise<any> => {
  try {
    if (!existsSync(tempPath)) {
      mkdirSync(tempPath);
    }

    copyFolderRecursiveSync(cliPath, tempPath);
    copyFolderRecursiveSync(join(buildPath, "music"), tempPath);

    const postPath = join(tempPath, "post.json");

    const outro = localStorage.getItem("outro");
    const outroImage = localStorage.getItem("outro-image");
    const ffmpeg = localStorage.getItem("ffmpeg");
    const ffprobe = localStorage.getItem("ffprobe");
    const balcon = localStorage.getItem("balcon");
    const bal4web = localStorage.getItem("bal4web");
    const voice = localStorage.getItem("voice");

    const configHandler = (value: string | null) =>
      value && value !== "" && existsSync(value) ? value : null;

    const postFile: PostFile = {
      post,
      comments,
      exportPath,
      colors,
      poster,
      voice,
      cli: {
        ffmpeg: configHandler(ffmpeg),
        ffprobe: configHandler(ffprobe),
        balcon: configHandler(balcon),
        bal4web: configHandler(bal4web),
      },
      customAudio: true,
      audioTrimDuration: 0.8,
      outro: configHandler(outro),
      outroImage: configHandler(outroImage),
    };

    writeFileSync(postPath, JSON.stringify(postFile));

    return new Promise(async (resolve) => {
      logger("Rendering Video", "action");

      const cliPath = join(tempPath, "cli");
      const renderPath = join(cliPath, "render.exe");

      await execFile(
        renderPath,
        [`POST=${postPath}`],
        (error: any, stdout: string) => {
          if (error) {
            logger("Video couldn't render successfully", "error");
            throw error;
          }

          logger("Video rendered successfully", "success");

          resolve(stdout);
        }
      ).stdout.on("data", (data: string) => {
        console.log(data);

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
