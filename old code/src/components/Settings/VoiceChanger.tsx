import React, { useEffect, useState } from "react";

import { Button, Dropdown } from "@ui";
import { VolumeLoudIcon } from "@icon";

import { getVoices, listenVoice } from "@utils/helpers";

const VoiceChanger: React.FC = () => {
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [voices, setVoices] = useState<string[]>([]);
  const [audioPath, setAudioPath] = useState<string | null>(null);

  const loadVoices = async () => {
    let listOfVoices: string[];

    const balcon = localStorage.getItem("balcon");
    const bal4web = localStorage.getItem("bal4web");

    try {
      listOfVoices = getVoices({
        bal4web,
        balcon,
        customAudio: true,
      });

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
    <li>
      <span>
        <VolumeLoudIcon />

        <h5>Listen Audio</h5>
      </span>

      {audioPath && <audio hidden src={audioPath} />}

      <div>
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

        <Button
          size="xs"
          text="Speak"
          onClick={async () => {
            setAudioPath(
              await listenVoice({
                text: `Hello my name is ${selectedVoice.replace("Neural", "")}`,
                customAudio: true,
              })
            );
          }}
        />
      </div>
    </li>
  );
};

export default VoiceChanger;
