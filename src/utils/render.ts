import { readDir, writeFile } from "@tauri-apps/api/fs";
import { tempdir, type } from "@tauri-apps/api/os";
import { join } from "@tauri-apps/api/path";
import { Command } from "@tauri-apps/api/shell";

import { RenderPost } from "@interface/post";

export const render = async (post: RenderPost) => {
  const path = await join(
    await tempdir(),
    "reddit-video-creator",
    "src",
    "data",
    "posts.json"
  );

  console.log(await readDir(path));

  // if (await readDir(path)) {

  // }

  // await writeFile({
  //   contents: JSON.stringify([[post]]),
  //   path,
  // });

  // await new Command("npm", ["start"]).execute();
};
