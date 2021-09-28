import React from "react";

import { SlashIcon } from "@icon";

import styles from "@styles/NotFound/index.module.scss";

const NotFoundError: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.container__title}>
        <SlashIcon /> Something went wrong
      </h1>
    </div>
  );
};

export default NotFoundError;
