import React from "react";
import { Link } from "react-router-dom";

import Spinner from "./Spinner";

import { Size, Type } from "@interface/UI/button";

import styles from "@styles/UI/button.module.scss";

type Props = {
  url?: string;
  className?: string;
  size?: Size;
  type?: Type;
  onClick?: () => void;
  loading?: boolean;
  text?: string;
  icon?: JSX.Element | null;
};

const Button: React.FC<Props> = ({
  url,
  className = "",
  children,
  size = "md",
  type = "primary",
  onClick,
  loading,
  text,
  icon = null,
}) => {
  const attributes = {
    className: `${styles.container} ${className} ${
      styles[`container__${size}`]
    } ${styles[`container__${type}`]} ${!url ? styles.container__btn : ""}`,
  };

  if (url) {
    return (
      <Link to={url} {...attributes}>
        {icon}
        {text && (
          <p
            className={`${styles.text} ${
              icon || loading ? styles.text_with_icon : ""
            }`}
          >
            {text}
          </p>
        )}
      </Link>
    );
  }

  return (
    <button {...attributes} onClick={onClick}>
      {loading && <Spinner size="xs" className={styles.container__loading} />}
      {!loading && icon}
      {text && (
        <p
          className={`${styles.text} ${
            icon || loading ? styles.text_with_icon : ""
          }`}
        >
          {text}
        </p>
      )}
    </button>
  );
};

export default Button;
