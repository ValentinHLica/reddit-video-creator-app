// // import dotenv from "dotenv";
// // import { splitComment } from "@utils/helpers";

// // import { createVideo } from "@utils/createVideo";

// // dotenv.config();

// const videoComments = {
//   title:
//     "I stabbed my classmate when I was 13 and was released early 2021 after serving 7 Years in prison AMA.",
//   comments: [
//     {
//       text: "Comment 1",
//       subComment: [
//         {
//           text: "Comment 1-1",
//           subComment: [
//             {
//               text: "Comment 1-1-1",
//               subComment: [],
//             },
//             {
//               text: "Comment 1-1-2",
//               subComment: [
//                 {
//                   text: "Comment 1-1-2-1",
//                   subComment: [
//                     {
//                       text: "Comment 1-1-2-1-1",
//                       subComment: [],
//                     },
//                     {
//                       text: "Comment 1-1-2-1-2",
//                       subComment: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               text: "Comment 1-1-3",
//               subComment: [
//                 {
//                   text: "Comment 1-1-3-1",
//                   subComment: [],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           text: "Comment 1-2",
//           subComment: [],
//         },
//       ],
//     },
//     {
//       text: "Comment 2",
//       subComment: [],
//     },
//   ],
// };

// interface Obj {
//   text: string;
//   subComment: Obj[];
// }

// const timer = (time: number) => {
//   return new Promise((res) => {
//     setTimeout(() => {
//       res(null);
//     }, time);
//   });
// };

// let marginLeft = 0;

// const recursion = async (obj: Obj) => {
//   console.log(`Video: ${obj.text} and margin ${marginLeft}`);
//   await timer(1000);

//   for (let i = 0; i < obj.subComment.length; i++) {
//     if (i === 0) {
//       marginLeft++;
//     }

//     const comment = obj.subComment[i];

//     await recursion(comment);
//   }

//   if (obj.subComment.length) {
//     marginLeft--;
//   }
// };

// recursion(video.comments[0]);
