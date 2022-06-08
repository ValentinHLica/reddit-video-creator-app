import React, { useContext, useEffect, useRef, useState } from "react";

import { open } from "@tauri-apps/api/dialog";

import { Button, Dropdown } from "@components/UI";
import {
  ArrowDownIcon,
  ClockIcon,
  FolderIcon,
  ImageIcon,
  MusicIcon,
  SaveIcon,
  VolumeLoudIcon,
} from "@components/CustomIcons";

import styles from "@styles/components/settings.module.scss";
import Context from "@components/Context";

import voices from "../../data/voices";

const Settings: React.FC = () => {
  const {
    exportPath,
    setExportPath,
    midPoster,
    setMidPoster,
    backgroundMusic,
    setBackgroundMusic,
    maxVideoTime,
    setMaxVideoTime,
    voice,
    setVoice,
  } = useContext(Context);

  const maxTimeInput = useRef<HTMLInputElement>(null);

  const submit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (!maxTimeInput.current) return;

    const value = Number(maxTimeInput.current.value) ?? 1;

    if (value > 1 && value <= 100) {
      localStorage.setItem("max-time", value + "");
      // setMaxVideoTime(value);
    }
  };

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
      icon: <ClockIcon />,
      title: "Max Video Time:",
      body: (
        <>
          <form onSubmit={submit}>
            <input
              type="number"
              min={1}
              max={100}
              ref={maxTimeInput}
              value={maxVideoTime}
              onChange={(e) => setMaxVideoTime(Number(e.target.value) ?? 1)}
            />

            <Button icon={<SaveIcon />} type="submit" color="green" />
          </form>
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
    const maxTime = localStorage.getItem("max-time");

    if (exportPath) setExportPath(exportPath);

    if (midPath) setMidPoster(midPath);

    if (musicPath) setBackgroundMusic(musicPath);

    if (voice) setVoice(voice);

    if (maxTime) setMaxVideoTime(Number(maxTime));
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
