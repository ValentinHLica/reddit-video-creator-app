import { execFile } from "child_process";

// Path for balcon cli
const cliPath = "./src/cli/balcon.exe";

/**
 * Generate Audio from text
 *
 * @param {string} text Word that will be converted to speech
 * @param {string} path Export path for the wav file
 */
export default async (text: string, path: string) => {
  execFile(
    cliPath,
    ["-t", text, "-w", path, "-n", "ScanSoft"],
    (error, stdout) => {
      if (error) {
        throw error;
      }
      console.log(stdout);
    }
  );
};
