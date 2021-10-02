import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import Layout from "@components/Layout";
import { Spinner, BreadCrumb, GoTop, Button, Modal } from "@ui";
import CommentCard from "./CommentCard";
import OutputVideo from "@components/Settings/OutputVideo";
import { BookmarkIcon, CircleIcon, ClockIcon, PlayIcon, UpsIcon } from "@icon";

import { getComments } from "@utils/redditApi";
import { countWords, logger, roundUp } from "@utils/helpers";

import { BookmarkPost, Comment, Post } from "@interface/reddit";

import styles from "@styles/Comments/index.module.scss";

const { existsSync } = window.require("fs");

const CommentsPage: React.FC = () => {
  const {
    subredditId,
    commentId,
    commentSlug,
  }: { subredditId: string; commentId: string; commentSlug: string } =
    useParams();
  const history = useHistory();

  const [post, setPost] = useState<Post>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [fixedTimer, setFixedTimer] = useState<boolean>(false);
  const [outputPathModal, setOutputPathModal] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [isCreated, setIsCreated] = useState<number | null>(null);

  const timerMinutes = countWords(
    comments
      .filter((c) => c.selected)
      .map((c) => c.body)
      .join("")
  );

  const fetchComments = async () => {
    const { comments, postDetails } = await getComments(
      subredditId,
      commentId,
      commentSlug
    );

    setComments(comments);
    setPost(postDetails);
  };

  const onUsePrevComments = () => {
    let bookmark: BookmarkPost = {};

    try {
      bookmark = JSON.parse(localStorage.getItem("bookmark") ?? "{}");
    } catch (error) {
      logger("Data saved in localStorage is corrupted!", "error");
    }

    if (bookmark[subredditId] && bookmark[subredditId][commentSlug]) {
      const localComments = bookmark[subredditId][commentSlug].comments;
      if (localComments) {
        setComments((prevState) =>
          prevState.map((comment) => ({
            ...comment,
            selected: localComments[comment.id],
          }))
        );
      }
    }
  };

  const onCheck = (index: number) => {
    const commentsCopy = [...comments];

    let count = index;
    const selected = commentsCopy[index].selected;
    const depth = commentsCopy[index].depth;

    while (true) {
      if (selected) {
        commentsCopy[count].selected = !selected;

        count++;

        if (
          !commentsCopy[count] ||
          commentsCopy[count].depth === 0 ||
          commentsCopy[count].depth === depth ||
          commentsCopy[count].depth < depth
        ) {
          break;
        }
      } else {
        if (commentsCopy[count].depth === 0) {
          commentsCopy[count].selected = !selected;
          break;
        }

        if (commentsCopy[count].depth < depth || count === index) {
          commentsCopy[count].selected = !selected;
        }

        count--;
      }
    }

    setComments(commentsCopy);
  };

  const onCollapse = (index: number) => {
    const commentsCopy = [...comments];

    const visible = commentsCopy[index + 1]
      ? !commentsCopy[index + 1].visible
      : false;
    const depth = commentsCopy[index].depth;

    for (let i = index + 1; i < commentsCopy.length; i++) {
      if (commentsCopy[i].depth > depth) {
        commentsCopy[i].visible = visible;
      } else {
        break;
      }
    }

    setComments(commentsCopy);
  };

  const savePost = () => {
    let bookmark: BookmarkPost = {};

    try {
      bookmark = JSON.parse(localStorage.getItem("bookmark") ?? "{}");
    } catch (error) {
      logger("Data saved in localStorage is corrupted!", "error");
    }

    const commentIdList: { [x: string]: true } = {};

    for (const comment of comments) {
      if (comment.selected) {
        commentIdList[comment.id] = true;
      }
    }

    const data = {
      post: post as Post,
      comments: commentIdList,
      created: new Date(),
      minutes: timerMinutes,
    };

    if (bookmark[subredditId]) {
      bookmark[subredditId][commentSlug] = data;
    } else {
      bookmark[subredditId] = {
        [commentSlug]: data,
      };
    }

    localStorage.setItem("bookmark", JSON.stringify(bookmark));

    setIsCreated(timerMinutes);
  };

  const createVideo = () => {
    const outputPath = localStorage.getItem("output-path");

    if (!outputPath) {
      if (!existsSync(outputPath)) {
        setOutputPathModal(true);
      }
      return;
    }

    savePost();

    history.push({
      pathname: "/create-video",
      state: {
        comments: comments.filter((comment) => comment.selected),
        post,
        commentSlug,
        timerMinutes,
      },
    });
  };

  const checkBookmark = () => {
    let bookmark: BookmarkPost = {};

    try {
      bookmark = JSON.parse(localStorage.getItem("bookmark") ?? "{}");
    } catch (error) {
      logger("Data saved in localStorage is corrupted!", "error");
    }

    setIsBookmarked(!!bookmark[subredditId][commentSlug]);
    setIsCreated(
      bookmark[subredditId][commentSlug]
        ? bookmark[subredditId][commentSlug].minutes ?? null
        : null
    );
  };

  const onBookmark = () => {
    let bookmark: BookmarkPost = {};

    try {
      bookmark = JSON.parse(localStorage.getItem("bookmark") ?? "{}");
    } catch (error) {
      logger("Data saved in localStorage is corrupted!", "error");
    }

    if (isBookmarked) {
      delete bookmark[subredditId][commentSlug];
    } else {
      if (bookmark[subredditId]) {
        if (bookmark[subredditId][commentSlug]) {
          bookmark[subredditId][commentSlug] = {
            ...bookmark[subredditId][commentSlug],
            post: post as Post,
          };
        } else {
          bookmark[subredditId][commentSlug] = { post: post as Post };
        }
      } else {
        bookmark[subredditId] = {
          [commentSlug]: { post: post as Post },
        };
      }
    }

    localStorage.setItem("bookmark", JSON.stringify(bookmark));

    setIsBookmarked(!isBookmarked);
  };

  useEffect(() => {
    fetchComments();
    checkBookmark();

    const handleScroll = () => {
      setFixedTimer(window.pageYOffset > 30);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!post) {
    return <Spinner size="xl" />;
  }

  const stats: {
    text: string;
    icon: JSX.Element;
    onClick?: () => void | null;
    className?: string;
  }[] = [
    {
      text: `${roundUp(post.ups)} Ups`,
      icon: <UpsIcon />,
    },
    {
      text: "Bookmark",
      icon: <BookmarkIcon added={isBookmarked} />,
      onClick: onBookmark,
      className: styles.stat__bookmark,
    },
    ...(() => {
      if (isCreated) {
        return [
          {
            text: "Use previous comments",
            icon: <CircleIcon />,
            onClick: onUsePrevComments,
            className: styles.stat__created,
          },
        ];
      }

      return [];
    })(),
    {
      text: `${timerMinutes} Minutes`,
      icon: <ClockIcon />,
    },
    ...(() => {
      if (timerMinutes > 0) {
        return [
          {
            text: "Create",
            icon: <PlayIcon />,
            onClick: createVideo,
            className: `${styles.stat__create} pointer`,
          },
        ];
      }

      return [];
    })(),
  ];

  return (
    <Layout
      nav={[
        {
          text: post.subreddit,
          url: `/r/${post.subreddit}`,
        },
        {
          text: post.title,
        },
      ]}
    >
      <div className={styles.container}>
        <div className={styles.container__header}>
          <h3 className={styles.header__title}>{post.title}</h3>

          <ul className={styles.header__stats}>
            {stats.map((stat, index) => {
              const { text, icon, className, onClick } = stat;

              return (
                <li
                  className={`${styles.stat} ${className ?? ""}`}
                  onClick={onClick}
                  key={index}
                >
                  {icon} {text}
                </li>
              );
            })}
          </ul>
        </div>

        <div className={styles.container__comments}>
          {comments.map((comment, index) => {
            if (!comment.visible) {
              return null;
            }

            return (
              <CommentCard
                key={index}
                onCollapse={onCollapse.bind(this, index)}
                onCheck={onCheck.bind(this, index)}
                {...comment}
              />
            );
          })}
        </div>

        <Button
          className={`${styles.timer__btn} ${
            fixedTimer ? styles.timer__btn__visible : ""
          }`}
          type={timerMinutes > 10 ? "success" : "light"}
          onClick={timerMinutes ? createVideo : undefined}
          text={`${timerMinutes} minutes`}
          icon={<ClockIcon />}
        />

        <GoTop />

        <Modal
          visible={outputPathModal}
          setModal={setOutputPathModal}
          className={styles.modal__content}
        >
          <h1>Please Select Outpath</h1>

          <OutputVideo />
        </Modal>
      </div>
    </Layout>
  );
};

export default CommentsPage;
