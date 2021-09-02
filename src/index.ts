import dotenv from "dotenv";

import generateImage from "@utils/generateImage";
import generateAudio from "@utils/generateAudio";
import { generateVideo } from "@utils/createVideo";

dotenv.config();

const init = async () => {
  const text = "Hello World";
  const imagePath = "./src/temp/test.jpg";
  const audioPath = "./src/temp/test.wav";

  generateImage(text, imagePath);
  const duration = await generateAudio(text, audioPath);

  generateVideo(imagePath, audioPath, "./src/temp/test.mp4", duration);
};

init();
