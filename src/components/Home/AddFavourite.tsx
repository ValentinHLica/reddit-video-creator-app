import React, {
  FormEventHandler,
  useRef,
  useState,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";
import { useHistory } from "react-router-dom";

import { Spinner, Card, CardWrapper, Input, Button } from "@ui";
import Context from "@context";
import { HeartIcon, UserIcon, ZapIcon } from "@icon";

import { search } from "@utils/redditApi";
import { roundUp } from "@utils/helpers";
import { SearchItem, Pagination } from "@interface/reddit";

import styles from "@styles/Home/add-favourite.module.scss";

type Props = {
  favourite: SearchItem[];
  favouriteSubreddit: Dispatch<SetStateAction<SearchItem[]>>;
};

const AddFavourite: React.FC<Props> = ({ favourite, favouriteSubreddit }) => {
  const history = useHistory();
  const { searchSubreddit, setSearchSubreddit } = useContext(Context);

  const [pagination, setPagination] = useState<Pagination>({
    next: null,
    before: null,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const query = useRef<HTMLInputElement>(null);

  const submit: FormEventHandler = async (e) => {
    e.preventDefault();

    setError(false);
    setSearchSubreddit(null);
    setLoading(true);

    try {
      const { data, pagination } = await search(query.current?.value as string);

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

      setPagination(pagination);
      setSearchSubreddit(addedFilter);
    } catch (err) {
      console.log(err);

      setError(true);
    }

    setLoading(false);
  };

  const addSubreddit = (item: SearchItem) => {
    const isFav = favourite.filter((subreddit) => subreddit.url === item.url);

    const saveSubreddits = (state: boolean) => {
      return (searchSubreddit as SearchItem[]).map((subreddit) => {
        if (subreddit.url === item.url) {
          return {
            ...subreddit,
            added: state,
          };
        }

        return subreddit;
      });
    };

    let newFav: SearchItem[] = [];

    if (isFav.length !== 0) {
      newFav = favourite.filter((subreddit) => subreddit.url !== item.url);
    } else {
      item.added = true;
      newFav = [...favourite, item];
    }

    localStorage.setItem("favourite", JSON.stringify(newFav));
    favouriteSubreddit(newFav);
    setSearchSubreddit(saveSubreddits(true));
  };

  const loadMore = async () => {
    setError(false);

    try {
      const { data, pagination: resultsPagination } = await search(
        query.current?.value as string,
        pagination.next as unknown as string
      );

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

      setPagination(resultsPagination);
      setSearchSubreddit((prevState) => {
        return [...(prevState as SearchItem[]), ...addedFilter];
      });
    } catch (err) {
      console.log(err);

      setError(true);
    }
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
          <Button size="sm" text="Search" />
        </form>
      </div>

      {loading && <Spinner size="xl" />}

      {!loading && !error && searchSubreddit && searchSubreddit.length !== 0 && (
        <CardWrapper
          className={styles.container__items}
          loadMore={pagination.next ? loadMore : undefined}
        >
          {searchSubreddit.map((item, index) => {
            if (!item.subscribers) {
              return null;
            }

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
                  {
                    text: "Posts",
                    icon: <ZapIcon />,
                    onClick: () => {
                      history.push(item.display_name_prefixed);
                    },
                  },
                  {
                    text: `Users ${roundUp(item.subscribers)}`,
                    icon: <UserIcon />,
                    className: "user--item",
                  },
                ]}
              />
            );
          })}
        </CardWrapper>
      )}

      {searchSubreddit && searchSubreddit.length === 0 && (
        <h3 style={{ marginTop: "24px", textAlign: "center" }}>
          Nothing was found
        </h3>
      )}

      {error && (
        <h3 style={{ marginTop: "24px", textAlign: "center" }}>
          Please provide a valid Query
        </h3>
      )}
    </div>
  );
};

export default AddFavourite;
