import React from "react";

import Button from "../UI/Button";

import { generateVoting } from "../../utils/generateImage";

const HomePage: React.FC = () => {
  const test = async () => {
    await generateVoting(100, "100");
  };

  return (
    <div>
      <h1>Welcome Please Select a subreddit</h1>

      <Button onClick={test}>Action</Button>
    </div>
  );
};

export default HomePage;
