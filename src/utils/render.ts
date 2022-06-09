import { readDir, readTextFile, writeFile } from "@tauri-apps/api/fs";
import { type } from "@tauri-apps/api/os";
import { join, appDir } from "@tauri-apps/api/path";
import { Command } from "@tauri-apps/api/shell";

import { RenderPost } from "@interface/post";

export const render = async (post: RenderPost[]) => {
  const path = await join(
    await appDir(),
    "reddit-video-creator",
    "src",
    "data",
    "posts.json"
  );

  await writeFile({
    contents: JSON.stringify(post),
    path,
  });

  // const command = new Command("npm", [
  //   "start",
  //   "--prefix",
  //   await join(await appDir(), "reddit-video-creator"),
  // ]);
  // command.on("close", (data) => {
  //   console.log(
  //     `command finished with code ${data.code} and signal ${data.signal}`
  //   );
  // });
  // command.on("error", (error) => console.error(`command error: "${error}"`));
  // command.stdout.on("data", (line) => console.log(`command stdout: "${line}"`));
  // command.stderr.on("data", (line) => console.log(`command stderr: "${line}"`));
  // await command.spawn();
};
