// // import { nodeJsPath, tempPath, balconPath } from "@config/paths";
// // import { execSync } from "child_process";

// // const { exec } = window.require("child_process");
// // const { join } = window.require("path");

// // export const createAudioFiles = async () => {
// //   const nodeJS = join(nodeJsPath, "node.exe");
// //   const jsFile = join(nodeJsPath, "createAudioFiles.js");

// //   return new Promise((resolve) => {});
// // };
// // const cluster = require("cluster");
// // const { cpus } = require("os");
// // const { execFile } = require("child_process");
// // const { join } = require("path");
// // const { readdirSync, statSync } = require("fs");

// // import cluster from "cluster";

// // const tempPath = process.env.TEMP;
// // const balconPath = process.env.BALCON;

// // const getFolders = (path) => {
// //   const files = readdirSync(path) ?? [];

// //   files.sort(function (a, b) {
// //     return (
// //       statSync(join(path, a)).mtime.getTime() -
// //       statSync(join(path, b)).mtime.getTime()
// //     );
// //   });

// //   return files;
// // };

// // const folders = getFolders(tempPath);

// // const leftFolders = folders.length % cpus().length;
// // const folderPerCpu = Math.floor(folders.length / cpus().length);

// // const generateAudio = async (textPath, path) => {
// //   return new Promise((resolve) => {
// //     execFile(
// //       balconPath,
// //       ["-f", textPath, "-w", path, "-n", "ScanSoft"],
// //       async (error, stdout) => {
// //         if (error) {
// //           throw error;
// //         }

// //         resolve(null);
// //       }
// //     );
// //   });
// // };

// const init = async () => {
//   if (cluster.isMaster) {
//     console.log("vup");

//     for (const cpu of cpus()) {
//       cluster.fork();
//     }
//   } else {
//     const index = cluster.worker.id - 1;

//     console.log(index);

//     // const numOfFolders =
//     //   folderPerCpu + (index === cpus().length - 1 ? leftFolders : 0);
//     // const startIndex = index !== 0 ? index * folderPerCpu : 0;
//     // const endIndex = startIndex + numOfFolders;
//     // const listOfFolders = folders.slice(startIndex, endIndex);

//     // for (const folder of listOfFolders) {
//     //   const folderPath = join(tempPath, folder);
//     //   const textPath = join(folderPath, "text.txt");
//     //   const audioPath = join(folderPath, "audio.wav");
//     //   await generateAudio(textPath, audioPath);
//     // }
//     cluster.worker.kill();
//   }
// };

// init();

export {};
