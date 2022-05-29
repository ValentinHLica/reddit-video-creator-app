import React from "react";

import { RenderPost } from "@interface/post";

import {
  CheckIcon,
  ClipboardIcon,
  ClipboardListIcon,
  ClockIcon,
  ExternalLinkIcon,
  BinIcon,
  ZapIcon,
} from "@components/CustomIcons";

import styles from "@styles/components/UI/card.module.scss";
import Button from "./Button";
import Checkbox from "./Checkbox";

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

        <a href={url} target="_blank" title="Open on Reddit">
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
              {status !== "publish" ? <ClipboardIcon /> : <ClipboardListIcon />}

              <p onClick={onCheck.bind(this, index)}>Queue</p>

              <Checkbox
                checked={status === "publish"}
                onClick={onCheck.bind(this, index)}
                color="green"
              />
            </>
          )}
        </li>

        <li className={styles.delete}>
          <div onClick={onDelete.bind(this, index)}>
            <BinIcon />
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Card;
