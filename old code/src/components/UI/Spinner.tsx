import React from "react";

import { SpinnerIcon } from "@icon";

import { Size } from "@interface/UI/button";

import styles from "@styles/UI/spinner.module.scss";

type Props = {
  size?: Size;
  className?: string;
};

const Spinner: React.FC<Props> = ({ size = "md", className }) => {
  return (
    <div
      className={`${styles.container} ${styles[`container__${size}`]} ${
        className ?? ""
      }`}
    >
      <SpinnerIcon />
    </div>
  );
};

export default Spinner;
