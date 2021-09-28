import {
  createContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";

import { Theme } from "@interface/UI/theme";
import { SearchItem } from "@interface/reddit";

interface State {
  theme: Theme;
  changeTheme: () => void;
  offline: boolean;
  searchSubreddit: SearchItem[] | null;
  setSearchSubreddit: Dispatch<SetStateAction<SearchItem[] | null>>;
}

const Context = createContext<State>({
  theme: "dark",
  changeTheme: () => null,
  offline: false,
  searchSubreddit: null,
  setSearchSubreddit: () => null,
});

export const ContextProvider: React.FC = ({ children }) => {
  const [offline, setOffline] = useState<boolean>(false);
  const [theme, setTheme] = useState<Theme>("light");
  const [searchSubreddit, setSearchSubreddit] = useState<SearchItem[] | null>(
    null
  );

  const changeTheme = () => {
    const selectedTheme = theme === "light" ? "dark" : "light";

    localStorage.setItem("theme", selectedTheme);

    setTheme(selectedTheme);
  };

  const conamiCode = () => {
    // todo
  };

  useEffect(() => {
    const body = document.querySelector("body") as HTMLBodyElement;
    body.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const theme = localStorage.getItem("theme") as Theme;

    switch (theme) {
      case "dark":
        setTheme("dark");
        break;

      default:
        setTheme("light");
        break;
    }

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
    theme,
    changeTheme,
    offline,
    searchSubreddit,
    setSearchSubreddit,
  };

  return <Context.Provider value={context}>{children}</Context.Provider>;
};

export default Context;
