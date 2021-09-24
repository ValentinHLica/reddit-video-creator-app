import React, { useEffect, useState } from "react";

import Button from "./Button";
import { ArrowUpIcon } from "../CustomIcons";

import styles from "../../styles/components/UI/go-top.module.scss";

const GoTop: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);

  const goToTop = () => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.pageYOffset > 30);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Button
      className={`${styles.container} ${
        visible ? styles.container__visible : ""
      }`}
      onClick={goToTop}
    >
      <ArrowUpIcon />
    </Button>
  );
};

export default GoTop;
