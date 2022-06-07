import { readDir } from "@tauri-apps/api/fs";
import { fetch } from "@tauri-apps/api/http";
import { tempdir, type } from "@tauri-apps/api/os";
import { join } from "@tauri-apps/api/path";
import { Command } from "@tauri-apps/api/shell";

export const setupRender = async () => {
  // Clone Reddit Video Creator
  const tempDir = await tempdir();
  const renderFolderName = "reddit-video-creator";

  const tmpRenderPath = await join(tempDir, renderFolderName);

  const tempDirs = await readDir(tempDir);

  if (tempDirs.filter((e) => e.name === renderFolderName).length === 0) {
    const command = new Command("git", [
      "clone",
      "https://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@github.com/ValentinHLica/reddit-video-creator.git",
      tmpRenderPath,
    ]);

    await command.execute();
  }

  await new Command(`npm`, [
    "i",
    "--prefix",
    tmpRenderPath,
    "--force",
  ]).execute();

  return;

  // Set up FFmpeg
  switch (await type()) {
    case "Darwin":
      await new Command("brew", ["install", "ffmpeg"]).execute();
      await new Command("brew", ["tap", "homebrew/cask-versions"]).execute();
      await new Command("brew", [
        "install",
        "--cask",
        "--no-quarantine",
        "wine-stable",
      ]).execute();
      break;

    case "Linux":
      await new Command("sudo", ["apt", "install", "ffmpeg"]).execute();
      // await new Command("sudo", ["apt", "install", "wine32"]).execute();
      break;

    case "Windows_NT":
      break;
  }
};
