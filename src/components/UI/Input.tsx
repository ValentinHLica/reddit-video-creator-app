import React, { LegacyRef } from "react";

import { Size } from "@interface/UI/button";

import styles from "@styles/UI/input.module.scss";

type Props = {
  type?: "text" | "number";
  placeholder?: string;
  query?: LegacyRef<HTMLInputElement>;
  size?: Size;
  readOnly?: boolean;
  value?: string | number;
};

const Input: React.FC<Props> = ({
  type = "text",
  placeholder,
  query,
  size = "md",
  readOnly = false,
  value,
}) => {
  return (
    <input
      className={`${styles.container} ${styles[`container__${size}`]}`}
      type={type}
      placeholder={placeholder}
      ref={query}
      readOnly={readOnly}
      value={value}
    />
  );
};

export default Input;
