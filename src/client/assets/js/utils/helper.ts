import { cwd } from "process";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

import { SearchItem } from "@interface/reddit";

const favouritePath = join(cwd(), "data", "favourite.json");

/**
 * Get Favourite Subreddit
 */
export const getFavourite = (): SearchItem[] => {
  return JSON.parse(readFileSync(favouritePath).toString());
};

/**
 * Set Favourite Subreddit
 */
export const setFavourite = (item: SearchItem) => {
  const data = getFavourite();

  data.push(item);

  writeFileSync(favouritePath, JSON.stringify(data));
};

/**
 * Remove Favourite Subreddit
 *
 * @param index Favourite Index
 */
export const removeFavourite = (index: number) => {
  const data = getFavourite();

  writeFileSync(favouritePath, JSON.stringify(data.splice(index, 1)));
};
