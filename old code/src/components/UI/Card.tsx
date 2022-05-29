import React from "react";

import { ArrowDownIcon, ArrowUpIcon } from "@icon";

import { CardProps, ActionProps } from "@interface/UI/card";

import styles from "@styles/UI/card.module.scss";

const CardActions: React.FC<ActionProps> = ({
  icon,
  text,
  onClick,
  className = "",
}) => {
  return (
    <li className={`${styles.footer__item} ${className}`} onClick={onClick}>
      {icon}
      <p className={styles.item__content}>{text}</p>
    </li>
  );
};

const Card: React.FC<CardProps> = ({
  title,
  desc,
  route,
  score,
  author,
  actions,
  comment,
  children,
}) => {
  return (
    <div className={`${styles.container} card__container`}>
      <div className={styles.container__card}>
        {route && author && (
          <div className={styles.card__info}>
            <p className={styles.card__route}>
              {route}/{author}
            </p>
          </div>
        )}

        <div className={styles.card__content}>
          <h3 className={styles.content__title}>{title}</h3>

          {desc && desc.length > 1 && (
            <h4 className={styles[`content__${comment ? "comment" : "desc"}`]}>
              {desc}
            </h4>
          )}
        </div>

        {actions && (
          <ul className={styles.card__actions}>
            {actions.map((action, index) => (
              <CardActions
                key={index}
                text={action.text}
                icon={action.icon}
                onClick={action.onClick}
                className={action.className}
              />
            ))}
          </ul>
        )}

        {children && <div>{children}</div>}
      </div>

      {score && (
        <div className={styles.card__score}>
          <ArrowUpIcon />
          <p>{score}</p>
          <ArrowDownIcon />
        </div>
      )}
    </div>
  );
};

export default Card;