import React, { useEffect, useState } from "react";

import { Button, Input } from "@ui";
import { FolderIcon } from "@icon";

const { dialog } = window.require("@electron/remote");
const { existsSync } = window.require("fs");

const OutputVideo: React.FC = () => {
  const [outputPath, setOutputPath] = useState<string | null>(null);
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const getPath = async () => {
    setIsClicked(true);

    const path = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });

    setIsClicked(false);

    return path.filePaths[0];
  };

  const updatePath = async () => {
    if (isClicked) {
      return true;
    }

    const path = await getPath();

    if (path) {
      setOutputPath(path);

      localStorage.setItem("output-path", path);
    }
  };

  useEffect(() => {
    const outputPath = localStorage.getItem("output-path");

    if (outputPath) {
      if (existsSync(outputPath)) {
        setOutputPath(outputPath);
      }
    }
  }, []);

  return (
    <li>
      <span>
        <FolderIcon />

        <h5>Output Path</h5>
      </span>

      <div>
        <Input readOnly placeholder={outputPath ?? ".."} size="xs" />

        <Button onClick={updatePath} size="xs" text="Change" />
      </div>
    </li>
  );
};

export default OutputVideo;
