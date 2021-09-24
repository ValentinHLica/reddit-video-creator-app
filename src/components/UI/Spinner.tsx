import React from "react";

import { SpinnerIcon } from "../CustomIcons";

import { Size } from "../../interface/UI/button";

import styles from "../../styles/components/UI/spinner.module.scss";

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
