import { readDir } from "@tauri-apps/api/fs";
import { tempdir } from "@tauri-apps/api/os";
import { join } from "@tauri-apps/api/path";
import { Command } from "@tauri-apps/api/shell";

export const setupRender = async () => {
  const tempDir = await tempdir();
  const renderFolderName = "reddit-video-creator-render";

  const tmpRenderPath = await join(tempDir, renderFolderName);

  if (
    (await readDir(tempDir)).filter((e) => e.name === renderFolderName).length >
    0
  ) {
    // new Command("git", [
    //   "clone",
    //   "https://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@github.com/ValentinHLica/reddit-video-creator.git",
    //   tmpRenderPath,
    // ]);
  }
};
