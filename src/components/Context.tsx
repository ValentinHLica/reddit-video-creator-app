import { RenderPost } from "@interface/post";
import { render } from "@utils/render";
import { setupRender } from "@utils/scripts";
import { createContext, useState, useEffect, useRef } from "react";
import SetupScreen from "./UI/SetupScreen";
import voices from "../data/voices";

interface State {
  postList: RenderPost[];
  setPostList: React.Dispatch<React.SetStateAction<RenderPost[]>>;
  reusedPost: boolean;
  setReusedPost: React.Dispatch<React.SetStateAction<boolean>>;
  postFilter: {
    text: string;
    active: boolean;
  }[];
  setPostFilter: React.Dispatch<
    React.SetStateAction<
      {
        text: string;
        active: boolean;
      }[]
    >
  >;
  settingsModal: boolean;
  setSettingsModal: React.Dispatch<React.SetStateAction<boolean>>;
  queue: boolean;
  setQueue: React.Dispatch<React.SetStateAction<boolean>>;
  exportPath: string;
  setExportPath: React.Dispatch<React.SetStateAction<string>>;
  midPoster: string;
  setMidPoster: React.Dispatch<React.SetStateAction<string>>;
  backgroundMusic: string;
  setBackgroundMusic: React.Dispatch<React.SetStateAction<string>>;
  maxVideoTime: number;
  setMaxVideoTime: React.Dispatch<React.SetStateAction<number>>;
  voice: string;
  setVoice: React.Dispatch<React.SetStateAction<string>>;
}

const Context = createContext<State>({
  postList: [],
  setPostList: () => null,
  reusedPost: false,
  setReusedPost: () => null,
  postFilter: [],
  setPostFilter: () => null,
  settingsModal: false,
  setSettingsModal: () => null,
  queue: false,
  setQueue: () => null,
  exportPath: "",
  setExportPath: () => null,
  midPoster: "",
  setMidPoster: () => null,
  backgroundMusic: "",
  setBackgroundMusic: () => null,
  maxVideoTime: 10,
  setMaxVideoTime: () => null,
  voice: "",
  setVoice: () => null,
});

type Props = {
  children?: React.ReactNode;
};

export const ContextProvider: React.FC<Props> = ({ children }) => {
  const firstLoad = useRef<boolean>(true);
  const [postList, setPostList] = useState<RenderPost[]>([]);
  const [reusedPost, setReusedPost] = useState<boolean>(false);
  const [settingsModal, setSettingsModal] = useState<boolean>(false);
  const [queue, setQueue] = useState<boolean>(false);
  const [postFilter, setPostFilter] = useState<
    {
      text: string;
      active: boolean;
    }[]
  >([
    {
      text: "all",
      active: true,
    },
    {
      text: "draft",
      active: false,
    },
    {
      text: "queue",
      active: false,
    },
    {
      text: "finish",
      active: false,
    },
  ]);
  const [loadingSetup, setLoadingSetup] = useState<boolean>(true);

  const [exportPath, setExportPath] = useState<string>("");
  const [midPoster, setMidPoster] = useState<string>("");
  const [backgroundMusic, setBackgroundMusic] = useState<string>("");
  const [maxVideoTime, setMaxVideoTime] = useState<number>(10);

  const [voice, setVoice] = useState<string>(voices[0]);

  const context = {
    postList,
    setPostList,
    reusedPost,
    setReusedPost,
    postFilter,
    setPostFilter,
    settingsModal,
    setSettingsModal,
    queue,
    setQueue,
    exportPath,
    setExportPath,
    midPoster,
    setMidPoster,
    backgroundMusic,
    setBackgroundMusic,
    maxVideoTime,
    setMaxVideoTime,
    voice,
    setVoice,
  };

  const onLoad = async () => {
    try {
      const localPosts = localStorage.getItem("local-posts");

      if (!localPosts) {
        localStorage.setItem("local-posts", "[]");
        return;
      }

      const data = JSON.parse(localPosts) as RenderPost[];

      setPostList(data);
    } catch (error) {}

    if (firstLoad.current) {
      firstLoad.current = false;

      await setupRender();

      setLoadingSetup(false);
    }
  };

  useEffect(() => {
    onLoad();
  }, []);

  useEffect(() => {
    if (queue) {
      render(postList[0]);
      // for (const post of postList.filter(({ status }) => status === "queue")) {
      //   render(post);
      // }
    }
    // eslint-disable-next-line
  }, [queue]);

  return (
    <Context.Provider value={context}>
      {!loadingSetup ? children : <SetupScreen />}
    </Context.Provider>
  );
};

export default Context;
