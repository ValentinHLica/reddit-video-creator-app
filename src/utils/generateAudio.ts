import { execFile } from "child_process";
import { readFileSync } from "fs";

import { getAudioDurationInSeconds } from "get-audio-duration";

import logger from "@utils/logger";

// Path for balcon cli
const cliPath = "./src/cli/balcon/balcon.exe";

/**
 * Generate Audio from text
 *
 * @param {string} text Word that will be converted to speech
 * @param {string} path Export path for the wav file
 */
export default async (text: string, path: string): Promise<number> => {
  logger("Generating Audio", "action");

  execFile(
    cliPath,
    ["-t", text, "-w", path, "-n", "ScanSoft"],
    (error, stdout) => {
      if (error) {
        logger("Audio could not generated successfully", "error");
        throw error;
      }
      // console.log(stdout);
    }
  );

  logger("Audio generated successfully", "success");

  return await getAudioDurationInSeconds(path);
};
