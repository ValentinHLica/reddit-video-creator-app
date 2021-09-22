import React from "react";

const { app } = window.require("@electron/remote");
const { writeFileSync, readFileSync, existsSync, mkdirSync } =
  window.require("fs");
const { join } = window.require("path");
const favDataPath = join(
  app.getAppPath(),
  "..",
  "data",
  "favoriteSubreddit.json"
);

const PostsPage: React.FC = () => {
  const onClick = () => {
    const dataPath = join(app.getAppPath(), "..", "data");

    if (!existsSync(favDataPath)) {
      mkdirSync(dataPath);
    }

    if (!existsSync(favDataPath)) {
      writeFileSync(favDataPath, JSON.stringify(["te qr"]));
    }

    const data = JSON.parse(readFileSync(favDataPath).toString());

    console.log("Added", data);
  };

  return (
    <div>
      <button onClick={onClick}>Go</button>
    </div>
  );
};

export default PostsPage;
