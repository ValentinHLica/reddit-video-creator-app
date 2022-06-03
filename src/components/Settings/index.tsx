import React from "react";

import { Button, Dropdown } from "@components/UI";
import {
  ArrowDownIcon,
  FolderIcon,
  ImageIcon,
  MusicIcon,
  SpeakerIcon,
  VolumeLoudIcon,
} from "@components/CustomIcons";

import styles from "@styles/components/settings.module.scss";

const Settings: React.FC = () => {
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
          <input type="text" disabled />

          <Button icon={<FolderIcon />} color="green" />
        </>
      ),
    },

    {
      icon: <ImageIcon />,
      title: "Mid Poster:",
      body: (
        <>
          <input type="text" disabled />

          <Button icon={<FolderIcon />} color="green" />
        </>
      ),
    },

    {
      icon: <MusicIcon />,
      title: "Background Music:",
      body: (
        <>
          <input type="text" disabled />

          <Button icon={<FolderIcon />} color="green" />
        </>
      ),
    },

    {
      icon: <VolumeLoudIcon />,
      title: "Voice:",
      body: (
        <>
          <input type="text" disabled />

          <Button icon={<SpeakerIcon />} color="light">
            Listen
          </Button>

          <Dropdown
            icon={<ArrowDownIcon />}
            items={[
              {
                text: "ss",
                onClick: () => {},
              },
            ]}
            text="Change"
          />
        </>
      ),
    },
  ];

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
