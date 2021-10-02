import React, { Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import Layout from "@components/Layout";
import {
  BreadCrumb,
  CardWrapper,
  Card,
  Button,
  Modal,
  Tabs,
  Dropdown,
} from "@ui";
import AddFavourite from "./AddFavourite";
import {
  AddIcon,
  HeartIcon,
  UserIcon,
  UpsIcon,
  CommentsIcon,
  BookmarkIcon,
  MenuIcon,
  SettingsIcon,
  CircleIcon,
  ZapIcon,
} from "@icon";

import { logger, roundUp } from "@utils/helpers";

import { BookmarkPost, Post, SearchItem } from "@interface/reddit";

import styles from "@styles/Home/index.module.scss";

const HomePage: React.FC = () => {
  const history = useHistory();

  const [bookmark, setBookmark] = useState<Post[]>([]);
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

  const getBookmark = async () => {
    let localBookmark: BookmarkPost = {};

    try {
      localBookmark = JSON.parse(localStorage.getItem("bookmark") ?? "{}");
    } catch (error) {
      logger("Data saved in localStorage is corrupted!", "error");
    }

    if (Object.keys(localBookmark).length !== 0) {
      const bookmarkList: Post[] = [];

      for (const subreddit of Object.keys(localBookmark)) {
        for (const post of Object.keys(localBookmark[subreddit])) {
          const bookmark = localBookmark[subreddit][post];

          bookmarkList.push({ ...bookmark.post, created: !!bookmark.created });
        }
      }

      setBookmark(bookmarkList);
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

  const onChangeBookmark = (post: Post, index: number) => {
    let bookmark: BookmarkPost = {};

    try {
      bookmark = JSON.parse(localStorage.getItem("bookmark") ?? "{}");
    } catch (error) {
      logger("Data saved in localStorage is corrupted!", "error");
    }

    const commentSlug = post.permalink.split(`${post.id}/`)[1].replace("/", "");

    delete bookmark[post.subreddit][commentSlug];

    localStorage.setItem("bookmark", JSON.stringify(bookmark));

    setBookmark((prevState) => {
      return prevState.filter((_, postIndex) => postIndex !== index);
    });
  };

  useEffect(() => {
    fetchFav();
    getBookmark();

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
              content:
                bookmark.length !== 0 ? (
                  <CardWrapper className={styles.container__items}>
                    {bookmark.map((item, index) => {
                      return (
                        <Card
                          key={index}
                          title={item.title}
                          author={item.author}
                          route="/r"
                          actions={[
                            {
                              text: `Bookmark`,
                              icon: <BookmarkIcon added={true} />,
                              onClick: () => {
                                onChangeBookmark(item, index);
                              },
                            },
                            {
                              text: `${roundUp(item.num_comments)} Comments`,
                              icon: <CommentsIcon />,
                              onClick: async () => {
                                const commentSlug = item.permalink
                                  .split(`${item.id}/`)[1]
                                  .replace("/", "");

                                const url = `/r/${item.subreddit}/comments/${item.id}/${commentSlug}`;

                                history.push(url);
                              },
                            },
                            {
                              text: `${roundUp(item.ups)} Ups`,
                              icon: <UpsIcon />,
                            },

                            ...(() => {
                              if (item.created) {
                                return [
                                  {
                                    text: `Created`,
                                    icon: <CircleIcon />,
                                    className: "isCreated",
                                  },
                                ];
                              }

                              return [];
                            })(),
                          ]}
                        />
                      );
                    })}
                  </CardWrapper>
                ) : (
                  <h3 className={styles.no_bookmarks}>No Bookmarks</h3>
                ),
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
