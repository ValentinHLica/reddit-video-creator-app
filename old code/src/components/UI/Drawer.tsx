import React, { useEffect, useRef } from "react";

import { Button } from "@ui";
import { SettingsIcon } from "@icon";
import SettingsPage from "@components/Settings";

import styles from "@styles/UI/drawer.module.scss";

type Props = {
  visible: boolean;
  setVisible: (state: boolean) => void;
};

const Drawer: React.FC<Props> = ({ visible, setVisible }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleVisibility = (event: any) => {
      if (container.current && !container.current.contains(event.target)) {
        setVisible(false);
      }
    };

    window.addEventListener("click", handleVisibility);
    return () => {
      window.removeEventListener("click", handleVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container} ref={container}>
      <Button
        type="empty"
        size="xs"
        icon={<SettingsIcon />}
        onClick={() => setVisible(true)}
      />
      <div
        className={`${styles.drawer} ${
          visible ? styles.drawer__visible : ""
        } drawer`}
      >
        <SettingsPage />
      </div>
    </div>
  );
};

export default Drawer;
