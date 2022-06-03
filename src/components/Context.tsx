import { RenderPost } from "@interface/post";
import { render } from "@utils/render";
import { setupRender } from "@utils/scripts";
import { createContext, useState, useEffect, useRef } from "react";

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
  };

  useEffect(() => {
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

      setupRender();
    }
  }, []);

  useEffect(() => {
    if (queue) {
      for (const post of postList.filter(({ status }) => status === "queue")) {
        render(post);
      }
    }

    // eslint-disable-next-line
  }, [queue]);

  return <Context.Provider value={context}>{children}</Context.Provider>;
};

export default Context;
