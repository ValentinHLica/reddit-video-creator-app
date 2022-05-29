import React from "react";

import { Colors, Size } from "@interface/UI/button";

import styles from "@styles/components/UI/button.module.scss";

type Props = {
  size?: Size;
  color?: Colors;
  icon?: JSX.Element;
  onClick?: () => void;
  children?: React.ReactNode;
  type?: "button" | "submit";
};

const Button: React.FC<Props> = ({
  size = "md",
  color = "blue",
  icon,
  onClick,
  children,
  type = "button",
}) => {
  return (
    <button
      className={`${styles.button} ${styles[`button__${size}`]} ${
        styles[`button__${color}`]
      }`}
      onClick={onClick}
      type={type}
    >
      {icon} {children}
    </button>
  );
};

export default Button;
