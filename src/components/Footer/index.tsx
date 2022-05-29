import React from "react";

import styles from "@styles/components/Footer/index.module.scss";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <p>
        © {new Date().getFullYear()} Reddit Video Creator. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
