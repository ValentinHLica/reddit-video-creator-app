import React from "react";

import HomePage from "@pages/homepage";
import { ContextProvider } from "@components/Context";

const App: React.FC = () => {
  return (
    <ContextProvider>
      <HomePage />
    </ContextProvider>
  );
};

export default App;
