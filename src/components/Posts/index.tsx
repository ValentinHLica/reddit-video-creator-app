import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import { CardWrapper, Card, Spinner, BreadCrumb } from "@ui";
import Controls from "./Controls";
import {
  AlertOctagonIcon,
  BookmarkIcon,
  CommentsIcon,
  HeartIcon,
  ThumbUpIcon,
  UserIcon,
} from "@icon";

import { getPosts, search } from "@utils/redditApi";
import { logger, roundUp } from "@utils/helpers";

import { Post, SearchItem, Pagination, BookmarkPost } from "@interface/reddit";

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

  const getPostsLoad = async () => {
    let bookmark: BookmarkPost = {};

    try {
      bookmark = JSON.parse(localStorage.getItem("bookmark") ?? "{}");
    } catch (error) {
      logger("Data saved in localStorage is corrupted!", "error");
    }

    try {
      const { data, pagination: resultsPagination } = await getPosts(
        subredditId,
        "hot"
      );

      setPagination(resultsPagination);

      if (Object.keys(bookmark).length !== 0) {
        setPosts(
          data.map((post) => ({
            ...post,
            added:
              !!bookmark[subredditId][
                post.permalink.split(`${post.id}/`)[1].replace("/", "")
              ],
          }))
        );

        return;
      }

      setPosts(data);
    } catch (error) {
      setError(true);
    }
  };

  const fetchFav = () => {
    try {
      return JSON.parse(
        localStorage.getItem("favourite") ?? "[]"
      ) as SearchItem[];
    } catch (err) {
      logger("Data saved in localStorage is corrupted!", "error");

      return [];
    }
  };

  const fetchSubreddit = async () => {
    try {
      const { data } = await search(`/r/${subredditId}`);

      const favourite = fetchFav();

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

    const favourite = fetchFav();

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

    let bookmark: BookmarkPost = {};

    try {
      bookmark = JSON.parse(localStorage.getItem("bookmark") ?? "{}");
    } catch (error) {
      logger("Data saved in localStorage is corrupted!", "error");
    }

    try {
      const { data, pagination: resultsPagination } = await getPosts(
        subredditId,
        "hot",
        undefined,
        pagination.next as unknown as string
      );

      setPagination(resultsPagination);
      setPosts((prevState) => {
        return [
          ...(prevState as Post[]),
          ...data.map((post) => ({
            ...post,
            added:
              !!bookmark[subredditId][
                post.permalink.split(`${post.id}/`)[1].replace("/", "")
              ],
          })),
        ];
      });
    } catch (err) {
      console.log(err);

      setError(true);
    }
  };

  const onChangeBookmark = (post: Post, index: number) => {
    let bookmark: BookmarkPost = {};

    try {
      bookmark = JSON.parse(localStorage.getItem("bookmark") ?? "{}");
    } catch (error) {
      logger("Data saved in localStorage is corrupted!", "error");
    }

    const commentSlug = post.permalink.split(`${post.id}/`)[1].replace("/", "");

    if (post.added) {
      delete bookmark[post.subreddit][commentSlug];
    } else {
      if (bookmark[post.subreddit]) {
        bookmark[post.subreddit][commentSlug] = { post };
      } else {
        bookmark[post.subreddit] = {
          [commentSlug]: { post },
        };
      }
    }

    localStorage.setItem("bookmark", JSON.stringify(bookmark));

    setPosts((prevState) => {
      return prevState.map((post, postIndex) => ({
        ...post,
        added: postIndex === index ? !post.added : post.added,
      }));
    });
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
            <HeartIcon added={subreddit !== null && !!subreddit.added} />
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
                    {
                      text: `Bookmark`,
                      icon: <BookmarkIcon added={item.added ?? false} />,
                      onClick: () => {
                        onChangeBookmark(item, index);
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
