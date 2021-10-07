import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { Post, BookmarkPost } from "@interface/reddit";
import { CardWrapper, Card } from "@ui";
import { BookmarkIcon, CommentsIcon, UpsIcon, CircleIcon } from "@icon";
import { logger, roundUp } from "@utils/helpers";

import styles from "@styles/Home/bookmark.module.scss";

const Bookmarked: React.FC = () => {
  const history = useHistory();

  const [bookmark, setBookmark] = useState<Post[]>([]);

  const loadBookmarks = async () => {
    let localBookmark: BookmarkPost = {};

    try {
      localBookmark = JSON.parse(localStorage.getItem("bookmark") ?? "{}");
    } catch (error) {
      return;
    }

    if (Object.keys(localBookmark).length !== 0) {
      const bookmarkList: Post[] = [];

      for (const subreddit of Object.keys(localBookmark)) {
        for (const post of Object.keys(localBookmark[subreddit])) {
          const bookmark = localBookmark[subreddit][post];

          if (bookmark.bookmarked) {
            bookmarkList.push({
              ...bookmark.post,
              created: !!bookmark.created,
            });
          }
        }
      }

      setBookmark(bookmarkList);
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

    if (!bookmark[post.subreddit][commentSlug].created) {
      delete bookmark[post.subreddit][commentSlug];
    } else {
      bookmark[post.subreddit][commentSlug].bookmarked = false;
    }

    localStorage.setItem("bookmark", JSON.stringify(bookmark));

    setBookmark((prevState) => {
      return prevState.filter((_, postIndex) => postIndex !== index);
    });
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  if (bookmark.length === 0) {
    return <h3 className={styles.no_bookmarks}>No Bookmarks</h3>;
  }

  return (
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
  );
};

export default Bookmarked;
