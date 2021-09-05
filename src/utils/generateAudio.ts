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
  logger("Generating Audio", "action");

  const generateAudio = () => {
    return new Promise((resolve) => {
      execFile(
        cliPath,
        ["-t", text, "-w", path, "-n", "ScanSoft"],
        (error, stdout) => {
          if (error) {
            logger("Audio couldn't generate successfully", "error");
            throw error;
          }

          resolve(null);
          // console.log(stdout);
        }
      );
    });
  };

  await generateAudio();

  logger("Audio generated successfully", "success");

  return await getAudioDurationInSeconds(path);
};
