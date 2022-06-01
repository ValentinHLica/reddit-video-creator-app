import React from "react";

import { RenderPost } from "@interface/post";

import {
  ClipboardIcon,
  ClipboardListIcon,
  ClockIcon,
  BinIcon,
  ZapIcon,
  BatteryEmptyIcon,
} from "@components/CustomIcons";

import styles from "@styles/components/UI/card.module.scss";
import Checkbox from "./Checkbox";
import Progress from "./Progress";

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
  return (
    <div className={`${styles.card} `}>
      <div className={styles.details}>
        <p className={styles.subreddit}>r/{subreddit}</p>

        <a href={url} target="_blank" rel="noreferrer" title="Open on Reddit">
          <h3 className={styles.title}>{title}</h3>
        </a>

        <p className={`${styles.status} ${styles[`status__${status}`]}`}>
          {status}
        </p>
      </div>

      <ul className={styles.actions}>
        <li>
          <ClockIcon />

          <p>Time</p>

          <div className={styles.input}>
            <input
              type="number"
              min={1}
              max={100}
              placeholder="Duration"
              defaultValue={duration}
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
          <div>
            <BatteryEmptyIcon />
            <p>Render</p>
            <Progress max={100} value={30} />
          </div>
        </li>

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
