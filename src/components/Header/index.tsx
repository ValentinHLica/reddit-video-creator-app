import React, { useRef, useState, useContext } from "react";

import { AddIcon, LogoIcon, SettingsIcon, LoadingIcon } from "@icon";
import { Button, Modal, Switch } from "@ui";
import Context from "@components/Context";
import { RenderPost } from "@interface/post";
import { fetchPostData } from "@utils/reddit";

import styles from "@styles/components/Header/index.module.scss";
import Settings from "@components/Settings";

const Header: React.FC = () => {
  const urlInput = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const {
    postList,
    setPostList,
    setReusedPost,
    settingsModal,
    setSettingsModal,
    maxVideoTime,
    voice,
  } = useContext(Context);

  const submit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (urlInput.current === null || loading) return;

    const url = urlInput.current.value;

    if (postList.filter((data) => data.url === url).length > 0) {
      const reusedPost = postList.filter((data) => data.url === url)[0];

      setPostList((state) => {
        const newState = [
          reusedPost,
          ...state.filter((e) => e.url !== reusedPost.url),
        ];

        localStorage.setItem("local-posts", JSON.stringify(newState));

        return newState;
      });

      setReusedPost(true);

      urlInput.current.value = "";

      return;
    }

    setLoading(true);

    const post = await fetchPostData(url);

    const data: RenderPost = {
      title: post.title,
      duration: post.totalDuration,
      status: "draft",
      url,
      subreddit: post.subreddit,
      maxDuration: maxVideoTime,
      videosCount: 1,
      voice,
    };

    setPostList((state) => {
      const newState = [data, ...state];

      localStorage.setItem("local-posts", JSON.stringify(newState));

      return newState;
    });

    urlInput.current.value = "";

    setLoading(false);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>
          <LogoIcon />

          <h2>Reddit Video Creator</h2>
        </div>

        <form onSubmit={submit} className={styles.form}>
          <input type="url" ref={urlInput} placeholder="Post Url..." />
          <Button
            color="green"
            type="submit"
            icon={loading ? <LoadingIcon /> : <AddIcon />}
            disabled={loading}
          >
            New Post
          </Button>

          <Button
            color="light"
            type="button"
            icon={<SettingsIcon />}
            className={styles.settings}
            onClick={() => setSettingsModal(true)}
          />
        </form>
      </header>

      <Modal visible={settingsModal} setVisible={setSettingsModal}>
        <Settings />
      </Modal>
    </>
  );
};

export default Header;
