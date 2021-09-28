import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import { CardWrapper, Card, Spinner, BreadCrumb } from "@ui";
import Controls from "./Controls";
import {
  AlertOctagonIcon,
  CommentsIcon,
  HeartIcon,
  ThumbUpIcon,
  UserIcon,
} from "@icon";

import { getPosts, search } from "@utils/redditApi";
import { logger, roundUp } from "@utils/helpers";

import { Post, SearchItem, Pagination } from "@interface/reddit";

import styles from "@styles/Posts/index.module.scss";

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
  const [favourite, setFavourite] = useState<SearchItem[]>([]);

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
      localStorage.setItem("favourite", JSON.stringify(newFav));
    } else {
      const newFav = [...favourite, subreddit];
      localStorage.setItem("favourite", JSON.stringify(newFav));
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
    const fetchFav = () => {
      const data = localStorage.getItem("favourite");

      if (data) {
        try {
          const favourite = JSON.parse(data) as SearchItem[];

          setFavourite(
            favourite.map((item: SearchItem) => ({ ...item, added: true }))
          );
        } catch (err) {
          logger("Data saved in localStorage is corrupted!", "error");
        }
      }
    };

    const onLoad = async () => {
      fetchFav();
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
