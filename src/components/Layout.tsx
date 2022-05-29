import React from "react";

import Header from "@components/Header";
import Footer from "@components/Footer";

import "@styles/main.scss";

type Props = {
  children?: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Header />

      <main>{children}</main>

      <Footer />
    </>
  );
};

export default Layout;
