import React, { useEffect, useState } from "react";

import { balconPath } from "@config/paths";

import { Dropdown } from "@ui";
import Card from "./ItemCard";

import styles from "@styles/Settings/voice-changer.module.scss";

const { execFile } = window.require("child_process");

const VoiceChanger: React.FC = () => {
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [voices, setVoices] = useState<string[]>([]);

  const getSelectedVoice = () => {
    const voice = localStorage.getItem("voice");

    if (voice) {
      setSelectedVoice(voice);
    }
  };

  const getVoices = () => {
    return new Promise((resolve) => {
      execFile(balconPath, ["-l"], (error: any, stdout: string) => {
        if (error) {
          throw error;
        }

        const listOfVoice = stdout;

        console.log(stdout);

        // SAPI 5:
        // IVONA 2 Eric
        // Microsoft Hazel Desktop
        // Microsoft Zira Desktop
        // ScanSoft Daniel_Full_22kHz

        resolve(listOfVoice);
      });
    });
  };

  useEffect(() => {
    getSelectedVoice();

    getVoices();
  }, []);

  return (
    <Card title="Change Voice">
      <div className={styles.container}>
        <Dropdown text={selectedVoice} items={[]} />
      </div>
    </Card>
  );
};

export default VoiceChanger;
