import getTemplate from "./utils/getTemplate.js";
import { search } from "./utils/redditApi";

const init = async () => {
  const app = document.querySelector("#app") as HTMLDivElement;

  const home = getTemplate("#welcome-page-temp");
  const listItem = getTemplate("#item-temp");
  const footer = getTemplate("#footer-temp");

  app.appendChild(home);

  const data = await search("ana");

  console.log(data);
};

init();
