import React from "react";

import { LoadingIcon, LogoIcon } from "@icon";

import styles from "@styles/components/UI/setup_screen.module.scss";

const SetupScreen: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.branding}>
          <LogoIcon />

          <h3 className={styles.name}>Reddit Video Creator</h3>
        </div>

        <LoadingIcon />

        <h1 className={styles.title}>Setting up things please wait...</h1>
      </div>
    </div>
  );
};

export default SetupScreen;
