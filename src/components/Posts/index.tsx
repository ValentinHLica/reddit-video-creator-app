import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import Controls from "./Controls";
import CardWrapper from "../UI/CardWrapper";
import Card from "../UI/Card";
import Spinner from "../UI/Spinner";
import { CommentsIcon } from "../CustomIcons";

import { getPosts } from "../../utils/redditApi";

import { Post } from "../../interface/reddit";

import styles from "../../styles/components/Posts/index.module.scss";

const { app } = window.require("@electron/remote");
const { writeFileSync, readFileSync } = window.require("fs");
const { join } = window.require("path");
const favDataPath = join(
  app.getAppPath(),
  "..",
  "data",
  "favoriteSubreddit.json"
);

const PostsPage: React.FC = ({}) => {
  const history = useHistory();
  const { subredditId }: { subredditId: string } = useParams();

  const [posts, setPosts] = useState<Post[]>([]);

  const getPostsLoad = async () => {
    const data = await getPosts(subredditId, "hot");
    setPosts(data);
  };

  useEffect(() => {
    getPostsLoad();
  }, []);

  return (
    <div className={styles.posts}>
      <div className={styles.posts__info}>
        <nav className={styles.posts__navigation}>
          <ul className={styles.nav__wrapper}>
            <li
              className={styles.nav__item}
              onClick={() => {
                history.push("/");
              }}
            >
              Home
            </li>
            <li className={styles.nav__item}>/</li>
            <li className={styles.nav__item}>r</li>
            <li className={styles.nav__item}>/</li>
            <li className={styles.nav__item}>{subredditId}</li>
          </ul>
        </nav>

        <div className={styles.info__header}>
          <h1 className={styles.posts_title}>{subredditId}</h1>

          <Controls subredditId={subredditId} setPosts={setPosts} />
        </div>

        {posts.length !== 0 ? (
          <CardWrapper className={styles.container__items}>
            {posts.map((item, index) => {
              return (
                <Card
                  key={index}
                  title={item.title}
                  author={item.author}
                  route="/r"
                  actions={[
                    {
                      text: "Comments",
                      icon: <CommentsIcon />,
                      onClick: () => {
                        history.push(item.subreddit_name_prefixed);
                      },
                    },
                  ]}
                />
              );
            })}
          </CardWrapper>
        ) : (
          <Spinner size="xl" />
        )}
      </div>
    </div>
  );
};

export default PostsPage;
