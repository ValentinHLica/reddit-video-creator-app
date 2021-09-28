import React, { useContext, useEffect, useState } from "react";

import Context from "@context";
import { AlertCircleIcon, WifiIcon } from "@icon";

import { Type } from "@interface/UI/button";

import styles from "@styles/UI/notification.module.scss";

type Props = {
  className?: string;
  type?: Type;
};

const Notification: React.FC<Props> = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const { offline } = useContext(Context);
  const [firstLoad, setFirstLoad] = useState<boolean>(true);

  useEffect(() => {
    if (!firstLoad) {
      setVisible(true);

      const timer = setTimeout(() => {
        if (!offline) {
          setVisible(false);
        }
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    }

    setFirstLoad(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offline]);

  const type: Type = offline ? "danger" : "success";
  const typeClass = styles[`container__${type}`];
  const visibleClass = visible ? styles.container__visible : "";

  const iconEl = offline ? <AlertCircleIcon /> : <WifiIcon />;
  const text = offline ? "Oops, you are offline." : "Were back online!";

  return (
    <div className={`${styles.container} ${typeClass} ${visibleClass}`}>
      {iconEl} {text}
    </div>
  );
};

export default Notification;
