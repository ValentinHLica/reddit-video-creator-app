import React from "react";

import styles from "@styles/components/UI/modal.module.scss";

type Props = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
  className?: string;
};

const Modal: React.FC<Props> = ({
  visible,
  setVisible,
  children,
  className = "",
}) => {
  return (
    <>
      <div
        className={`${styles.modal__background} ${
          !visible ? styles.modal__background__hidden : ""
        }`}
        onClick={() => setVisible(false)}
      />
      <div
        className={`${styles.modal} ${
          !visible ? styles.modal__hidden : ""
        } ${className}`}
      >
        {children}
      </div>
    </>
  );
};

export default Modal;
