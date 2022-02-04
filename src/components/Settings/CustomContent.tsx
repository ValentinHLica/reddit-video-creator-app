import React, { useEffect, useState } from "react";

import { Button, Input } from "@ui";
import { ArrowRightIcon, ImageIcon } from "@icon";
import { existsSync } from "fs";

const { dialog } = window.require("@electron/remote");

const CustomContent: React.FC = () => {
  const [outro, setOutro] = useState<string>("");
  const [outroImage, setOutroImage] = useState<string | null>(null);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [posterPath, setPosterPath] = useState<string | null>(null);

  const onChange: (type: "outro", value: string) => void = (type, value) => {
    switch (type) {
      case "outro":
        setOutro(value);
        break;
    }

    localStorage.setItem(type, value);
  };

  const getPath = async () => {
    setIsClicked(true);

    const path = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "Images", extensions: ["png", "jpg"] }],
    });

    setIsClicked(false);

    return path.filePaths[0];
  };

  const updatePath = async (type: "mid" | "end") => {
    if (isClicked) {
      return true;
    }

    const path = await getPath();

    if (type === "end") {
      if (path) {
        setOutroImage(path);
        localStorage.setItem("outro-image", path);
      } else {
        setOutroImage(null);
        localStorage.removeItem("outro-image");
      }

      return;
    }

    if (path) {
      setPosterPath(path);
      localStorage.setItem("poster-path", path);
    } else {
      setPosterPath(null);
      localStorage.removeItem("poster-path");
    }
  };

  useEffect(() => {
    const savedOutro = localStorage.getItem("outro");
    if (savedOutro) {
      setOutro(savedOutro);
    }

    const savedOutroImage = localStorage.getItem("outro-image");
    if (savedOutroImage && existsSync(savedOutroImage)) {
      setOutroImage(savedOutroImage);
    }

    const posterPath = localStorage.getItem("poster-path");
    if (posterPath && existsSync(posterPath)) {
      setPosterPath(posterPath);
    }
  }, []);

  return (
    <>
      <li>
        <span>
          <ArrowRightIcon />

          <h5>Outro</h5>
        </span>

        <Input
          placeholder="Outro text..."
          value={outro}
          onChange={(e) => {
            onChange("outro", e.target.value);
          }}
          size="xs"
        />
      </li>

      <li>
        <span>
          <ImageIcon />

          <h5>Mid Poster</h5>
        </span>

        <div>
          <Input readOnly placeholder={posterPath ?? "..."} size="xs" />

          <Button
            onClick={updatePath.bind(this, "mid")}
            size="xs"
            text="Change"
          />
        </div>
      </li>

      <li>
        <span>
          <ImageIcon />

          <h5>Outro Image</h5>
        </span>

        <div>
          <Input readOnly placeholder={outroImage ?? "..."} size="xs" />

          <Button
            onClick={updatePath.bind(this, "end")}
            size="xs"
            text="Change"
          />
        </div>
      </li>
    </>
  );
};

export default CustomContent;
