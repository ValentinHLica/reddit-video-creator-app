import React, { useEffect, useState } from "react";

import { Button, Dropdown } from "@ui";
import { HeadphoneIcon, VolumeLoudIcon } from "@icon";
import Card from "./ItemCard";
import { getVoices } from "@utils/helpers";

import styles from "@styles/Settings/voice-changer.module.scss";

const VoiceChanger: React.FC = () => {
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [voices, setVoices] = useState<string[]>([]);

  const loadVoices = async () => {
    let listOfVoices: string[];
    try {
      listOfVoices = await getVoices();

      setVoices(listOfVoices);

      const voice = localStorage.getItem("voice");

      if (voice) {
        setSelectedVoice(voice);
      } else {
        setSelectedVoice(listOfVoices[0]);

        localStorage.setItem("voice", listOfVoices[0]);
      }
    } catch (error) {}
  };

  const onVoiceChange = (voice: string) => {
    localStorage.setItem("voice", voice);

    setSelectedVoice(voice);
  };

  useEffect(() => {
    loadVoices();
  }, []);

  return (
    <Card title={<>{<HeadphoneIcon />} Change Voice</>}>
      <div className={styles.container}>
        <div className={styles.dropdown}>
          <Dropdown
            size="xs"
            type="light"
            text={selectedVoice}
            items={voices.map((voice) => {
              return {
                text: voice,
                onClick: onVoiceChange.bind(this, voice),
              };
            })}
            onClick={() => {
              loadVoices();
            }}
          />
        </div>

        <Button size="xs" text="Speak" type="light" icon={<VolumeLoudIcon />} />
      </div>
    </Card>
  );
};

export default VoiceChanger;
