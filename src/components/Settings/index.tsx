import React from "react";

import OutputVideo from "./OutputVideo";
import VoiceChanger from "./VoiceChanger";

import styles from "@styles/Settings/index.module.scss";

type Props = {
  miniVersion?: boolean;
};

const SettingsPage: React.FC<Props> = ({ miniVersion = false }) => {
  return (
    <ul className={styles.container}>
      <OutputVideo />
      <VoiceChanger />
    </ul>
  );
};

export default SettingsPage;
