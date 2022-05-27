import React, { useEffect, useRef, useState } from "react";
import { RenderPost } from "./interface/post";
import { fetchPostData } from "./utils/reddit";

const HomePage: React.FC = () => {
  const urlInput = useRef<HTMLInputElement>(null);
  const [postList, setPostList] = useState<RenderPost[]>([]);

  const submit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (
      urlInput.current === null ||
      postList.filter(({ url }) => url === url).length > 0
    )
      return;

    const url = urlInput.current.value;

    const { post, duration } = await fetchPostData(url);

    const data: RenderPost = {
      title: post.title,
      duration: 10,
      status: "draft",
      url,
      estimatedDuration: duration,
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
    <div>
      <form onSubmit={submit}>
        <input type="url" ref={urlInput} placeholder="Url..." />
        <input type="submit" value="Add" />
      </form>

      <ul>
        {postList.map(
          ({ title, duration, estimatedDuration, status, url }, index) => (
            <li key={index}>
              <h4>
                <a href={url} target="_blank">
                  {title}
                </a>
              </h4>

              <div>
                Duration:
                <input
                  type="number"
                  min={1}
                  max={100}
                  placeholder="Duration"
                  defaultValue={duration}
                />
              </div>

              <p>Estimated Post Duration: {estimatedDuration.toFixed(2)}</p>

              <div>
                <label htmlFor={`status-${index}`}>Status: </label>

                {status === "finish" ? (
                  <p>Finished</p>
                ) : (
                  <input
                    type="checkbox"
                    defaultChecked={status === "publish"}
                    id={`status-${index}`}
                  />
                )}
              </div>

              <button onClick={onDelete.bind(this, index)}>Delete</button>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default HomePage;
