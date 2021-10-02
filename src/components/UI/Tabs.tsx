import React, { Fragment, useState } from "react";

import styles from "@styles/UI/tabs.module.scss";

type Props = {
  tabs: { text: string; content: JSX.Element }[];
};

const Tabs: React.FC<Props> = ({ tabs }) => {
  const [currentTab, setCurrentTab] = useState<number>(0);

  return (
    <Fragment>
      <div className={styles.container}>
        <ul className={styles.container__tabs}>
          {tabs.map((tab, index) => (
            <li
              className={`${styles.tab} ${
                index === currentTab ? styles.tab__selected : ""
              }`}
              key={index}
              onClick={() => {
                setCurrentTab(index);
              }}
            >
              {tab.text}
            </li>
          ))}
        </ul>
      </div>

      {tabs[currentTab].content}
    </Fragment>
  );
};

export default Tabs;
