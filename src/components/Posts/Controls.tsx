import React, { useEffect, useState } from "react";

import { Dropdown, Button } from "@ui";
import { HotIcon, SunIcon, RissingIcon, TopIcon } from "@icon";

import { getPosts } from "@utils/redditApi";

import {
  Controls as ControlsType,
  ControlsList,
  Post,
  TopFilter,
} from "@interface/reddit";

import styles from "@styles/Posts/controls.module.scss";

type Props = {
  subredditId: string;
  setPosts: (posts: Post[]) => void;
  setLoading: (state: boolean) => void;
  setError: (state: boolean) => void;
};

const Controls: React.FC<Props> = ({
  subredditId,
  setPosts,
  setLoading,
  setError,
}) => {
  const [controls, setControls] = useState<ControlsType>({
    filter: "hot",
  });

  const controlsList: ControlsList[] = [
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
  ];

  const getPostsLoad = async () => {
    setError(false);
    setLoading(true);
    setPosts([]);

    try {
      const { data } = await getPosts(
        subredditId,
        controls.filter,
        controls.topFilter
      );

      setPosts(data);
    } catch (error) {
      setError(true);
    }

    setLoading(false);
  };

  useEffect(() => {
    getPostsLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controls]);

  return (
    <ul className={styles.posts__controls}>
      {controlsList.map((control, index) => {
        const { icon, text, items } = control;

        const type = controls.filter === control.text ? "primary" : "light";

        if (items) {
          return (
            <div className={styles.controls__item} key={index}>
              <Dropdown
                text={text}
                icon={icon}
                items={items}
                type={type}
                size="xs"
              />
            </div>
          );
        }

        return (
          <li
            className={styles.controls__item}
            onClick={() => {
              setControls({
                filter: control.text,
                topFilter: undefined,
              });
            }}
            key={index}
          >
            <Button type={type} size="xs">
              {icon} {text}
            </Button>
          </li>
        );
      })}
    </ul>
  );
};

export default Controls;
