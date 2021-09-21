import { logger } from "../utils/helpers";

const { execFile } = window.require("child_process");
const { join } = window.require("path");

const { app } = window.require("@electron/remote");

// Path for balcon cli
const cliPath = join(app.getAppPath(), "build", "cli");
const balconPath = join(cliPath, "balcon", "balcon.exe");
const ffprobePath = join(cliPath, "ffmpeg", "ffprobe.exe");

const getAudioDuration = async (path: string): Promise<number> => {
  return new Promise((resolve) => {
    logger("Generating Audio", "action");

    const params = [
      "-v",
      "error",
      "-select_streams",
      "a:0",
      "-show_format",
      "-show_streams",
    ];

    execFile(
      ffprobePath,
      [...params, path],
      async (error: any, stdout: any) => {
        if (error) {
          logger("Audio couldn't generate successfully", "error");
          throw error;
        }

        const matched = stdout.match(/duration="?(\d*\.\d*)"?/);

        logger("Audio generated successfully", "success");

        if (matched && matched[1]) resolve(parseFloat(matched[1]));
      }
    );
  });
};

/**
 * Generate Audio from text
 *
 * @param {string} text Word that will be converted to speech
 * @param {string} path Export path for the wav file
 */

const generateAudio = async (text: string, path: string): Promise<number> => {
  return new Promise((resolve) => {
    logger("Generating Audio", "action");

    execFile(
      balconPath,
      ["-t", text, "-w", path, "-n", "ScanSoft"],
      async (error: any, stdout: any) => {
        if (error) {
          logger("Audio couldn't generate successfully", "error");
          throw error;
        }

        logger("Audio generated successfully", "success");

        resolve(await getAudioDuration(path));
      }
    );
  });
};

export default generateAudio;
