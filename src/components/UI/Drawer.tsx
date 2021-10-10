import React, { useEffect, useRef } from "react";

import { Button } from "@ui";
import { MenuIcon, RedditIcon, SettingsIcon } from "@icon";

import styles from "@styles/UI/drawer.module.scss";
import SettingsPage from "@components/Settings";

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

  const drawerNav: {
    content: string | JSX.Element;
    icon?: JSX.Element;
    onClick?: () => void;
    className?: string;
  }[] = [
    {
      content: "Settings",
      icon: <SettingsIcon />,
    },
    {
      content: <SettingsPage miniVersion={true} />,
      onClick: () => {},
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
        className={`${styles.drawer} ${
          visible ? styles.drawer__visible : ""
        } drawer`}
      >
        <div className={styles.drawer__header}>
          <RedditIcon />

          <p>Reddit Video Creator</p>
        </div>

        <div className={styles.drawer__content}>
          <ul className={styles.content__list}>
            {drawerNav.map((item, index) => {
              const { content, icon, className, onClick } = item;

              return (
                <li
                  className={`${styles.list__item} ${className ?? ""}`}
                  onClick={onClick}
                  key={index}
                >
                  {icon} {content}
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
