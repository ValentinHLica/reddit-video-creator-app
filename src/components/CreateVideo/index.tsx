import React, { Fragment, useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";

import { Spinner, Button, BreadCrumb } from "@ui";
import { AlertTriangleIcon, HappyFaceIcon } from "@icon";

import { createPost } from "@utils/generation";

import { Comment, Post } from "@interface/reddit";
import { Comment as VideoComment } from "@interface/video";

import styles from "@styles/CreateVideo/index.module.scss";

const { existsSync } = window.require("fs");

const CreateVideoPage: React.FC = () => {
  const history = useHistory();
  const location = useLocation<{
    comments: Comment[];
    post: Post;
    commentSlug: string;
    timerMinutes: string;
  }>();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // const [videoPath, setVideoPath] = useState<string | null>(null);

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

    const filteredComments: VideoComment[] = location.state.comments.map(
      (comment) => ({
        text: comment.body,
        userName: comment.author,
        indentation: comment.depth,
      })
    );

    try {
      await createPost(location.state.post, filteredComments, outputPath);
      // setVideoPath(path);
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

  // const { title, comments } = location.state;

  return (
    <div className={styles.container}>
      <BreadCrumb
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
      />

      <div className={styles.container__header}>
        <h1
          className={`${styles.header__title} ${
            error ? styles.header__title__red : ""
          }`}
        >
          {loading ? (
            <Fragment>
              <Spinner /> Creating video please wait!
            </Fragment>
          ) : !error ? (
            <Fragment>
              <HappyFaceIcon /> Video was created successfully
            </Fragment>
          ) : (
            <Fragment>
              <AlertTriangleIcon /> {error}
            </Fragment>
          )}
        </h1>
      </div>

      {/* {videoPath && (
        <div className={styles.container__video}>
          <video src={videoPath} autoPlay controls />
        </div>
      )} */}
    </div>
  );
};

declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    directory?: string;
    webkitdirectory?: string;
  }
}

export default CreateVideoPage;
