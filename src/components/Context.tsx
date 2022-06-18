import { createContext, useState, useEffect, useRef } from "react";

// import { checkUpdate, installUpdate } from "@tauri-apps/api/updater";
// import { relaunch } from "@tauri-apps/api/process";
// import { readBinaryFile } from "@tauri-apps/api/fs";

import { RenderLoading } from "@interface/post";
import { RenderPost } from "@interface/post";

import { render } from "@utils/render";
import { setupRender } from "@utils/scripts";
import voices from "../data/voices";

import SetupScreen from "./UI/SetupScreen";

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
  loadingRender: RenderLoading | null;
  setLoadingRender: React.Dispatch<React.SetStateAction<RenderLoading | null>>;
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
  loadingRender: null,
  setLoadingRender: () => null,
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
  const [loadingRender, setLoadingRender] = useState<RenderLoading | null>(
    null
  );

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
    loadingRender,
    setLoadingRender,
  };

  const onLoad = async () => {
    // const { shouldUpdate } = await checkUpdate();

    // try {
    //   if (shouldUpdate) {
    //     // display dialog
    //     await installUpdate();
    //     // install complete, restart app
    //     await relaunch();

    //     return;
    //   }
    // } catch (error) {
    //   console.log(error);
    // }

    try {
      const localPosts = localStorage.getItem("local-posts");

      if (!localPosts) {
        localStorage.setItem("local-posts", "[]");
        return;
      }

      const data = (JSON.parse(localPosts) as RenderPost[]).map((post) => {
        // todo check if image exits in machine

        // if (post.image && !(await readBinaryFile(post.image))) {
        //   return {
        //     ...post,
        //     image: undefined,
        //   };
        // }

        return post;
      });

      setPostList(data);
    } catch (error) {}

    if (firstLoad.current) {
      firstLoad.current = false;

      await setupRender();

      setLoadingSetup(false);
    }
  };

  useEffect(() => {
    if (loadingRender && loadingRender.loading === 100) {
      setPostList((state) => {
        const newPosts: RenderPost[] = state.map((post) => {
          if (
            post.url.split("/comments/")[1].split("/")[0] === loadingRender.id
          ) {
            return {
              ...post,
              status: "finish",
            };
          }

          return post;
        });

        localStorage.setItem("local-posts", JSON.stringify(newPosts));

        return newPosts;
      });
    }
  }, [loadingRender]);

  useEffect(() => {
    onLoad();
  }, []);

  useEffect(() => {
    if (queue) {
      render(
        postList.map((e) => ({
          ...e,
          maxDuration: maxVideoTime,
        })),
        setLoadingRender
      );
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
