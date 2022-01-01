import React, { Fragment, useEffect, useRef, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";

import dateFormat from "dateformat";

import { Colors, Comment, Post } from "@interface/reddit";

import { Spinner, Button, Progress } from "@ui";
import { AlertTriangleIcon, HappyFaceIcon } from "@icon";
import Layout from "@components/Layout";
import { createPost } from "@utils/generation";

import styles from "@styles/CreateVideo/index.module.scss";
import { getStorage } from "@utils/helpers";

const { existsSync } = window.require("fs");

const CreateVideoPage: React.FC = () => {
  const history = useHistory();
  const location = useLocation<{
    comments: Comment[];
    post: Post;
    commentSlug: string;
    timerMinutes: string;
  }>();

  const startTime = useRef<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [totalProgress, setTotalProgress] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [videoPath, setVideoPath] = useState<string | null>(null);

  const createVideo = async () => {
    const outputPath = localStorage.getItem("output-path");

    if (!outputPath) {
      setError("Please change output path to a valid one");
      return;
    }

    if (!existsSync(outputPath)) {
      setError("Please change output path to a valid one");
      return;
    }

    if (!location.state) {
      return;
    }

    const filteredComments = location.state.comments.map((comment) => ({
      content: comment.body,
      user: comment.author,
      depth: comment.depth,
      score: comment.score,
    }));

    const colors = getStorage("colors") as Colors[];

    try {
      await createPost(
        location.state.post,
        filteredComments,
        outputPath,
        setProgress,
        setTotalProgress,
        setVideoPath,
        colors.filter((e) => e.subreddit === location.state.post.subreddit)[0]
      );
    } catch (err) {
      setError("Failed to create Video");
      console.log(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (location.state) {
      createVideo();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (loading) {
        setCurrentTime(new Date());
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [loading]);

  if (!location.state) {
    return (
      <div className={styles.container__no_content}>
        <span>
          <AlertTriangleIcon /> <h1>You have not selected any comments</h1>
        </span>
        <Button url="/" text="Go Back" />
      </div>
    );
  }

  return (
    <Layout
      nav={[
        {
          text: location.state.post.subreddit,
          onClick: () => {
            history.push(`/r/${location.state.post.subreddit}`);
          },
        },
        {
          text: location.state.post.title,
          onClick: () => {
            history.goBack();
          },
        },
        {
          text: "Create Video",
        },
      ]}
    >
      <div className={styles.container__header}>
        <h1
          className={`${styles.header__title} ${
            error ? styles.header__title__red : ""
          }`}
        >
          {loading && !videoPath && (
            <Fragment>
              <Spinner /> Creating video please wait!
            </Fragment>
          )}

          {videoPath && (
            <Fragment>
              <HappyFaceIcon /> Video was created successfully
            </Fragment>
          )}

          {error && (
            <Fragment>
              <AlertTriangleIcon /> Something went wrong
            </Fragment>
          )}
        </h1>
      </div>

      <div className={styles.container__video}>
        {videoPath && (
          <video
            src={videoPath}
            poster={videoPath.replace("video.mp4", "thumbnail.jpg")}
            controls
          />
        )}
      </div>

      <div className={styles.timer}>
        <ul className={styles.timer__nav}>
          <li>
            {`Elapsed Time: ${dateFormat(
              currentTime.getTime() - startTime.current.getTime(),
              "MM:ss"
            )}`}
          </li>
        </ul>

        <Progress
          max={totalProgress}
          value={loading ? progress : totalProgress}
        />
      </div>
    </Layout>
  );
};

declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    directory?: string;
    webkitdirectory?: string;
  }
}

export default CreateVideoPage;
