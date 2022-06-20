import { writeFile } from "@tauri-apps/api/fs";
import { join, dataDir } from "@tauri-apps/api/path";
import { Command } from "@tauri-apps/api/shell";

import { RenderPost } from "@interface/post";
import { RenderLoading } from "@interface/post";

export const render = async (
  post: RenderPost[],
  setLoadingRender: React.Dispatch<React.SetStateAction<RenderLoading | null>>
) => {
  const path = await join(
    await dataDir(),
    "reddit-video-creator",
    "src",
    "data",
    "posts.json"
  );

  await writeFile({
    contents: JSON.stringify(post),
    path,
  });

  const command = new Command("run-npm", [
    "start",
    "--prefix",
    await join(await dataDir(), "reddit-video-creator"),
  ]);

  command.on("close", (data) => {
    setLoadingRender(null);
  });

  command.on("error", (error) => console.error(`error: "${error}"`));

  const loadingHandler = (out: string) => {
    console.log(out);

    if (out.includes("Loading:")) {
      if (out.includes("ID:")) {
        setLoadingRender({
          id: out.split("ID: ")[1].split(" ")[0],
          loading: 0,
        });
      }

      setLoadingRender((state) => {
        if (state) {
          return {
            ...state,
            loading: Number(out.split("Loading: ")[1].replace("%", "")),
          };
        }

        return null;
      });
    }
  };
  command.stdout.on("data", loadingHandler);

  command.stderr.on("data", (line) => console.log(`command stderr: "${line}"`));

  await command.spawn();
};
