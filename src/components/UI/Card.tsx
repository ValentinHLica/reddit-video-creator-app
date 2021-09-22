import React from "react";

import { ArrowDownIcon, ArrowUpIcon } from "../CustomIcons";

import { CardProps, ActionProps } from "../../interface/UI/card";

import styles from "../../styles/components/UI/card.module.scss";

const CardActions: React.FC<ActionProps> = ({ icon, text, onClick }) => {
  return (
    <li className={styles.footer__item} onClick={onClick}>
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
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.container__card}>
        <div className={styles.card__info}>
          <p className={styles.card__route}>
            {route}/{author}
          </p>
        </div>

        <div className={styles.card__content}>
          <h3 className={styles.content__title}>{title}</h3>

          {desc && <h4 className={styles.content__desc}>{desc}</h4>}
        </div>

        {actions && (
          <ul className={styles.card__actions}>
            {actions.map((action, index) => (
              <CardActions
                key={index}
                text={action.text}
                icon={action.icon}
                onClick={action.onClick}
              />
            ))}
          </ul>
        )}
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
