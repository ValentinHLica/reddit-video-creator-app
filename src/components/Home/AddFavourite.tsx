import React, {
  FormEventHandler,
  useRef,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

import Button from "../UI/Button";
import Input from "../UI/Input";
import CardWrapper from "../UI/CardWrapper";
import Card from "../UI/Card";
import Spinner from "../UI/Spinner";
import { HeartIcon } from "../CustomIcons";

import { search } from "../../utils/redditApi";
import { SearchItem } from "../../interface/reddit";

import styles from "../../styles/components/Home/add-favourite.module.scss";

const { app } = window.require("@electron/remote");
const { writeFileSync } = window.require("fs");
const { join } = window.require("path");
const favDataPath = join(
  app.getAppPath(),
  "..",
  "data",
  "favoriteSubreddit.json"
);

type Props = {
  favourite: SearchItem[];
  favouriteSubreddit: Dispatch<SetStateAction<SearchItem[]>>;
};

const AddFavourite: React.FC<Props> = ({ favourite, favouriteSubreddit }) => {
  const [subreddits, setSubreddits] = useState<SearchItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const query = useRef<HTMLInputElement>(null);

  const submit: FormEventHandler = async (e) => {
    e.preventDefault();

    setError(false);
    setSubreddits(null);
    setLoading(true);

    try {
      const data = await search(query.current?.value as string);

      const addedFilter = data.map((subreddit) => {
        let isAdded = false;

        for (const item of favourite) {
          if (item.url === subreddit.url) {
            isAdded = true;
            break;
          }
        }

        return {
          ...subreddit,
          added: isAdded,
        };
      });

      setSubreddits(addedFilter);
    } catch (err) {
      console.log(err);

      setError(true);
    }

    setLoading(false);
  };

  const addSubreddit = (item: SearchItem) => {
    const isFav = favourite.filter((subreddit) => subreddit.url === item.url);

    if (isFav.length !== 0) {
      const newFav = favourite.filter(
        (subreddit) => subreddit.url !== item.url
      );

      favouriteSubreddit(newFav);

      writeFileSync(favDataPath, JSON.stringify(newFav));

      setSubreddits(
        (subreddits as SearchItem[]).map((subreddit) => {
          if (subreddit.url === item.url) {
            return {
              ...subreddit,
              added: false,
            };
          }

          return subreddit;
        })
      );

      return;
    }

    setSubreddits(
      (subreddits as SearchItem[]).map((subreddit) => {
        if (subreddit.url === item.url) {
          return {
            ...subreddit,
            added: true,
          };
        }

        return subreddit;
      })
    );

    const newFav = [...favourite, item];

    writeFileSync(favDataPath, JSON.stringify(newFav));

    favouriteSubreddit(newFav);
  };

  return (
    <div className={styles.container}>
      <div className={styles.container__wrapper}>
        <h3 className={styles.container__title}>Add Favourite Subreddit</h3>

        <form className={styles.container__form} onSubmit={submit}>
          <Input
            type="text"
            query={query}
            placeholder="Search subreddits..."
            size="sm"
          />
          <Button size="sm">Search</Button>
        </form>
      </div>

      {loading && <Spinner size="xl" />}

      {!loading && !error && subreddits && (
        <CardWrapper className={styles.container__items}>
          {subreddits.map((item, index) => {
            return (
              <Card
                key={index}
                title={item.display_name}
                author={item.display_name}
                route="/r"
                desc={item.public_description}
                actions={[
                  {
                    text: "Favourite",
                    icon: <HeartIcon added={item.added ?? false} />,
                    onClick: () => {
                      addSubreddit(item);
                    },
                  },
                ]}
              />
            );
          })}
        </CardWrapper>
      )}

      {error && (
        <h3 style={{ marginTop: "24px" }}>Please provide a valid Query</h3>
      )}
    </div>
  );
};

export default AddFavourite;
