import React from "react";

import styles from "@styles/components/settings.module.scss";
import { Button } from "@components/UI";
import { FolderIcon } from "@components/CustomIcons";

const Settings: React.FC = () => {
  const options: {
    title: string;
    body: JSX.Element;
  }[] = [
    {
      title: "Outro:",
      body: (
        <>
          <input type="text" placeholder="Outro text..." />
        </>
      ),
    },

    {
      title: "Export Path:",
      body: (
        <>
          <input type="text" disabled />

          <Button icon={<FolderIcon />} color="green" />
        </>
      ),
    },
  ];

  return (
    <div className={styles.settings}>
      <h1 className={styles.title}>Settings</h1>

      <ul className={styles.options}>
        {options.map(({ title, body }, index) => (
          <li key={index} className={styles.option}>
            <h4 className={styles.opt_title}>{title}</h4>

            <div className={styles.body}>{body}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Settings;
