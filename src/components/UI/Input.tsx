import React, { LegacyRef } from "react";

import { Size } from "../../interface/UI/button";

import styles from "../../styles/components/UI/input.module.scss";

type Props = {
  type?: "text" | "number";
  placeholder?: string;
  query?: LegacyRef<HTMLInputElement>;
  size?: Size;
};

const Input: React.FC<Props> = ({
  type = "text",
  placeholder,
  query,
  size = "md",
}) => {
  return (
    <input
      className={`${styles.container} ${styles[`container__${size}`]}`}
      type={type}
      placeholder={placeholder}
      ref={query}
    />
  );
};

export default Input;
