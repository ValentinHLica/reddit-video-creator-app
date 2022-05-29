import React, { useState } from "react";

import {
  ArrowDownIcon,
  ArrowUpIcon,
  CollapseIcon,
  ExpandIcon,
  SquareCheckIcon,
  SquareIcon,
  UpsIcon,
} from "@icon";

import { roundUp } from "@utils/helpers";

import { Comment } from "@interface/reddit";

import styles from "@styles/Comments/comment-card.module.scss";

interface Props extends Comment {
  onCheck: () => void;
  onCollapse?: () => void;
  onMove: (index: number, direction: "up" | "down") => void;
  cardIndex: number;
  commentsLength: number;
}

const CommentCard: React.FC<Props> = ({
  author,
  body,
  depth,
  ups,
  selected,
  onCheck,
  onCollapse,
  collapse,
  visible,
  onMove,
  cardIndex,
  commentsLength,
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const stats: {
    text: string;
    icon: JSX.Element;
    className?: string;
    onClick?: () => void;
  }[] = [
    {
      icon: <UpsIcon />,
      text: `${roundUp(ups)} Ups`,
    },
    {
      icon: selected ? <SquareCheckIcon /> : <SquareIcon />,
      text: "Select Comment",
      onClick: onCheck,
      className: selected ? styles.stat__selected : "",
    },
    ...(() => {
      if (collapse) {
        return [
          {
            icon: collapsed ? <ExpandIcon /> : <CollapseIcon />,
            text: collapsed ? "Expand" : "Collapse",
            onClick: () => {
              if (onCollapse) {
                onCollapse();

                setCollapsed(!collapsed);
              }
            },
          },
        ];
      }

      return [];
    })(),
    ...(() => {
      if (depth === 0) {
        const upArrow = {
          icon: <ArrowUpIcon />,
          text: "",
          onClick: () => {
            onMove(cardIndex, "up");
          },
        };

        const downArrow = {
          icon: <ArrowDownIcon />,
          text: "",
          onClick: () => {
            onMove(cardIndex, "down");
          },
        };

        switch (cardIndex) {
          case 0:
            return [downArrow];

          case commentsLength - 1:
            return [upArrow];

          default:
            return [upArrow, downArrow];
        }
      }

      return [];
    })(),
  ];

  return (
    <div
      className={`${styles.comment__card} ${
        selected ? styles.card__selected : ""
      } card__container`}
      style={{
        marginLeft: `${depth * 40}px`,
        marginTop: depth === 0 ? "24px" : "",
        backgroundColor: visible ? "white" : "red",
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