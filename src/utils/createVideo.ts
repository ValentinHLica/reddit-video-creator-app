import { execFile } from "child_process";

// Path for ffmpeg cli
const cliPath = "./src/cli/ffmpeg/ffmpeg.exe";

/**
 * Generate Video from image and audio
 *
 * @param {string} image Path for image file
 * @param {string} audio Path for audio file
 * @param {string} path Export video path
 * @param {number} duration Video duration
 */
export const generateVideo = async (
  image: string,
  audio: string,
  path: string,
  duration: number
) => {
  execFile(
    cliPath,
    [
      "-loop",
      "1",
      "-i",
      image,
      "-i",
      audio,
      "-c:v",
      "libx264",
      "-tune",
      "stillimage",
      "-c:a",
      "aac",
      "-b:a",
      "192k",
      "-pix_fmt",
      "yuv420p",
      "-shortest",
      "-t",
      duration.toString(),
      path,
    ],
    (error, stdout) => {
      if (error) {
        throw error;
      }
      console.log(stdout);
    }
  );
};
