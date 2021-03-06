import React, { useContext, useEffect } from "react";

import { invoke } from "@tauri-apps/api/tauri";

import Layout from "@components/Layout";
import { Card } from "@ui";

import Context from "@components/Context";
import { AlertCircleIcon } from "@icon";
import styles from "@styles/pages/home.module.scss";

const HomePage: React.FC = () => {
  const { postList, postFilter, setPostFilter, reusedPost, setReusedPost } =
    useContext(Context);

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

    // eslint-disable-next-line
  }, [reusedPost]);

  return (
    <Layout>
      <div
        onClick={() => {
          invoke("my_custom_command");
        }}
      ></div>

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

        {filtredPosts.length > 0 ? (
          <ul className={styles.posts}>
            {filtredPosts.map((post, index) => (
              <li
                key={index}
                className={`${styles.post} ${
                  index === 0 && reusedPost ? styles.pulse : ""
                }`}
              >
                <Card index={index} {...post} />
              </li>
            ))}
          </ul>
        ) : (
          <h1 className={styles.empty}>
            <AlertCircleIcon /> Nothing Here
          </h1>
        )}
      </div>
    </Layout>
  );
};

export default HomePage;
