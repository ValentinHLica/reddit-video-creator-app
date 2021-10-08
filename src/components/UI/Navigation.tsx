import React from "react";

import ThemeSwitcher from "./ThemeSwitcher";

import styles from "@styles/UI/navigation.module.scss";
import { Type } from "@interface/UI/button";

const app = window.require("@electron/remote");

const Navigation: React.FC = () => {
  const nav: {
    type: Type;
    onClick: () => void;
  }[] = [
    {
      type: "success",
      onClick: () => {
        app.getCurrentWindow().minimize();
      },
    },
    {
      type: "danger",
      onClick: () => {
        app.getCurrentWindow().close();
      },
    },
  ];

  return (
    <div className={`${styles.container} navigation`}>
      <ThemeSwitcher />

      <ul className={styles.app__nav}>
        {nav.map((item, index) => {
          const { type, onClick } = item;

          return (
            <li
              className={`${styles.nav__item} ${styles[`nav__item__${type}`]}`}
              onClick={onClick}
              key={index}
            />
          );
        })}
      </ul>

      <div className={styles.drag} />
    </div>
  );
};

export default Navigation;
