import React, { useContext, useEffect, useState } from "react";

import { RenderPost } from "@interface/post";

import Layout from "@components/Layout";
import { Card } from "@components/UI";

import styles from "@styles/pages/home.module.scss";
import { LoadingIcon } from "@components/CustomIcons";
import Context from "@components/Context";

const HomePage: React.FC = () => {
  const {
    postList,
    setPostList,
    postFilter,
    setPostFilter,
    reusedPost,
    setReusedPost,
  } = useContext(Context);

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

  const filtredPosts = postList.filter(
    (e) =>
      e.status === postFilter.filter((e) => e.active)[0].text ||
      postFilter.filter((e) => e.active)[0].text === "all"
  );

  useEffect(() => {
    if (reusedPost === true) {
      setTimeout(() => {
        setReusedPost(false);
      }, 1000);
    }
  }, [reusedPost]);

  return (
    <Layout>
      <div className={styles.home}>
        <div className={styles.filter}>
          <p>
            Displaying {filtredPosts.length} related posts for{" "}
            {postFilter.filter((e) => e.active)[0].text}
          </p>

          <ul className={styles.status}>
            {postFilter.map(({ active, text }, index) => (
              <li
                key={index}
                className={active ? styles.active : ""}
                onClick={() => {
                  setPostFilter((state) =>
                    state.map((e) => {
                      if (e.text === text) {
                        return {
                          ...e,
                          active: true,
                        };
                      }

                      return {
                        ...e,
                        active: false,
                      };
                    })
                  );
                }}
              >
                {text}
              </li>
            ))}
          </ul>
        </div>

        <ul className={styles.posts}>
          {filtredPosts.map((post, index) => (
            <li
              key={index}
              className={`${styles.post} ${
                index === 0 && reusedPost ? styles.pulse : ""
              }`}
            >
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
