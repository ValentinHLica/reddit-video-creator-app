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
    {
      text: "Hi there, welcome back here, guys.",
      userName: "john",
      subComment: [
        {
          text: "You know, I'd like to have talked about class types, we have created class person so they can create",
          userName: "tony",
          subComment: [
            {
              text: "They are talking about optional parameters.",
              userName: "tony",
              subComment: [],
            },
            {
              text: "So like other things, let's go down here and let's say my personal info function.",
              userName: "tony",
              subComment: [],
            },
          ],
        },
      ],
    },
    {
      text: "So I don't want to provide for any age and expecting that look based on info, they'll have some edge by default already provided. So I can do it in such a case. I believe age, but immediately I will get here. All right. So we can do it.We can go to our. Definition of the function to look personal info actually still on the right cells, I will shortly",
      userName: "tony",
      subComment: [
        {
          text: "And these I will provide a new line as well like this. OK, and I will specify here the default value for a person, let's say the full value will be, let's. You can see I still see here at our personal info, expected to work, a mathematical model is still Now this this parameter is optional, is marked as optional, so I don't have to provide it. You can see that I'm able to call here and look at personal info only with a name and age will be by. Refresh and they should be the age of the zero, which is a default default value, and that's that's. For example, if I specify here, here I will anchormen this I need to call it differently.",
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

  await mergeVideos("bruh");
};

init();
