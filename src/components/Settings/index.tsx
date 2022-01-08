import React from "react";

import OutputVideo from "./OutputVideo";
import VoiceChanger from "./VoiceChanger";
import Poster from "./Poster";

import styles from "@styles/Settings/index.module.scss";

const SettingsPage: React.FC = () => {
  return (
    <ul className={styles.container}>
      <OutputVideo />
      <VoiceChanger />
      <Poster />
    </ul>
  );
};

export default SettingsPage;
