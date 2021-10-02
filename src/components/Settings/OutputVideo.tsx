import React, { useEffect, useState } from "react";

import { Button, Input } from "@ui";
import Card from "./ItemCard";
import { FolderIcon } from "@icon";

import styles from "@styles/Settings/output.module.scss";

const { dialog } = window.require("@electron/remote");
const { existsSync } = window.require("fs");

const OutputVideo: React.FC = () => {
  const [outputPath, setOutputPath] = useState<string | null>(null);

  const getPath = async () => {
    const path = await dialog.showOpenDialog({
      properties: ["openDirectory"],
    });

    return path.filePaths[0];
  };

  const updatePath = async () => {
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
    <Card title="Video Output">
      <div className={styles.container}>
        <Input readOnly placeholder={outputPath ?? ".."} size="xs" />

        <Button
          onClick={updatePath}
          size="xs"
          text="Change Folder"
          icon={<FolderIcon />}
        />
      </div>
    </Card>
  );
};

export default OutputVideo;
