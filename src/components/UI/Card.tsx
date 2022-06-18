import React, { useContext, useRef } from "react";

import { RenderPost } from "@interface/post";

import Context from "@components/Context";
import Checkbox from "./Checkbox";
import Progress from "./Progress";
import Switch from "./Switch";
import {
  ClipboardIcon,
  ClipboardListIcon,
  BinIcon,
  BatteryEmptyIcon,
  PlayIcon,
  VideoIcon,
  LoadingIcon,
} from "@icon";

import styles from "@styles/components/UI/card.module.scss";

type Props = RenderPost & {
  index: number;
};

const Card: React.FC<Props> = ({
  title,
  url,
  duration,
  status,
  subreddit,
  index,
  videosCount,
}) => {
  const { queue, setQueue, maxVideoTime, setPostList, loadingRender } =
    useContext(Context);

  const inputEl = useRef<HTMLInputElement>(null);

  const videoCount = Math.floor(duration / maxVideoTime);

  const onDelete = (index: number) => {
    setPostList((state) => {
      const newState = state.filter((_, idx) => idx !== index);

      localStorage.setItem("local-posts", JSON.stringify(newState));

      return newState;
    });
  };

  const onCheck = (index: number) => {
    setPostList((state) => {
      const newState: RenderPost[] = state.map((e, idx) =>
        idx === index
          ? {
              ...e,
              status: e.status === "draft" ? "queue" : "draft",
            }
          : e
      );

      localStorage.setItem("local-posts", JSON.stringify(newState));

      return newState;
    });
  };

  return (
    <div className={`${styles.card} `}>
      <div className={styles.details}>
        <div className={styles.wrapper}>
          <p className={styles.subreddit}>r/{subreddit}</p>

          <a href={url} target="_blank" rel="noreferrer" title="Open on Reddit">
            <h3 className={styles.title}>{title}</h3>
          </a>

          <p className={`${styles.status} ${styles[`status__${status}`]}`}>
            {status}
          </p>
        </div>
      </div>

      <ul className={styles.actions}>
        <li>
          <VideoIcon />

          <p>Videos</p>

          <div className={styles.input}>
            <input
              type="number"
              min={1}
              max={videoCount}
              placeholder="Duration"
              value={videosCount}
              ref={inputEl}
              disabled={videoCount < 2}
              onKeyDown={() => false}
              onChange={(text) => {
                setPostList((state) => {
                  const newState = state.map((e, idx) => ({
                    ...e,
                    videosCount:
                      idx === index ? Number(text.target.value) : e.videosCount,
                  }));

                  localStorage.setItem("local-posts", JSON.stringify(newState));

                  return newState;
                });
              }}
            />
          </div>
        </li>

        {status !== "finish" && (
          <li className={styles.status}>
            {status !== "queue" ? <ClipboardIcon /> : <ClipboardListIcon />}

            <p onClick={onCheck.bind(this, index)}>Queue</p>

            <Checkbox
              checked={status === "queue"}
              onClick={onCheck.bind(this, index)}
              color="green"
            />
          </li>
        )}

        {loadingRender && url.split("/comments/")[1].split("/")[0] && (
          <li className={styles.progress}>
            <BatteryEmptyIcon />
            <p>Render</p>
            <Progress max={100} value={loadingRender.loading} />
          </li>
        )}

        {/* 
        <li className={styles.thumbail}>
          <ImageIcon />
          <p>Thumbnail</p>
        </li> */}

        {index === 0 && (
          <li className={styles.queue}>
            <PlayIcon />
            <p>Queue</p>
            <Switch state={queue} setState={setQueue} />

            {loadingRender && <LoadingIcon />}
          </li>
        )}

        <li className={styles.delete}>
          <div onClick={onDelete.bind(this, index)}>
            <BinIcon />
            <p>Remove</p>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Card;
