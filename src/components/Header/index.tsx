import React from "react";

import { LogoIcon } from "@icon";

import styles from "@styles/components/Header/index.module.scss";

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <LogoIcon />

        <h2>Reddit Video Creator</h2>
      </div>
    </header>
  );
};

export default Header;
