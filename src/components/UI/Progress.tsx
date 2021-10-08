import React from "react";

import styles from "@styles/UI/progress.module.scss";

type Props = {
  max: number;
  value: number;
};

const Progress: React.FC<Props> = ({ max, value }) => {
  return <progress max={max} value={value} className={styles.progress} />;
};

export default Progress;
