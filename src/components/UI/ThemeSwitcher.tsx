import React, { useContext } from "react";

import Context from "@context";
import { MoonIcon, SunIcon } from "@icon";

import styles from "@styles/UI/theme-switcher.module.scss";

const ThemeSwitcher: React.FC = () => {
  const { theme, changeTheme } = useContext(Context);

  const icon = theme === "dark" ? <SunIcon /> : <MoonIcon />;

  return (
    <div className={styles.container} onClick={changeTheme}>
      {icon}
    </div>
  );
};

export default ThemeSwitcher;
