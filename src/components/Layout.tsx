import React, { Fragment, useContext } from "react";

import Context from "@context";
import { BreadCrumb, Button, Drawer } from "@ui";
import { MenuIcon } from "@icon";

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
    <Fragment>
      <div className={styles.container}>
        <BreadCrumb nav={nav} />

        <Drawer visible={drawer} setVisible={setDrawer} />
      </div>

      {children}
    </Fragment>
  );
};

export default Layout;
