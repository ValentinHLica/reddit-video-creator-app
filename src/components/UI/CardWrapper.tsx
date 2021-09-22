import React from "react";

import styles from "../../styles/components/UI/card-wrapper.module.scss";

type Props = {
  className?: string;
};

const CardWrapper: React.FC<Props> = ({ className = "", children }) => {
  return <div className={`${styles.container} ${className}`}>{children}</div>;
};

export default CardWrapper;
