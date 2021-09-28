import React from "react";

import { BreadCrumb, CardWrapper } from "@ui";
import OutputVideo from "./OutputVideo";

import styles from "@styles/Settings/index.module.scss";

const SettingsPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.container__header}>
        <BreadCrumb
          nav={[
            {
              text: "Settings",
            },
          ]}
        />
      </div>

      <h1 className={styles.container__title}>Settings</h1>

      <CardWrapper>
        <OutputVideo />
      </CardWrapper>
    </div>
  );
};

export default SettingsPage;
