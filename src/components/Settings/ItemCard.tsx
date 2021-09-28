import React from "react";

import styles from "@styles/Settings/item-card.module.scss";

type Props = {
  title: string;
};

const ItemCard: React.FC<Props> = ({ title, children }) => {
  return (
    <div className={`${styles.container__card} settings__card`}>
      <h3 className={styles.card__title}>{title}</h3>
      <div className={styles.card__content}>{children}</div>
    </div>
  );
};

export default ItemCard;
