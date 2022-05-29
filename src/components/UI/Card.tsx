import React from "react";

import { RenderPost } from "@interface/post";

import { ClockIcon } from "@components/CustomIcons";

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
  estimatedDuration,
  status,
  subreddit,
  onDelete,
  onCheck,
  index,
}) => {
  const actions: { body: string | JSX.Element; icon: JSX.Element }[] = [
    {
      body: (
        <>
          Duration:
          <input
            type="number"
            min={1}
            max={100}
            placeholder="Duration"
            defaultValue={duration}
          />
          <p>Max {estimatedDuration.toFixed(0)} min</p>
        </>
      ),
      icon: <ClockIcon />,
    },
  ];

  return (
    <div className={styles.card}>
      <div className={styles.details}>
        <p className={styles.subreddit}>r/{subreddit}</p>

        <div className={styles.status}>
          {status === "finish" ? (
            <p>Finished</p>
          ) : (
            <>
              <p>{status}:</p>

              <Checkbox
                checked={status === "publish"}
                onClick={onCheck.bind(this, index)}
                color="green"
              />
            </>
          )}
        </div>
      </div>

      <h2 className={styles.title}>{title}</h2>

      <ul className={styles.actions}>
        {actions.map(({ body, icon }, index) => (
          <li key={index}>
            {icon} {body}
          </li>
        ))}

        <Button color="red" onClick={onDelete.bind(this, index)}>
          Delete
        </Button>
      </ul>
    </div>
  );
};

export default Card;
