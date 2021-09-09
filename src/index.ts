import { mergeVideos } from "@utils/createVideo";
import { createPostComments, createPostTitle } from "@utils/generateImage";
import dotenv from "dotenv";

dotenv.config();

const videoComments = {
  title: "Americans do you want universal healthcare? Why/why not?",
  comments: [
    {
      text: "My daughter had a fever abroad in france.",
      userName: "john",
      subComment: [
        {
          text: "That's just horrible. I was once changing jobs and my kids insurance is through me.",
          userName: "tony",
          subComment: [],
        },
      ],
    },
    {
      text: "Men don't have feelings, get scared, or cry.",
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
  await createPostTitle({
    title: videoComments.title,
    userName: "John",
    points: "100",
    awards: [],
  });

  for (const comments of videoComments.comments) {
    await createPostComments(comments);
  }

  mergeVideos();
};

init();
