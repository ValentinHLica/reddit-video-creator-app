import React from "react";

import { LoadingIcon } from "@icon";

import styles from "@styles/components/UI/setup_screen.module.scss";

const SetupScreen: React.FC = () => {
  return (
    <div className={styles.container}>
      <LoadingIcon />

      <h1 className={styles.title}>Setting up things please wait...</h1>
    </div>
  );
};

export default SetupScreen;
