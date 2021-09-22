import React, { Fragment } from "react";

import styles from "../../styles/components/UI/modal.module.scss";

type Props = {
  visible: boolean;
  setModal: (state: boolean) => void;
};

const Modal: React.FC<Props> = ({ visible, setModal, children }) => {
  return (
    <Fragment>
      <div className={`${styles.modal} ${visible && styles.modal__visible}`}>
        {children}
      </div>
      <div
        className={`${styles.modal__background} ${
          visible && styles.modal__background__visible
        }`}
        onClick={setModal.bind(this, false)}
      />
    </Fragment>
  );
};

export default Modal;
