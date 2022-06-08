import React, { useContext, useRef } from "react";

import { RenderPost } from "@interface/post";

import {
  ClipboardIcon,
  ClipboardListIcon,
  ClockIcon,
  BinIcon,
  ZapIcon,
  BatteryEmptyIcon,
  PlayIcon,
  ImageIcon,
  ListIcon,
  ArrowDownIcon,
  VideoIcon,
} from "@components/CustomIcons";

import styles from "@styles/components/UI/card.module.scss";
import Checkbox from "./Checkbox";
import Progress from "./Progress";
import Switch from "./Switch";
import Context from "@components/Context";
import Dropdown from "./Dropdown";

type Props = RenderPost & {
  onDelete: (index: number) => void;
  onCheck: (index: number) => void;
  index: number;
};

const Card: React.FC<Props> = ({
  title,
  url,
  duration,
  status,
  subreddit,
  onDelete,
  onCheck,
  index,
}) => {
  const inputEl = useRef<HTMLInputElement>(null);

  const { queue, setQueue, maxVideoTime } = useContext(Context);

  const videoCount = Math.floor(duration / maxVideoTime);

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
              defaultValue={1}
              ref={inputEl}
              onChange={(e) => {
                if (
                  (e.target.value === "" ||
                    Number(e.target.value) > videoCount) &&
                  inputEl.current
                ) {
                  inputEl.current.value = videoCount + "";
                }
              }}
            />
          </div>
        </li>

        <li className={styles.status}>
          {status === "finish" ? (
            <>
              <p>Finished</p> <ZapIcon />
            </>
          ) : (
            <>
              {status !== "queue" ? <ClipboardIcon /> : <ClipboardListIcon />}

              <p onClick={onCheck.bind(this, index)}>Queue</p>

              <Checkbox
                checked={status === "queue"}
                onClick={onCheck.bind(this, index)}
                color="green"
              />
            </>
          )}
        </li>

        <li className={styles.progress}>
          <BatteryEmptyIcon />
          <p>Render</p>
          <Progress max={100} value={30} />
        </li>

        <li className={styles.thumbail}>
          <ImageIcon />
          <p>Thumbnail</p>
        </li>

        {index === 0 && (
          <li className={styles.queue}>
            <PlayIcon />
            <p>Queue</p>
            <Switch state={queue} setState={setQueue} />
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
