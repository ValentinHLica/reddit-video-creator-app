import { join } from "path";

const { app } = window.require("@electron/remote");
const buildPath = join(app.getAppPath(), "build");
const dataPath = join(buildPath, "data");
const assetsPath = join(buildPath, "assets");
const fontPath = join(assetsPath, "font");
const imagePath = join(assetsPath, "images");
const tempPath = join(app.getPath("temp"), "reddit-video-creator");
const renderDir = join(tempPath, "render");

const cliPath = join(buildPath, "cli");
const balconPath = join(cliPath, "balcon", "balcon.exe");
const ffprobePath = join(cliPath, "ffmpeg", "ffprobe.exe");
const ffmpegPath = join(cliPath, "ffmpeg", "ffmpeg.exe");
const renderPath = join(cliPath, "render", "render.exe");

export {
  assetsPath,
  buildPath,
  fontPath,
  imagePath,
  tempPath,
  dataPath,
  balconPath,
  ffprobePath,
  ffmpegPath,
  renderPath,
  renderDir,
  cliPath,
};