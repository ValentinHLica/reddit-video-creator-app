import { RenderPost } from "@interface/post";
import { createContext, useState, useEffect } from "react";

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
}

const Context = createContext<State>({
  postList: [],
  setPostList: () => null,
  reusedPost: false,
  setReusedPost: () => null,
  postFilter: [],
  setPostFilter: () => null,
});

type Props = {
  children?: React.ReactNode;
};

export const ContextProvider: React.FC<Props> = ({ children }) => {
  const [postList, setPostList] = useState<RenderPost[]>([]);
  const [reusedPost, setReusedPost] = useState<boolean>(false);
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
      text: "publish",
      active: false,
    },
    {
      text: "finish",
      active: false,
    },
  ]);

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
  }, []);

  const context = {
    postList,
    setPostList,
    reusedPost,
    setReusedPost,
    postFilter,
    setPostFilter,
  };

  return <Context.Provider value={context}>{children}</Context.Provider>;
};

export default Context;
