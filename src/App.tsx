import React from "react";
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import { ContextProvider } from "@components/Context";
import { OfflineNotification } from "@ui";
import HomePage from "@components/Home";
import PostsPage from "@components/Posts";
import CommentsPage from "@components/Comments";
import CreateVideoPage from "@components/CreateVideo";

const App: React.FC = () => {
  return (
    <ContextProvider>
      <Router>
        <OfflineNotification />

        <Switch>
          <Route exact path="/" component={HomePage} />

          <Route exact path="/r/:subredditId" component={PostsPage} />

          <Route
            exact
            path="/r/:subredditId/comments/:commentId/:commentSlug"
            component={CommentsPage}
          />

          <Route exact path="/create-video" component={CreateVideoPage} />
        </Switch>
      </Router>
    </ContextProvider>
  );
};

export default App;
