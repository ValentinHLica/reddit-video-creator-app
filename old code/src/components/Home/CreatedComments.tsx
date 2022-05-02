import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { BookmarkPost, Created } from "@interface/reddit";
import { CardWrapper, Card } from "@ui";
import { BookmarkIcon, CommentsIcon, UpsIcon, CircleIcon } from "@icon";
import { roundUp } from "@utils/helpers";

import styles from "@styles/Home/create-comments.module.scss";

const CreatedComments: React.FC = () => {
  const history = useHistory();

  const [created, setCreated] = useState<Created[]>([]);

  const loadCreated = () => {
    let createdList: Created[] = [];

    let bookmark: BookmarkPost = {};

    try {
      bookmark = JSON.parse(localStorage.getItem("bookmark") ?? "{}");
    } catch (error) {
      return [];
    }

    for (const postSlug of Object.keys(bookmark)) {
      for (const post of Object.keys(bookmark[postSlug])) {
        if (bookmark[postSlug][post].created) {
          createdList.push({
            ...bookmark[postSlug][post].post,
            isBookmarked: bookmark[postSlug][post].bookmarked as boolean,
          });
        }
      }
    }

    setCreated(createdList.reverse());
  };

  const onChangeBookmark = (post: Created, index: number) => {
    let bookmark: BookmarkPost = {};

    try {
      bookmark = JSON.parse(localStorage.getItem("bookmark") ?? "{}");
    } catch (error) {
      return;
    }

    const commentSlug = post.permalink.split(`${post.id}/`)[1].replace("/", "");

    bookmark[post.subreddit][commentSlug].bookmarked = !post.isBookmarked;

    localStorage.setItem("bookmark", JSON.stringify(bookmark));

    setCreated((prevState) => {
      return prevState?.map((item, itemIndex) => {
        if (itemIndex === index) {
          return { ...item, isBookmarked: true };
        }

        return item;
      });
    });
  };

  useEffect(() => {
    loadCreated();
  }, []);

  if (created.length === 0) {
    return <h3 className={styles.no_bookmarks}>No Created Available</h3>;
  }

  return (
    <CardWrapper>
      {created.map((item, index) => {
        return (
          <Card
            key={index}
            title={item.title}
            author={item.author}
            route="/r"
            actions={[
              {
                text: `Bookmark`,
                icon: <BookmarkIcon added={item.isBookmarked} />,
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
              {
                text: `Created`,
                icon: <CircleIcon />,
                className: "isCreated",
              },
            ]}
          />
        );
      })}
    </CardWrapper>
  );
};

export default CreatedComments;
