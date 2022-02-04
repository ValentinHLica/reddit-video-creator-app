import React, { useEffect, useState } from "react";

import { Button, Input } from "@ui";
import { FolderIcon } from "@icon";

const { dialog } = window.require("@electron/remote");
const { existsSync } = window.require("fs");

type Clis = "ffmpeg" | "ffprobe" | "balcon" | "bal4web";

const Cli: React.FC = () => {
  const [ffmpegPath, setFfmpegPath] = useState<string | null>(null);
  const [ffprobePath, setFfprobePath] = useState<string | null>(null);
  const [blaconPath, setBlaconPath] = useState<string | null>(null);
  const [bal4web, setBal4web] = useState<string | null>(null);
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const getPath = async () => {
    setIsClicked(true);

    const path = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "Clies", extensions: ["exe"] }],
    });

    setIsClicked(false);

    return path.filePaths[0];
  };

  const updatePath = async (type: Clis) => {
    if (isClicked) {
      return true;
    }

    const path = await getPath();

    if (path) {
      switch (type) {
        case "ffmpeg":
          setFfmpegPath(path);
          break;

        case "ffprobe":
          setFfprobePath(path);
          break;

        case "balcon":
          setBlaconPath(path);
          break;

        case "bal4web":
          setBal4web(path);
          break;
      }

      localStorage.setItem(type, path);
    } else {
      switch (type) {
        case "ffmpeg":
          setFfmpegPath(null);
          break;

        case "ffprobe":
          setFfprobePath(null);
          break;

        case "balcon":
          setBlaconPath(null);
          break;

        case "bal4web":
          setBal4web(path);
          break;
      }

      localStorage.removeItem(type);
    }
  };

  useEffect(() => {
    const clis: Clis[] = ["ffmpeg", "ffprobe", "balcon", "bal4web"];

    for (const cli of clis) {
      const filePath = localStorage.getItem(cli);

      if (filePath) {
        if (existsSync(filePath)) {
          switch (cli) {
            case "ffmpeg":
              setFfmpegPath(filePath);
              break;

            case "ffprobe":
              setFfprobePath(filePath);
              break;

            case "balcon":
              setBlaconPath(filePath);
              break;

            case "bal4web":
              setBal4web(filePath);
              break;
          }
        }
      }
    }
  }, []);

  return (
    <>
      <li>
        <span>
          <FolderIcon />

          <h5>FFMPEG</h5>
        </span>

        <div>
          <Input readOnly size="xs" placeholder={ffmpegPath ?? "..."} />

          <Button
            onClick={updatePath.bind(this, "ffmpeg")}
            text="Change"
            size="xs"
          />
        </div>
      </li>

      <li>
        <span>
          <FolderIcon />

          <h5>FFPROBE</h5>
        </span>

        <div>
          <Input readOnly placeholder={ffprobePath ?? "..."} size="xs" />

          <Button
            onClick={updatePath.bind(this, "ffprobe")}
            text="Change"
            size="xs"
          />
        </div>
      </li>

      <li>
        <span>
          <FolderIcon />

          <h5>Balcon</h5>
        </span>

        <div>
          <Input readOnly size="xs" placeholder={blaconPath ?? "..."} />

          <Button
            onClick={updatePath.bind(this, "balcon")}
            text="Change"
            size="xs"
          />
        </div>
      </li>

      <li>
        <span>
          <FolderIcon />

          <h5>Bal4Web</h5>
        </span>

        <div>
          <Input readOnly size="xs" placeholder={bal4web ?? "..."} />

          <Button
            onClick={updatePath.bind(this, "bal4web")}
            text="Change"
            size="xs"
          />
        </div>
      </li>
    </>
  );
};

export default Cli;
