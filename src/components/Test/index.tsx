import React from "react";

import { Button } from "@components/UI";

import { createPost } from "@utils/generation";

import postData from "./data.json";

const TestPage: React.FC = () => {
  const createVideo = async () => {
    const outputPath = localStorage.getItem("output-path");

    await createPost(postData.post, postData.comments, outputPath as string);
  };

  return (
    <div>
      <Button onClick={createVideo}>Create Video</Button>

      <Button onClick={() => {}}>Run Script</Button>
    </div>
  );
};

export default TestPage;
