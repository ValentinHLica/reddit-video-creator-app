import React, { Fragment, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";

import { Subreddit } from "@interface/reddit";

import { CardWrapper, Card, Button, Modal, Tabs, Input } from "@ui";
import { AddIcon, HeartIcon, UserIcon, ZapIcon } from "@icon";
import Layout from "@components/Layout";
import AddFavourite from "./AddFavourite";
import CreatedComments from "./CreatedComments";
import Bookmarked from "./Bookmarked";

import { roundUp, getStorage, setStorage } from "@utils/helpers";

import styles from "@styles/Home/index.module.scss";

const HomePage: React.FC = () => {
  const history = useHistory();

  const inputEl = useRef<HTMLInputElement>(null);
  const [subreddits, setSubreddits] = useState<Subreddit[]>([]);
  const [modal, setModal] = useState<boolean>(false);

  const removeSubreddit = (item: Subreddit) => {
    const newFav = subreddits.filter((subreddit) => subreddit.url !== item.url);

    setSubreddits(newFav);

    setStorage("favourite", JSON.stringify(newFav));
  };

  const submit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (!inputEl.current) return;

    const postUrl = inputEl.current.value;

    //www.reddit.com/r/AskReddit/comments/qhvzne/what_is_the_best_couple_in_tv_history/

    if (
      postUrl?.includes("https://www.reddit.com/r/") &&
      postUrl.includes("/comments/")
    ) {
      const splitedUrl = postUrl.split("/comments/")[1].split("/");

      const subredditId = postUrl.split("/comments/")[0].split("/r/")[1];
      const commentId = splitedUrl[0];
      const commentSlugId = splitedUrl[1].replace("/", "");

      const url = `/r/${subredditId}/comments/${commentId}/${commentSlugId}`;

      history.push(url);
    }
  };

  useEffect(() => {
    const data = getStorage("favourite") as Subreddit[];

    if (data) {
      setSubreddits(data.map((item) => ({ ...item, added: true })));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <div className={styles.container}>
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
          more={
            <form onSubmit={submit}>
              <Input
                type="text"
                placeholder="Post url..."
                query={inputEl}
                size="xs"
              />

              <input type="submit" hidden={true} />
            </form>
          }
        />
      </div>

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
