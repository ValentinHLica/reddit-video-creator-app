import React, { useEffect, useRef, useState } from "react";

import Button from "./Button";

import styles from "@styles/components/UI/dropdown.module.scss";
import { VolumeLoudIcon } from "@components/CustomIcons";

type Props = {
  icon?: JSX.Element;
  text?: string;
  items: {
    text: string;
    onClick: () => void;
  }[];
  onClick?: () => void;
  children?: React.ReactNode;
};

const Dropdown: React.FC<Props> = ({ icon, items, onClick, children }) => {
  const container = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [itemIndex, setItemIndex] = useState<number | null>(null);

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
  }, []);

  return (
    <div className={styles.dropdown} ref={container}>
      <Button
        onClick={() => {
          setVisible(true);

          if (onClick) {
            onClick();
          }
        }}
        icon={icon}
        color="green"
      >
        {children}
      </Button>

      <ul
        className={`${styles.posts__controls} ${
          visible ? styles[`posts__controls__visible`] : ""
        }`}
      >
        {items.map((item, index) => {
          const { text, onClick } = item;

          const indexing = itemIndex !== null && itemIndex === index;

          return (
            <li
              className={`${styles.controls__item} ${
                indexing ? styles.controls__item__selected : ""
              }`}
              onClick={() => {
                setItemIndex(index);
                onClick();
              }}
              key={index}
            >
              {text}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Dropdown;
