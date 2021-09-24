import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import { ContextProvider } from "./components/Context";

import HomePage from "./components/Home";
import PostsPage from "./components/Posts";
import CommentsPage from "./components/Comments";
import NotFoundPage from "./components/NotFound";

import OfflineNotification from "./components/UI/OfflineNotification";
import ThemeSwitcher from "./components/UI/ThemeSwitcher";

const App: React.FC = () => {
  return (
    <ContextProvider>
      <Router>
        <OfflineNotification />
        <ThemeSwitcher />

        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/r/:subredditId" component={PostsPage} />
          <Route
            exact
            path="/r/:subredditId/comments/:commentId/:commentSlug"
            component={CommentsPage}
          />
          <Route exact path="*" component={NotFoundPage} />
        </Switch>
      </Router>{" "}
    </ContextProvider>
  );
};

export default App;
