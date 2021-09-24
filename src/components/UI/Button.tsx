import React from "react";

import Spinner from "./Spinner";

import { Size, Type } from "../../interface/UI/button";

import styles from "../../styles/components/UI/button.module.scss";

type Props = {
  url?: string;
  className?: string;
  size?: Size;
  type?: Type;
  onClick?: () => void;
  loading?: boolean;
};

const Button: React.FC<Props> = ({
  url,
  className = "",
  children,
  size = "md",
  type = "primary",
  onClick,
  loading,
}) => {
  const attributes = {
    className: `${styles.container} ${className} ${
      styles[`container__${size}`]
    } ${styles[`container__${type}`]} ${!url ? styles.container__btn : ""}`,
  };

  if (url) {
    return (
      <a href={url} {...attributes}>
        {children}
      </a>
    );
  }

  return (
    <button {...attributes} onClick={onClick}>
      {loading && <Spinner size="xs" className={styles.container__loading} />}
      {children}
    </button>
  );
};

export default Button;
