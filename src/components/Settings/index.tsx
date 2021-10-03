import React from "react";

import { BreadCrumb, CardWrapper, Dropdown } from "@ui";
import OutputVideo from "./OutputVideo";
import VoiceChanger from "./VoiceChanger";

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

        <VoiceChanger />
      </CardWrapper>
    </div>
  );
};

export default SettingsPage;
