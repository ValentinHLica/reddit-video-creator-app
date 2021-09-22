import React, { useEffect, useRef, useState } from "react";

import Button from "./Button";

import { Size, Type } from "../../interface/UI/button";

import { ControlsListItem } from "../../interface/reddit";

import styles from "../../styles/components/UI/dropdown.module.scss";

type Props = {
  icon?: JSX.Element;
  text: string;
  size?: Size;
  type?: Type;
  items: ControlsListItem[];
};

const Dropdown: React.FC<Props> = ({
  icon,
  text,
  size = "md",
  type = "primary",
  items,
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleVisibility = (event: any) => {
      if (container.current && !container.current.contains(event.target)) {
        setVisible(false);
      }
    };

    window.addEventListener("mousedown", handleVisibility);
    return () => {
      window.removeEventListener("mousedown", handleVisibility);
    };
  }, []);

  return (
    <div className={styles.dropdown} ref={container}>
      <Button
        size={size}
        type={type}
        onClick={() => {
          setVisible(true);
        }}
      >
        {icon} {text}
      </Button>

      <ul
        className={`${styles.posts__controls} ${
          visible ? styles[`posts__controls__visible`] : ""
        }`}
      >
        {items.map((item, index) => {
          const { text, icon, onClick } = item;

          return (
            <li className={styles.controls__item} onClick={onClick} key={index}>
              {icon} {text}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Dropdown;
