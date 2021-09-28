import { logger } from "@utils/helpers";
import { balconPath, ffprobePath } from "@config/paths";

const { execFile } = window.require("child_process");

const getAudioDuration = async (path: string): Promise<number> => {
  return new Promise((resolve) => {
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
          throw error;
        }

        const matched = stdout.match(/duration="?(\d*\.\d*)"?/);

        if (matched && matched[1]) resolve(parseFloat(matched[1]));
      }
    );
  });
};

/**
 * Generate Audio from text
 *
 * @param {string} textPath Text Path
 * @param {string} path Export path for the wav file
 */

const generateAudio = async (
  textPath: string,
  path: string
): Promise<number> => {
  return new Promise((resolve) => {
    logger("Generating Audio", "action");

    execFile(
      balconPath,
      ["-f", textPath, "-w", path, "-n", "ScanSoft"],
      async (error: any, stdout: any) => {
        if (error) {
          logger("Audio couldn't generate successfully", "error");
          throw error;
        }

        logger("Audio generated successfully", "success");

        const duration = await getAudioDuration(path);

        resolve(duration);
      }
    );
  });
};

export default generateAudio;
