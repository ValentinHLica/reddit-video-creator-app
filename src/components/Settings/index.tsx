import React from "react";

import OutputVideo from "./OutputVideo";
import VoiceChanger from "./VoiceChanger";

import styles from "@styles/Settings/index.module.scss";

const SettingsPage: React.FC = () => {
  return (
    <ul className={styles.container}>
      <OutputVideo />
      <VoiceChanger />
    </ul>
  );
};

export default SettingsPage;
