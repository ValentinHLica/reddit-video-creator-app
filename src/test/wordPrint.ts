// To print words in new line

// const textWidth = post.title.split(" ");
// const spaceWidth = Jimp.measureText(font, " ");

// let max = 600;

// textWidth
//   .map((word) => {
//     return Jimp.measureText(font, word);
//   })
//   .forEach((word, index) => {
//     if (max - word >= 0) {
//       max -= word + spaceWidth;
//     } else {
//       console.log(`Word break: ${textWidth[index]}`);
//       max = 600 - word;
//     }

//     console.log(`Word: ${textWidth[index]} - ${word} with max: ${max}`);
//   });

// // const lastText = Jimp.measureText(font, post.title) % 600;
// const lineHeight = Jimp.measureTextHeight(font, post.title, 600);

// image.print(
//   font,
//   600 - max + spaceWidth * 4,
//   lineHeight + 10,
//   "Hello my name is john",
//   600
// );
