import React, { useContext } from "react";

import Context from "@context";
import { BreadCrumb, Drawer } from "@ui";

import styles from "@styles/layout.module.scss";

type Props = {
  nav?: {
    text: string;
    url?: string;
    onClick?: () => void;
  }[];
};

const Layout: React.FC<Props> = ({ nav, children }) => {
  const { drawer, setDrawer } = useContext(Context);

  return (
    <div className={styles.layout}>
      <div className={styles.container}>
        <BreadCrumb nav={nav} />

        <Drawer visible={drawer} setVisible={setDrawer} />
      </div>

      {children}
    </div>
  );
};

export default Layout;
