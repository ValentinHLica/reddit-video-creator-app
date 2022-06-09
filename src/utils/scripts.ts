import { readDir } from "@tauri-apps/api/fs";
import { type } from "@tauri-apps/api/os";
import { join, dataDir } from "@tauri-apps/api/path";
import { Command } from "@tauri-apps/api/shell";

export const setupRender = async () => {
  // Clone Reddit Video Creator
  const tempDir = await dataDir();
  const renderFolderName = "reddit-video-creator";

  const tmpRenderPath = await join(tempDir, renderFolderName);

  const tempDirs = await readDir(tempDir);

  if (tempDirs.filter((e) => e.name === renderFolderName).length === 0) {
    const command = new Command("git", [
      "clone",
      "https://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@github.com/ValentinHLica/reddit-video-creator.git",
      tmpRenderPath,
    ]);

    command.on("close", (data) => {
      console.log(
        `command finished with code ${data.code} and signal ${data.signal}`
      );
    });
    command.on("error", (error) => console.error(`command error: "${error}"`));
    command.stdout.on("data", (line) =>
      console.log(`command stdout: "${line}"`)
    );
    command.stderr.on("data", (line) =>
      console.log(`command stderr: "${line}"`)
    );

    await command.execute();

    const commandInstall = new Command(`npm`, [
      "i",
      "--prefix",
      tmpRenderPath,
      "--force",
    ]);

    commandInstall.on("close", (data) => {
      console.log(
        `command finished with code ${data.code} and signal ${data.signal}`
      );
    });
    commandInstall.on("error", (error) =>
      console.error(`command error: "${error}"`)
    );
    commandInstall.stdout.on("data", (line) =>
      console.log(`command stdout: "${line}"`)
    );
    commandInstall.stderr.on("data", (line) =>
      console.log(`command stderr: "${line}"`)
    );

    commandInstall.execute();
  }

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
