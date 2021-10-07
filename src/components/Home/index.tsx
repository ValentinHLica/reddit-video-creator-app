import React, { Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import Layout from "@components/Layout";
import { CardWrapper, Card, Button, Modal, Tabs } from "@ui";
import AddFavourite from "./AddFavourite";
import CreatedComments from "./CreatedComments";
import Bookmarked from "./Bookmarked";
import { AddIcon, HeartIcon, UserIcon, ZapIcon } from "@icon";

import { logger, roundUp } from "@utils/helpers";

import { SearchItem } from "@interface/reddit";

import styles from "@styles/Home/index.module.scss";

const HomePage: React.FC = () => {
  const history = useHistory();

  const [subreddits, setSubreddits] = useState<SearchItem[]>([]);
  const [modal, setModal] = useState<boolean>(false);

  const fetchFav = () => {
    const data = localStorage.getItem("favourite");

    if (data) {
      try {
        const favourite = JSON.parse(data) as SearchItem[];

        setSubreddits(
          favourite.map((item: SearchItem) => ({ ...item, added: true }))
        );
      } catch (err) {
        logger("Data saved in localStorage is corrupted!", "error");
      }
    }
  };

  const removeSubreddit = (item: SearchItem) => {
    const newFav = subreddits.filter((subreddit) => subreddit.url !== item.url);

    setSubreddits(newFav);

    try {
      localStorage.setItem("favourite", JSON.stringify(newFav));
    } catch (error) {
      logger("Data saved in localStorage is corrupted!", "error");
    }
  };

  useEffect(() => {
    fetchFav();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <div className={styles.container}>
        {/* <Updater /> */}

        <Tabs
          tabs={[
            {
              text: "Favourite",
              content:
                subreddits.length !== 0 ? (
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
                                icon: <ZapIcon />,
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
                      icon={<AddIcon />}
                    />
                  </Fragment>
                ) : (
                  <div className={styles.container__empty}>
                    <Button
                      onClick={setModal.bind(this, true)}
                      text="Add New Favourite"
                      icon={<AddIcon />}
                    />
                  </div>
                ),
            },
            {
              text: "Bookmark",
              content: <Bookmarked />,
            },
            {
              text: "Created",
              content: <CreatedComments />,
            },
          ]}
        />
      </div>

      {/* <Link to="/test">Test</Link> */}

      <Modal visible={modal} setModal={setModal}>
        <AddFavourite
          favourite={subreddits}
          favouriteSubreddit={setSubreddits}
        />
      </Modal>
    </Layout>
  );
};

export default HomePage;
