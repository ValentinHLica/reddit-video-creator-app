import {
  createContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";

import { SearchItem } from "@interface/reddit";

interface State {
  offline: boolean;
  searchSubreddit: SearchItem[] | null;
  setSearchSubreddit: Dispatch<SetStateAction<SearchItem[] | null>>;
  drawer: boolean;
  setDrawer: (state: boolean) => void;
}

const Context = createContext<State>({
  offline: false,
  searchSubreddit: null,
  setSearchSubreddit: () => null,
  drawer: false,
  setDrawer: () => null,
});

export const ContextProvider: React.FC = ({ children }) => {
  const [drawer, setDrawer] = useState<boolean>(false);
  const [offline, setOffline] = useState<boolean>(false);
  const [searchSubreddit, setSearchSubreddit] = useState<SearchItem[] | null>(
    null
  );

  useEffect(() => {
    const goOnline = () => setOffline(false);
    window.addEventListener("online", goOnline);

    const goOffline = () => setOffline(true);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  const context = {
    offline,
    searchSubreddit,
    setSearchSubreddit,
    drawer,
    setDrawer,
  };

  return <Context.Provider value={context}>{children}</Context.Provider>;
};

export default Context;
