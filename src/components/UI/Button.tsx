import React from "react";

import { Size, Type } from "../../interface/UI/button";

import styles from "../../styles/components/Footer/index.module.scss";

type Props = {
  url?: string;
  className?: string;
  size?: Size;
  type?: Type;
  onClick?: () => void;
};

const Button: React.FC<Props> = ({
  url,
  className = "",
  children,
  size = "md",
  type = "primary",
  onClick,
}) => {
  const attributes = {
    className: `${styles.container} ${className} ${
      styles[`container__${size} `]
    } ${styles[`container__${type}`]}`,
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
      {children}
    </button>
  );
};

export default Button;
