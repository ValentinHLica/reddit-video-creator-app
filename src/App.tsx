import React from "react";

const path = window.require("path");
const { app } = window.require("@electron/remote");

const App: React.FC = () => {
  const tempPath = path.join(app.getAppPath(), "..", "temp");

  return <div>{tempPath}</div>;
};

export default App;
