import React, { useRef, useState, useContext } from "react";

import { AddIcon, LogoIcon, SettingsIcon } from "@icon";
import { Button, Modal } from "@components/UI";
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
  } = useContext(Context);

  const submit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (urlInput.current === null) return;

    const url = urlInput.current.value;

    if (postList.filter((data) => data.url === url).length > 0) {
      const reusedPost = postList.filter((data) => data.url === url)[0];

      setPostList((state) => [
        reusedPost,
        ...state.filter((e) => e.url !== reusedPost.url),
      ]);

      setReusedPost(true);

      return;
    }

    setLoading(true);

    const post = await fetchPostData(url);

    const data: RenderPost = {
      title: post.title,
      duration: 10,
      status: "draft",
      url,
      subreddit: post.subreddit,
    };

    try {
      const localPosts = localStorage.getItem("local-posts");

      if (!localPosts) return;

      localStorage.setItem(
        "local-posts",
        JSON.stringify([data, ...(JSON.parse(localPosts) as RenderPost[])])
      );
    } catch (error) {}

    setPostList((state) => [data, ...state]);

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

          <Button color="green" type="submit" icon={<AddIcon />}>
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
