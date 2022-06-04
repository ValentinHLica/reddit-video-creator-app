import React from "react";
import { LoadingIcon } from "@components/CustomIcons";

import styles from "@styles/components/UI/setup_screen.module.scss";

const SetupScreen: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Setting up things please wait...</h1>

      <LoadingIcon />
    </div>
  );
};

export default SetupScreen;