import React, { useEffect, useState } from "react";

import { HotIcon, SunIcon, RissingIcon, TopIcon } from "../CustomIcons";
import Dropdown from "../UI/Dropdown";

import { getPosts } from "../../utils/redditApi";

import {
  Controls as ControlsType,
  ControlsList,
  Post,
  TopFilter,
} from "../../interface/reddit";

import styles from "../../styles/components/Posts/controls.module.scss";
import Button from "../UI/Button";

type Props = {
  subredditId: string;
  setPosts: (posts: Post[]) => void;
};

const Controls: React.FC<Props> = ({ subredditId, setPosts }) => {
  const [controls, setControls] = useState<ControlsType>({
    filter: "hot",
  });

  const [controlsList, setControlsList] = useState<ControlsList[]>([
    {
      icon: <HotIcon />,
      text: "hot",
    },
    {
      icon: <SunIcon />,
      text: "new",
    },
    {
      icon: <TopIcon />,
      text: "top",
      items: ["day", "week", "month", "year", "all"].map((item) => ({
        text: item,
        onClick: () => {
          setControls({
            filter: "top",
            topFilter: item as TopFilter,
          });
        },
      })),
    },
    {
      icon: <RissingIcon />,
      text: "rising",
    },
  ]);

  const getPostsLoad = async () => {
    setPosts([]);

    const data = await getPosts(
      subredditId,
      controls.filter,
      controls.topFilter
    );

    setPosts(data);
  };

  useEffect(() => {
    getPostsLoad();
  }, [controls]);

  return (
    <ul className={styles.posts__controls}>
      {controlsList.map((control, index) => {
        const { icon, text, items } = control;

        const type = controls.filter === control.text ? "primary" : "light";

        if (items) {
          return <Dropdown text={text} icon={icon} items={items} type={type} />;
        }

        return (
          <li
            className={styles.controls__item}
            onClick={() => {
              setControls({
                filter: control.text,
              });
            }}
            key={index}
          >
            <Button type={type}>
              {icon} {text}
            </Button>
          </li>
        );
      })}
    </ul>
  );
};

export default Controls;
