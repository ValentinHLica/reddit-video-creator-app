import React, { Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import CardWrapper from "../UI/CardWrapper";
import Card from "../UI/Card";
import Button from "../UI/Button";
import Modal from "../UI/Modal";
import AddFavourite from "./AddFavourite";
import { AddIcon, PostIcon, HeartIcon, UserIcon } from "../CustomIcons";

import { roundUp } from "../../utils/helpers";

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
  const history = useHistory();

  const [subreddits, setSubreddits] = useState<SearchItem[]>([]);
  const [modal, setModal] = useState<boolean>(false);

  const dataPath = join(app.getAppPath(), "..", "data");

  const fetchFav = () => {
    if (!existsSync(dataPath)) {
      mkdirSync(dataPath);
    }

    if (!existsSync(favDataPath)) {
      writeFileSync(favDataPath, JSON.stringify([]));
    }

    const data = JSON.parse(readFileSync(favDataPath).toString());

    setSubreddits(data.map((item: SearchItem) => ({ ...item, added: true })));
  };

  const removeSubreddit = (item: SearchItem) => {
    const newFav = subreddits.filter((subreddit) => subreddit.url !== item.url);

    setSubreddits(newFav);

    writeFileSync(favDataPath, JSON.stringify(newFav));
  };

  useEffect(() => {
    fetchFav();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <div className={styles.container}>
        <h1 className={styles.container__title}>Please Select a subreddit</h1>

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
                    actions={[
                      {
                        text: "Favourite",
                        icon: <HeartIcon added={item.added ?? false} />,
                        onClick: () => {
                          removeSubreddit(item);
                        },
                      },
                      {
                        text: "Posts",
                        icon: <PostIcon />,
                        onClick: () => {
                          history.push(item.display_name_prefixed);
                        },
                      },
                      {
                        text: `Users ${roundUp(item.subscribers)}`,
                        icon: <UserIcon />,
                        className: "user--item",
                      },
                    ]}
                  />
                );
              })}
            </CardWrapper>

            <Button
              className={styles.container__add}
              onClick={setModal.bind(this, true)}
            >
              <AddIcon />
            </Button>
          </Fragment>
        ) : (
          <div className={styles.container__empty}>
            <Button onClick={setModal.bind(this, true)}>
              <AddIcon /> Add New Favourite
            </Button>
          </div>
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
