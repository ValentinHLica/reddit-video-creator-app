import React, { ChangeEventHandler, LegacyRef } from "react";

import { Size } from "@interface/UI/button";

import styles from "@styles/UI/input.module.scss";

type Props = {
  type?: "text" | "number";
  placeholder?: string;
  query?: LegacyRef<HTMLInputElement>;
  size?: Size;
  readOnly?: boolean;
  value?: string | number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

const Input: React.FC<Props> = ({
  type = "text",
  placeholder,
  query,
  size = "md",
  readOnly = false,
  value,
  onChange,
}) => {
  return (
    <input
      className={`${styles.container} ${styles[`container__${size}`]} input`}
      type={type}
      placeholder={placeholder}
      ref={query}
      readOnly={readOnly}
      value={value}
      onChange={onChange}
    />
  );
};

export default Input;
