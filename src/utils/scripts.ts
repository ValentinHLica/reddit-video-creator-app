import { readDir, writeFile } from "@tauri-apps/api/fs";
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
      "https://github.com/ValentinHLica/reddit-video-creator.git",
      tmpRenderPath,
    ]);

    console.log("cloning");

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
  } else {
    const command = new Command("git", ["-C", tmpRenderPath, "pull"]);

    console.log("pulling");

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
  }

  console.log("installing");

  try {
    const commandInstall = new Command("npm", ["i", "--prefix", tmpRenderPath]);

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

    await commandInstall.execute();
  } catch (error) {
    writeFile({
      contents: error as string,
      path: await join(tmpRenderPath, "test.txt"),
    });
  }
};
