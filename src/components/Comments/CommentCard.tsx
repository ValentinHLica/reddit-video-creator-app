import React from "react";

import {
  ClockIcon,
  SquareCheckIcon,
  SquareIcon,
  ThumbUpIcon,
} from "../CustomIcons";

import { roundUp } from "../../utils/helpers";

import { Comment } from "../../interface/reddit";

import styles from "../../styles/components/Comments/comment-card.module.scss";

interface Props extends Comment {
  onCheck: () => void;
}

const CommentCard: React.FC<Props> = ({
  author,
  body,
  created_utc,
  depth,
  ups,
  selected,
  onCheck,
}) => {
  const stats = [
    {
      icon: <ThumbUpIcon />,
      text: `${roundUp(ups)} Ups`,
    },
    {
      icon: <ClockIcon />,
      text: new Date(created_utc).toLocaleDateString("en-US"),
    },
    {
      icon: selected ? <SquareCheckIcon /> : <SquareIcon />,
      text: `Select Comment`,
      onClick: onCheck,
      className: selected ? styles.stat__selected : "",
    },
  ];

  return (
    <div
      className={`${styles.comment__card} ${
        selected ? styles.card__selected : ""
      } card__container`}
      style={{
        marginLeft: `${depth * 40}px`,
        marginTop: depth === 0 ? "24px" : "",
      }}
    >
      <div className={styles.comment__details}>
        <p className={styles.comment__author}>/u/{author}</p>

        <ul className={styles.comment__stats}>
          {stats.map((stat, index) => {
            const { text, icon, onClick, className } = stat;

            return (
              <li key={index} onClick={onClick} className={className}>
                {icon} {text}
              </li>
            );
          })}
        </ul>
      </div>

      <p className={styles.comment__content}>{body}</p>
    </div>
  );
};

export default CommentCard;
