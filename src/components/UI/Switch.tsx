import React from "react";

import styles from "@styles/components/UI/switch.module.scss";

type Props = {
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
};

const Switch: React.FC<Props> = ({ state, setState }) => {
  return (
    <div
      className={`${styles.switch} ${state ? styles.switch__on : ""}`}
      onClick={() => {
        setState((prevState) => !prevState);
      }}
    >
      <div className={styles.switch__button} />
    </div>
  );
};

export default Switch;
