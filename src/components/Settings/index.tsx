import React, { useEffect, useState } from "react";

import { open } from "@tauri-apps/api/dialog";

import { Button, Dropdown } from "@components/UI";
import {
  ArrowDownIcon,
  FolderIcon,
  ImageIcon,
  MusicIcon,
  VolumeLoudIcon,
} from "@components/CustomIcons";

import styles from "@styles/components/settings.module.scss";

const Settings: React.FC = () => {
  const [exportPath, setExportPath] = useState<string>("");
  const [midPoster, setMidPoster] = useState<string>("");
  const [backgroundMusic, setBackgroundMusic] = useState<string>("");

  const voices = [
    "AriaNeural",
    "JennyNeural",
    "GuyNeural",
    "AmberNeural",
    "AshleyNeural",
    "CoraNeural",
    "ElizabethNeural",
    "MichelleNeural",
    "MonicaNeural",
    "AnaNeural",
    "BrandonNeural",
    "ChristopherNeural",
    "JacobNeural",
    "EricNeural",
  ];

  const [voice, setVoice] = useState(voices[0]);

  const options: {
    icon?: JSX.Element;
    title: string;
    body: JSX.Element;
  }[] = [
    {
      icon: <FolderIcon />,
      title: "Output Folder:",
      body: (
        <>
          <input type="text" disabled value={exportPath} />

          <Button
            icon={<FolderIcon />}
            onClick={async () => {
              const path = (await open({
                directory: true,
                multiple: false,
              })) as string | null;

              if (!path) {
                localStorage.removeItem("export");

                setExportPath("");

                return;
              }

              localStorage.setItem("export", path);

              setExportPath(path);
            }}
            color="green"
          />
        </>
      ),
    },

    {
      icon: <ImageIcon />,
      title: "Mid Poster:",
      body: (
        <>
          <input type="text" disabled value={midPoster} />

          <Button
            icon={<FolderIcon />}
            onClick={async () => {
              const path = (await open({
                directory: false,
                multiple: false,
                filters: [{ name: "Images", extensions: ["png", "jpg"] }],
              })) as string | null;

              if (!path) {
                localStorage.removeItem("mid");

                setMidPoster("");

                return;
              }

              localStorage.setItem("mid", path);

              setMidPoster(path);
            }}
            color="green"
          />
        </>
      ),
    },

    {
      icon: <MusicIcon />,
      title: "Background Music:",
      body: (
        <>
          <input type="text" disabled value={backgroundMusic} />

          <Button
            icon={<FolderIcon />}
            onClick={async () => {
              const path = (await open({
                directory: false,
                multiple: false,
                filters: [{ name: "Images", extensions: ["wav", "mp3"] }],
              })) as string;

              if (!path) {
                localStorage.removeItem("music");

                setBackgroundMusic("");

                return;
              }

              localStorage.setItem("music", path);

              setBackgroundMusic(path);
            }}
            color="green"
          />
        </>
      ),
    },

    {
      icon: <VolumeLoudIcon />,
      title: "Voice:",
      body: (
        <>
          <input type="text" disabled value={voice} />

          {/* 
          <Button icon={<SpeakerIcon />} color="light">
            Listen
          </Button> */}

          <Dropdown
            icon={<ArrowDownIcon />}
            items={voices.map((name) => ({
              text: name,
              onClick: () => {
                localStorage.setItem("voice", name);
                setVoice(name);
              },
            }))}
            text="Change"
          />
        </>
      ),
    },
  ];

  useEffect(() => {
    const exportPath = localStorage.getItem("export");
    const midPath = localStorage.getItem("mid");
    const musicPath = localStorage.getItem("music");
    const voice = localStorage.getItem("voice");

    if (exportPath) setExportPath(exportPath);

    if (midPath) setMidPoster(midPath);

    if (musicPath) setBackgroundMusic(musicPath);

    if (voice) setVoice(voice);
  }, []);

  return (
    <div className={styles.settings}>
      <h1 className={styles.title}>Settings</h1>

      <ul className={styles.options}>
        {options.map(({ title, body, icon }, index) => (
          <li key={index} className={styles.option}>
            <p className={styles.opt_title}>
              {icon} {title}
            </p>

            <div className={styles.body}>{body}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Settings;
