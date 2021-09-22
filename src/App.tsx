import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

// import Button from "./components/UI/Button";
import HomePage from "./components/Home";
import PostsPage from "./components/Posts";
import CommentsPage from "./components/Comments";
import NotFoundPage from "./components/NotFound";

// import { Theme } from "./interface/UI/theme";

const App: React.FC = () => {
  // const [theme, setTheme] = useState<Theme>("dark");

  // const changeTheme = () => {
  //   const body = document.querySelector("body") as HTMLBodyElement;
  //   body.dataset.theme = theme;

  //   setTheme(theme === "light" ? "dark" : "light");
  // };

  return (
    <Router>
      {/* <Button onClick={changeTheme}>Theme</Button> */}
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/r/:subredditId" component={PostsPage} />
        <Route
          exact
          path="/r/:subredditId/c/:commentsId"
          component={CommentsPage}
        />
        <Route exact path="*" component={NotFoundPage} />
      </Switch>
    </Router>
  );
};

export default App;
