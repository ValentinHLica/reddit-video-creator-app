import React, { useEffect, useRef, useState } from "react";

import { RenderPost } from "@interface/post";
import { fetchPostData } from "@utils/reddit";

import Layout from "@components/Layout";
import { Button, Card } from "@components/UI";

import styles from "@styles/pages/home.module.scss";
import { LoadingIcon } from "@components/CustomIcons";

const HomePage: React.FC = () => {
  const urlInput = useRef<HTMLInputElement>(null);
  const [postList, setPostList] = useState<RenderPost[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const submit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (urlInput.current === null) return;

    const url = urlInput.current.value;

    if (postList.filter((data) => data.url === url).length > 0) return;

    setLoading(true);

    const { post, duration } = await fetchPostData(url);

    const data: RenderPost = {
      title: post.title,
      duration: 10,
      status: "draft",
      url,
      estimatedDuration: duration,
      subreddit: post.subreddit,
    };

    try {
      const localPosts = localStorage.getItem("local-posts");

      if (!localPosts) return;

      localStorage.setItem(
        "local-posts",
        JSON.stringify((JSON.parse(localPosts) as RenderPost[]).concat(data))
      );
    } catch (error) {}

    setPostList((state) => state.concat(data));

    setLoading(false);
  };

  const onCheck = (index: number) => {
    setPostList((state) => {
      const newState: RenderPost[] = state.map((e, idx) =>
        idx === index
          ? {
              ...e,
              status: e.status === "draft" ? "publish" : "draft",
            }
          : e
      );

      try {
        localStorage.setItem("local-posts", JSON.stringify(newState));
      } catch (error) {}

      return newState;
    });
  };

  const onDelete = (index: number) => {
    setPostList((state) => {
      const newState = state.filter((_, idx) => idx !== index);

      try {
        localStorage.setItem("local-posts", JSON.stringify(newState));
      } catch (error) {}

      return newState;
    });
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
  }, []);

  return (
    <Layout>
      <div className={styles.home}>
        <form onSubmit={submit} className={styles.form}>
          <input type="url" ref={urlInput} placeholder="Url..." />
          <Button color="green" type="submit">
            Add
          </Button>
        </form>

        <ul className={styles.posts}>
          {postList.map((post, index) => (
            <li key={index} className={styles.post}>
              <Card
                {...post}
                index={index}
                onDelete={onDelete}
                onCheck={onCheck}
              />
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default HomePage;
