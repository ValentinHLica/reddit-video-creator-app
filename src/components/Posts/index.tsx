import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import Controls from "./Controls";
import CardWrapper from "../UI/CardWrapper";
import Card from "../UI/Card";
import Spinner from "../UI/Spinner";
import BreadCrumb from "../UI/BreadCrumb";
import {
  AlertOctagonIcon,
  CommentsIcon,
  HeartIcon,
  ThumbUpIcon,
  UserIcon,
} from "../CustomIcons";

import { getPosts, search } from "../../utils/redditApi";
import { roundUp } from "../../utils/helpers";

import { Post, SearchItem, Pagination } from "../../interface/reddit";

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

const PostsPage: React.FC = () => {
  const history = useHistory();
  const { subredditId }: { subredditId: string } = useParams();

  const [subreddit, setSubreddit] = useState<SearchItem | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    next: null,
    before: null,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const favourite: SearchItem[] = JSON.parse(
    readFileSync(favDataPath).toString()
  );

  const getPostsLoad = async () => {
    try {
      const { data, pagination: resultsPagination } = await getPosts(
        subredditId,
        "hot"
      );

      setPagination(resultsPagination);
      setPosts(data);
    } catch (error) {
      setError(true);
    }
  };

  const fetchSubreddit = async () => {
    try {
      const { data } = await search(`/r/${subredditId}`);

      const addedFilter = data.map((subreddit) => {
        let isAdded = false;

        for (const item of favourite) {
          if (item.url === subreddit.url) {
            isAdded = true;
            break;
          }
        }

        return {
          ...subreddit,
          added: isAdded,
        };
      });

      setSubreddit(addedFilter[0]);
    } catch (err) {
      console.log(err);

      setError(true);
    }
  };

  const onChangeFav = async () => {
    if (!subreddit) {
      return;
    }

    const added = subreddit.added;

    if (added) {
      const newFav = favourite.filter((fav) => fav.url !== subreddit?.url);
      writeFileSync(favDataPath, JSON.stringify(newFav));
    } else {
      const newFav = [...favourite, subreddit];
      writeFileSync(favDataPath, JSON.stringify(newFav));
    }

    setSubreddit({ ...(subreddit as SearchItem), added: !added });
  };

  const loadMore = async () => {
    setError(false);

    try {
      const { data, pagination: resultsPagination } = await getPosts(
        subredditId,
        "hot",
        undefined,
        pagination.next as unknown as string
      );

      setPagination(resultsPagination);
      setPosts((prevState) => {
        return [...(prevState as Post[]), ...data];
      });
    } catch (err) {
      console.log(err);

      setError(true);
    }
  };

  useEffect(() => {
    const onLoad = async () => {
      await fetchSubreddit();
      await getPostsLoad();

      setLoading(false);
    };

    onLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.posts}>
      <div className={styles.posts__info}>
        <div className={styles.posts__navigation}>
          <BreadCrumb
            nav={[
              {
                text: subredditId,
              },
            ]}
          />

          <div className={styles.nav__actions} onClick={onChangeFav}>
            <HeartIcon added={subreddit !== null && subreddit.added === true} />
          </div>
        </div>

        <div className={styles.info__header}>
          <div className={styles.details__wrapper}>
            <h1 className={styles.posts_title}>{subredditId}</h1>

            <p className={styles.posts__desc}>
              {subreddit?.public_description}
            </p>

            <ul className={styles.details__list}>
              <li className={styles.list__item}>
                {<UserIcon />}{" "}
                {subreddit ? roundUp(subreddit.subscribers) : "0"}
              </li>
            </ul>
          </div>

          <Controls
            subredditId={subredditId}
            setPosts={setPosts}
            setLoading={setLoading}
            setError={setError}
          />
        </div>

        {!error && posts.length !== 0 && (
          <CardWrapper
            className={styles.container__items}
            loadMore={pagination.next ? loadMore : undefined}
          >
            {posts.map((item, index) => {
              return (
                <Card
                  key={index}
                  title={item.title}
                  author={item.author}
                  route="/r"
                  actions={[
                    {
                      text: `${roundUp(item.ups)} Ups`,
                      icon: <ThumbUpIcon />,
                    },
                    {
                      text: `${roundUp(item.num_comments)} Comments`,
                      icon: <CommentsIcon />,
                      onClick: async () => {
                        const commentSlug = item.permalink
                          .split(`${item.id}/`)[1]
                          .replace("/", "");

                        const url = `/r/${subredditId}/comments/${item.id}/${commentSlug}`;

                        console.log(url);

                        history.push(url);
                      },
                    },
                  ]}
                />
              );
            })}
          </CardWrapper>
        )}

        {loading && <Spinner size="xl" />}

        {error && (
          <h3 className={styles.posts__error}>
            <AlertOctagonIcon />
            Failed to fetch
          </h3>
        )}
      </div>
    </div>
  );
};

export default PostsPage;
