import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Spinner from "../UI/Spinner";
import BreadCrumb from "../UI/BreadCrumb";
import GoTop from "../UI/GoTop";
import Button from "../UI/Button";
import CommentCard from "./CommentCard";
import { ClockIcon, SimpleArrowRightIcon, ThumbUpIcon } from "../CustomIcons";

import { getComments } from "../../utils/redditApi";
import { countWords } from "../../utils/helpers";

import { Comment, Post } from "../../interface/reddit";

import styles from "../../styles/components/Comments/index.module.scss";

const CommentsPage: React.FC = () => {
  const {
    subredditId,
    commentId,
    commentSlug,
  }: { subredditId: string; commentId: string; commentSlug: string } =
    useParams();

  const [post, setPost] = useState<Post>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [fixedTimer, setFixedTimer] = useState<boolean>(false);

  const fetchComments = async () => {
    const { comments, postDetails } = await getComments(
      subredditId,
      commentId,
      commentSlug
    );

    setComments(comments.map((comment) => ({ ...comment, selected: false })));
    setPost(postDetails);

    // const res = await fetch("/data/response.json");
    // const data = await res.json();

    // setComments(data.comments);
    // setPost(data.postDetails);
  };

  const onCheck = (index: number) => {
    const commentsCopy = [...comments];

    let count = index;
    const selected = commentsCopy[index].selected;

    while (true) {
      if (selected) {
        commentsCopy[count].selected = !selected;

        count++;

        if (!commentsCopy[count] || commentsCopy[count].depth === 0) {
          break;
        }
      } else {
        if (commentsCopy[count].depth === 0) {
          commentsCopy[count].selected = !selected;
          break;
        }

        commentsCopy[count].selected = !selected;

        count--;
      }
    }

    setComments(commentsCopy);
  };

  const createVideo = () => {
    console.log("Creating Video");
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

            {timerMinutes > 10 && (
              <Button type="success" onClick={createVideo} size="xs">
                Done <SimpleArrowRightIcon />
              </Button>
            )}
          </div>
        </div>

        <h3 className={styles.header__title}>{post.title}</h3>

        <ul className={styles.header__stats}>
          <li className={styles.stat}>
            <ThumbUpIcon /> {post.ups} Ups
          </li>
        </ul>
      </div>

      <div className={styles.container__comments}>
        {comments.map((comment, index) => (
          <CommentCard
            key={index}
            onCheck={onCheck.bind(this, index)}
            {...comment}
          />
        ))}
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
    </div>
  );
};

export default CommentsPage;
