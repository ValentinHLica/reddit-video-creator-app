import { execFile } from "child_process";

import { getAudioDurationInSeconds } from "get-audio-duration";

import { logger } from "@utils/helpers";

// Path for balcon cli
const cliPath = "./src/cli/balcon/balcon.exe";

/**
 * Generate Audio from text
 *
 * @param {string} text Word that will be converted to speech
 * @param {string} path Export path for the wav file
 */
export default async (text: string, path: string): Promise<number> => {
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
        // console.log(stdout);
      }
    );
  });
};
