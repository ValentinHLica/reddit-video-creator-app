import React, { useContext } from "react";

import Header from "@components/Header";
import Footer from "@components/Footer";

import "@styles/main.scss";
import Context from "./Context";

type Props = {
  children?: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  const {} = useContext(Context);

  return (
    <>
      <Header />

      <main>{children}</main>

      <Footer />
    </>
  );
};

export default Layout;
