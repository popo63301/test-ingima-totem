import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router";
import { Switch, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import App from "./App";
import NotFoundPage from "./containers/NotFound";
import SearchPage from "./containers/SearchPage";
import ArtistPage from "./containers/ArtistPage";
import AlbumPage from "./containers/AlbumPage";
import LoginPage from "./containers/LoginPage";
// import AuthCallback from './containers/LoginPage'

const history = createBrowserHistory();

ReactDOM.render(
  <Router history={history}>
    <App history={history}>
      <Switch>
        <Route exact path="/" component={SearchPage} />
        <Route exact path="/artist/:id" component={ArtistPage} />
        <Route exact path="/album/:id" component={AlbumPage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/callback" component={LoginPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </App>
  </Router>,
  document.getElementById("root")
);

// http://localhost:8080/callback#access_token=BQCmhjKM3fTQPc2nN9KkxAJq6TqDCaJbXkxbKaU_9V3CyVMCYYk9ynT-YGGZbkgST_NQaA4jIj_v159s8n5TSwhqxinkcr2GBrbfKXwYyX2mEkSKCx3fVb0h_wkCZm5O_liz19YHXBzqlOd4AKStKhyvUyzYKdMxJHNXESBISLZtdQ&token_type=Bearer&expires_in=3600
