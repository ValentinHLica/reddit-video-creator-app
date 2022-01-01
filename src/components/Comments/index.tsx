import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import Layout from "@components/Layout";
import { Spinner, GoTop, Button, Modal } from "@ui";
import CommentCard from "./CommentCard";
import OutputVideo from "@components/Settings/OutputVideo";
import VoiceChanger from "@components/Settings/VoiceChanger";
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
  const [settingsModal, setSettingsModal] = useState<boolean>(false);
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

  const onMove = (index: number, direction: "up" | "down") => {
    setComments((prevState) => {
      let beforeIndex: number = index;
      if (index !== 0) {
        for (let i = index - 1; i >= 0; i--) {
          beforeIndex = i;
          if (prevState[i].depth === 0) break;
        }
      }

      let tailCommentIndex: number = index;
      if (index !== prevState.length - 1) {
        for (let i = index + 1; i < prevState.length; i++) {
          tailCommentIndex = i;
          if (prevState[i].depth === 0) break;
        }
      } else {
        tailCommentIndex = prevState.length;
      }

      let afterIndex: number = prevState.length;
      if (index !== prevState.length - 1 && prevState[tailCommentIndex + 1]) {
        for (let i = tailCommentIndex + 1; i < prevState.length; i++) {
          afterIndex = i;
          if (prevState[i].depth === 0) break;
        }
      }

      const selectedArr = prevState.slice(
        index,
        tailCommentIndex !== prevState.length - 1
          ? tailCommentIndex
          : direction === "up"
          ? prevState.length
          : prevState.length - 1
      );

      if (direction === "up") {
        return [
          ...prevState.slice(0, beforeIndex),
          ...selectedArr,
          ...prevState.slice(beforeIndex, index),
          ...prevState.slice(
            tailCommentIndex !== prevState.length - 1
              ? tailCommentIndex
              : prevState.length,
            prevState.length
          ),
        ];
      }

      const afterArr = prevState.slice(tailCommentIndex, afterIndex);
      const endArr = prevState.slice(afterIndex, prevState.length);

      return [
        ...prevState.slice(0, index),
        ...afterArr,
        ...selectedArr,
        ...endArr,
      ];
    });
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
      bookmarked: true,
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

  const createVideo = async () => {
    const outputPath = localStorage.getItem("output-path");

    if (!outputPath) {
      if (!existsSync(outputPath)) {
        setSettingsModal(true);
      }
      return;
    }

    const voice = localStorage.getItem("voice");

    if (!voice) {
      setSettingsModal(true);
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
    try {
      const bookmark: BookmarkPost = JSON.parse(
        localStorage.getItem("bookmark") ?? "{}"
      );

      setIsBookmarked(
        bookmark[subredditId] &&
          (bookmark[subredditId][commentSlug].bookmarked as boolean)
      );
      setIsCreated(
        bookmark[subredditId][commentSlug]
          ? bookmark[subredditId][commentSlug].minutes ?? null
          : null
      );
    } catch (error) {
      logger("Data saved in localStorage is corrupted!", "error");
    }
  };

  const onBookmark = () => {
    let bookmark: BookmarkPost = {};

    try {
      bookmark = JSON.parse(localStorage.getItem("bookmark") ?? "{}");
    } catch (error) {
      logger("Data saved in localStorage is corrupted!", "error");
    }

    if (isBookmarked) {
      bookmark[subredditId][commentSlug].bookmarked = false;
    } else {
      if (bookmark[subredditId]) {
        if (bookmark[subredditId][commentSlug]) {
          bookmark[subredditId][commentSlug] = {
            ...bookmark[subredditId][commentSlug],
            post: post as Post,
          };
        } else {
          bookmark[subredditId][commentSlug] = {
            post: post as Post,
            bookmarked: true,
          };
        }
      } else {
        bookmark[subredditId] = {
          [commentSlug]: { post: post as Post, bookmarked: true },
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
                onMove={onMove}
                onCheck={onCheck.bind(this, index)}
                cardIndex={index}
                commentsLength={comments.length}
                {...comment}
                collapse={
                  comments[index + 1] &&
                  comments[index + 1].depth > comments[index].depth
                }
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
          text={timerMinutes < 10 ? `${timerMinutes} minutes` : "Create"}
          icon={<ClockIcon />}
        />

        <GoTop />

        <Modal
          visible={settingsModal}
          setModal={setSettingsModal}
          className={styles.modal__content}
        >
          <h1>Please Select Outpath</h1>

          <OutputVideo />

          <VoiceChanger />
        </Modal>

        {/* <Modal
          visible={thumbnailModal}
          setModal={setThumbnailModal}
          className={styles.dropdown__modal}
        >
          {!thumbnailImageSrc ? (
            <div {...getRootProps()} className={styles.file__dropdown}>
              <input {...getInputProps()} />
              <p>Drop the files here ...</p>
            </div>
          ) : (
            <div className={styles.crop__container}>
              <div className={styles.crop}>
                <ReactCrop
                  src={thumbnailImageSrc}
                  crop={cropDetails as Partial<Crop>}
                  onChange={(newCrop) => {
                    setcropDetails(newCrop);
                  }}
                  onImageLoaded={onLoad}
                />
              </div>

              <Button
                text="Create Video"
                onClick={async () => {
                  await createVideo();
                }}
              />
            </div>
          )}
        </Modal> */}
      </div>
    </Layout>
  );
};

export default CommentsPage;
