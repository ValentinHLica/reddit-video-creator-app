import React, { useEffect, useState } from "react";

import { Button, Input } from "@ui";
import { FolderIcon, ImageIcon } from "@icon";
import Card from "./ItemCard";

import styles from "@styles/Settings/output.module.scss";

const { dialog } = window.require("@electron/remote");
const { existsSync } = window.require("fs");

const OutputVideo: React.FC = () => {
  const [posterPath, setPosterPath] = useState<string | null>(null);
  const [isClicked, setIsClicked] = useState<boolean>(false);

  const getPath = async () => {
    setIsClicked(true);

    const path = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "Images", extensions: ["jpg", "png", "gif"] }],
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
      setPosterPath(path);

      localStorage.setItem("poster-path", path);
    }
  };

  useEffect(() => {
    const posterPath = localStorage.getItem("poster-path");

    if (posterPath) {
      if (existsSync(posterPath)) {
        setPosterPath(posterPath);
      }
    }
  }, []);

  return (
    <Card title={<>{<ImageIcon />} Poster Image</>}>
      <div className={styles.container}>
        <Input readOnly placeholder={posterPath ?? ".."} size="xs" />

        <Button
          onClick={updatePath}
          size="xs"
          text="Change"
          type="light"
          icon={<FolderIcon />}
        />
      </div>
    </Card>
  );
};

export default OutputVideo;
