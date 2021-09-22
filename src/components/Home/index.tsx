import React, { Fragment, useEffect, useState } from "react";

import CardWrapper from "../UI/CardWrapper";
import Card from "../UI/Card";
import Button from "../UI/Button";
import Modal from "../UI/Modal";
import AddFavourite from "./AddFavourite";

import { SearchItem } from "../../interface/reddit";

import styles from "../../styles/components/Home/index.module.scss";

const { app } = window.require("@electron/remote");
const { readFileSync, existsSync, mkdirSync, writeFileSync } =
  window.require("fs");
const { join } = window.require("path");
const favDataPath = join(
  app.getAppPath(),
  "..",
  "data",
  "favoriteSubreddit.json"
);

const HomePage: React.FC = () => {
  const [subreddits, setSubreddits] = useState<SearchItem[]>([]);
  const [modal, setModal] = useState<boolean>(false);

  const dataPath = join(app.getAppPath(), "..", "data");

  const fetchFav = async () => {
    if (!existsSync(dataPath)) {
      mkdirSync(dataPath);
    }

    if (!existsSync(favDataPath)) {
      writeFileSync(favDataPath, JSON.stringify([]));
    }

    const data = JSON.parse(readFileSync(favDataPath).toString());

    setSubreddits(data);
  };

  useEffect(() => {
    fetchFav();
  }, []);

  return (
    <Fragment>
      <div className={styles.container}>
        <h1 className={styles.container__title}>
          Welcome Please Select a subreddit
        </h1>

        {subreddits.length !== 0 ? (
          <Fragment>
            <CardWrapper>
              {subreddits.map((item, index) => {
                return (
                  <Card
                    key={index}
                    title={item.display_name}
                    author={item.display_name}
                    route="/r"
                    desc={item.public_description}
                  />
                );
              })}
            </CardWrapper>

            <Button onClick={setModal.bind(this, true)}>Add Subreddit</Button>
          </Fragment>
        ) : (
          <Button onClick={setModal.bind(this, true)}>Add Subreddit</Button>
        )}
      </div>

      <Modal visible={modal} setModal={setModal}>
        <AddFavourite
          favourite={subreddits}
          favouriteSubreddit={setSubreddits}
        />
      </Modal>
    </Fragment>
  );
};

export default HomePage;
