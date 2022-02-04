import React from "react";

import OutputVideo from "./OutputVideo";
import VoiceChanger from "./VoiceChanger";
import Cli from "./Cli";
import CustomContent from "./CustomContent";

import styles from "@styles/settings.module.scss";

const SettingsPage: React.FC = () => {
  return (
    <ul className={styles.container}>
      <CustomContent />

      <OutputVideo />

      <VoiceChanger />

      <Cli />
    </ul>
  );
};

export default SettingsPage;
