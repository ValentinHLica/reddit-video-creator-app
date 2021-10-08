import React, { useContext } from "react";

import Context from "@context";

import styles from "@styles/UI/theme-switcher.module.scss";

const ThemeSwitcher: React.FC = () => {
  const { changeTheme } = useContext(Context);

  return (
    <div
      className={`${styles.container} theme-switcher`}
      onClick={changeTheme}
    />
  );
};

export default ThemeSwitcher;
