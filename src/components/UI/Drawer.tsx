import React, { useEffect, useRef } from "react";

import { Button } from "@ui";
import { MenuIcon, RedditIcon, SettingsIcon } from "@icon";

import styles from "@styles/UI/drawer.module.scss";
import { useHistory } from "react-router";

type Props = {
  visible: boolean;
  setVisible: (state: boolean) => void;
};

const Drawer: React.FC<Props> = ({ visible, setVisible }) => {
  const history = useHistory();

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

  const drawerNav: {
    text: string;
    icon: JSX.Element;
    onClick?: () => void;
    className?: string;
  }[] = [
    {
      text: "Settings",
      icon: <SettingsIcon />,
      onClick: () => {
        history.push("/settings");
      },
    },
  ];

  return (
    <div className={styles.container} ref={container}>
      <Button
        type="empty"
        size="xs"
        icon={<MenuIcon />}
        onClick={() => setVisible(true)}
      />
      <div
        className={`${styles.drawer} ${visible ? styles.drawer__visible : ""}`}
      >
        <div className={styles.drawer__header}>
          <RedditIcon />

          <p>Reddit Video Creator</p>
        </div>

        <div className={styles.drawer__content}>
          <ul className={styles.content__list}>
            {drawerNav.map((item, index) => {
              const { text, icon, className, onClick } = item;

              return (
                <li
                  className={`${styles.list__item} ${className ?? ""} pointer`}
                  onClick={onClick}
                  key={index}
                >
                  {icon} {text}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
