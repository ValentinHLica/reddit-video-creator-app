import React, { Fragment, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import { Spinner, BreadCrumb, GoTop, Button, Modal } from "@ui";
import CommentCard from "./CommentCard";
import OutputVideo from "@components/Settings/OutputVideo";
import { ClockIcon, SimpleArrowRightIcon, ThumbUpIcon } from "@icon";

import { getComments } from "@utils/redditApi";
import { countWords, roundUp } from "@utils/helpers";

import { Comment, Post } from "@interface/reddit";

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

  const fetchComments = async () => {
    const { comments, postDetails } = await getComments(
      subredditId,
      commentId,
      commentSlug
    );

    setComments(comments);
    setPost(postDetails);
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

  const createVideo = () => {
    const outputPath = localStorage.getItem("output-path");

    if (!outputPath) {
      if (!existsSync(outputPath)) {
        setOutputPathModal(true);
      }
      return;
    }

    history.push({
      pathname: "/create-video",
      state: {
        comments: comments.filter((comment) => comment.selected),
        post,
      },
    });
  };

  useEffect(() => {
    fetchComments();

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

  const timerMinutes = countWords(
    comments
      .filter((c) => c.selected)
      .map((c) => c.body)
      .join("")
  );

  const timerContent = (
    <Fragment>
      <ClockIcon /> {timerMinutes} minutes
    </Fragment>
  );

  return (
    <div className={styles.container}>
      <div className={styles.container__header}>
        <div className={styles.top__header}>
          <BreadCrumb
            nav={[
              {
                text: post.subreddit,
                url: `/r/${post.subreddit}`,
              },
              {
                text: post.title,
              },
            ]}
          />

          <div className={styles.container__timer}>
            <div className={styles.timer}>{timerContent}</div>

            {timerMinutes > 0 && (
              <Button
                type={timerMinutes > 10 ? "success" : "primary"}
                onClick={createVideo}
                size="xs"
              >
                Done <SimpleArrowRightIcon />
              </Button>
            )}
          </div>
        </div>

        <h3 className={styles.header__title}>{post.title}</h3>

        <ul className={styles.header__stats}>
          <li className={styles.stat}>
            <ThumbUpIcon /> {roundUp(post.ups)} Ups
          </li>
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
        type={timerMinutes > 10 ? "success" : "primary"}
        onClick={timerMinutes ? createVideo : undefined}
      >
        {timerContent}
      </Button>

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
  );
};

export default CommentsPage;
