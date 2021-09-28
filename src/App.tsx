import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import { ContextProvider } from "@components/Context";

import { OfflineNotification, ThemeSwitcher } from "@ui";
import HomePage from "@components/Home";
import PostsPage from "@components/Posts";
import CommentsPage from "@components/Comments";
import NotFoundPage from "@components/NotFound";
import CreateVideoPage from "@components/CreateVideo";
import SettingsPage from "@components/Settings";
import TestPage from "@components/Test";

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

          <Route exact path="/create-video" component={CreateVideoPage} />

          <Route exact path="/settings" component={SettingsPage} />

          <Route exact path="/test" component={TestPage} />

          <Route exact path="*" component={NotFoundPage} />
        </Switch>
      </Router>
    </ContextProvider>
  );
};

export default App;
