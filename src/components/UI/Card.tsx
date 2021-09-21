import React from "react";

import { CardProps } from "../../interface/UI/card";

import styles from "../../styles/components/UI/card.module.scss";

type FooterProps = {
  icon?: JSX.Element;
};

const CardFooterItem: React.FC<FooterProps> = ({ icon, children }) => {
  return (
    <li className={styles.footer__item}>
      {icon}
      <p className={styles.item__content}>{children}</p>
    </li>
  );
};

const Card: React.FC<CardProps> = ({ title, desc, route, score, author }) => {
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

        <div className="card__actions">
          <p className="card__comments"></p>
        </div>
      </div>
    </div>
  );
};

export default Card;
