import React from "react";

import { withRouter, Redirect } from "react-router";
import config from "../../config";

const { clientId, redirectUri } = config.spotify;

const defaultArtists = [...Array(3).keys()];

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    this.login = this.login.bind(this);

    const params = new URLSearchParams(props.location.hash.split("#")[1]);

    const token = params.get("access_token");

    localStorage.setItem("token", token);

    this.state = {
      loggedIn: !!token
    };
  }

  login() {
    const scopes = ["user-read-email", "user-top-read"];

    const url =
      "https://accounts.spotify.com/authorize?client_id=" +
      clientId +
      "&redirect_uri=" +
      encodeURIComponent(redirectUri) +
      "&scope=" +
      encodeURIComponent(scopes.join(" ")) +
      "&response_type=token";

    const width = 450,
      height = 600,
      left = screen.width / 2 - width / 2,
      top = screen.height / 2 - height / 2;

    location.href = url;
  }

  render() {
    const { loggedIn } = this.state;

    if (loggedIn) return <Redirect to="/" />;

    return (
      <div className="content container">
        <button onClick={this.login} className="btn btn-primary">
          Login with Spotify
        </button>
      </div>
    );
  }
}

export default withRouter(LoginPage);
