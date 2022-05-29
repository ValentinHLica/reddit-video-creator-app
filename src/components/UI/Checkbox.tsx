import React from "react";

import styles from "@styles/components/UI/checkbox.module.scss";
import { CheckIcon } from "@icon";
import { Colors } from "@interface/UI/button";

type Props = {
  color?: Colors;
  checked: boolean;
  onClick?: () => void;
  id?: string;
  disabled?: boolean;
  icon?: JSX.Element;
};

const Checkbox: React.FC<Props> = ({
  color = "blue",
  checked,
  onClick,
  id,
  disabled,
  icon,
}) => {
  return (
    <div
      className={`${styles.checkbox} ${
        checked ? styles[`checkbox__${color}`] : styles["checkbox__light"]
      }`}
      onClick={() => !disabled && onClick && onClick()}
      id={id}
    >
      {checked && (icon ?? <CheckIcon />)}
    </div>
  );
};

export default Checkbox;
