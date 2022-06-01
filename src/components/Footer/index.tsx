import React from "react";

import styles from "@styles/components/Footer/index.module.scss";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <p>
        Developed with <span className={styles.heart} /> by
        <a href="https://github.com/valentinHLica">Valentin Lica</a>
      </p>
    </footer>
  );
};

export default Footer;
