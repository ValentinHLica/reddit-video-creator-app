// // import dotenv from "dotenv";

// // dotenv.config();

// import { join } from "path";

// import { app, BrowserWindow, Menu } from "electron";

// const clientPath = join(__dirname, "client");

// const createWindow = () => {
//   const win = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       nodeIntegration: true,
//       contextIsolation: false,
//       webSecurity: false,
//     },
//   });

//   // const mainMenu = Menu.buildFromTemplate([]);
//   // Menu.setApplicationMenu(mainMenu);

//   win.loadFile(join(clientPath, "index.html"));
// };

// app.on("ready", () => {
//   createWindow();
// });

import { mergeVideos } from "@utils/createVideo";
import { createPostComments, createPostTitle } from "@utils/generateImage";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import { join } from "path";
import { cwd } from "process";

dotenv.config();

const videoComments = {
  title:
    "You got 10 min to hide a pen from a detective. If he doesn’t find it you get $1,000,000. Where would you hide it?",
  comments: [
    {
      text: "I’ll give it to the kid who asked to borrow my gameboy it in the 4th grade and then fucking hopped on a plane and moved back to the Philippines with his family that same night. Unbeknownst to anyone in class.",
      userName: "gazmir-bardhi",
      subComment: [
        {
          text: "What a dirty trick",
          userName: "tini",
          subComment: [],
        },
        {
          text: "Get a free Game Boy with this simple trick!",
          userName: "lola",
          subComment: [],
        },
      ],
    },
    {
      text: "I'd disassemble it into its various components and put each in a different place, so even if he finds some parts he never finds the pen in its complete form.",
      userName: "john",
      subComment: [
        {
          text: "The idea that men aren't complicated; they just have simple thoughts, wants and needs.",
          userName: "tony",
          subComment: [],
        },
      ],
    },
  ],
};

const init = async () => {
  const awards = JSON.parse(
    readFileSync(join(cwd(), "src", "data", "reddit-awards.json")).toString()
  );

  await createPostTitle({
    title: videoComments.title,
    userName: "Dezmondi",
    points: "1k",
    awards: [
      awards[0].path.replace("/", ""),
      awards[1].path.replace("/", ""),
      awards[2].path.replace("/", ""),
      awards[3].path.replace("/", ""),
      awards[4].path.replace("/", ""),
    ],
  });

  for (const comments of videoComments.comments) {
    await createPostComments(comments);
  }

  mergeVideos();
};

init();
