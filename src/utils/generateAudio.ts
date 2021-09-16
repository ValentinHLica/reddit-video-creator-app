import { execFile } from "child_process";
import { join } from "path";

import { getAudioDurationInSeconds } from "get-audio-duration";

import { logger } from "../utils/helpers";

// Path for balcon cli
const cliPath = join(__dirname, "..", "cli", "balcon", "balcon.exe");

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
      cliPath,
      ["-t", text, "-w", path, "-n", "ScanSoft"],
      async (error, stdout) => {
        if (error) {
          logger("Audio couldn't generate successfully", "error");
          throw error;
        }

        logger("Audio generated successfully", "success");
        resolve(await getAudioDurationInSeconds(path));
      }
    );
  });
};

export default generateAudio;
