import React, { Component } from "react";

import { withRouter } from "react-router";

import _ from "lodash";
import api from "../utils/api";

import Loading from "../components/Loading";
import Error from "../components/Error";
import Pagination from "../components/Pagination";

import SearchResultItem from "../components/SearchResultItem";

function getQueryParams(query) {
  const params = new URLSearchParams(query);

  return {
    query: params.get("q"),
    page: params.get("p")
  };
}

class SearchPage extends Component {
  constructor(props) {
    super(props);

    this.search = _.throttle(this.search.bind(this), 500);
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
    this.goToPage = this.goToPage.bind(this);
    this.goToNextPage = this.goToNextPage.bind(this);
    this.goToPreviousPage = this.goToPreviousPage.bind(this);
    this.changePage = this.changePage.bind(this);

    this.state = {
      artists: {},
      page: 1,
      error: null
    };
  }

  componentDidMount() {
    const { location } = this.props;

    const params = location.search && getQueryParams(location.search);

    if (params.query) this.search(params.query, { page: params.page });
  }

  updateQueryParams({ query, page }) {
    const { history } = this.props;

    const params = new URLSearchParams();

    params.set("q", query);

    if (page && page > 1) {
      params.set("p", page);
    }

    history.push({
      search: params.toString()
    });
  }

  handleSearchInputChange(e) {
    const query = e.target.value;

    if (!query || query.length < 3) return;

    this.search(query);

    const page = 1;

    this.setState({ page });

    this.updateQueryParams({ query, page });
  }

  async search(query, { page } = {}) {
    try {
      this.setState({ query });

      const artists = await api.search(query, { p: page ? page - 1 : 0 });

      this.setState({ artists, page });
    } catch (error) {
      this.setState({ error });
    }
  }

  goToPreviousPage() {
    const { query, page } = this.state;
    const newPage = page - 1;

    this.changePage({ query, page: newPage });
  }

  goToNextPage() {
    const { query, page } = this.state;
    const newPage = page + 1;

    this.changePage({ query, page: newPage });
  }

  goToPage(page) {
    if (!isNaN(page)) {
      const { query } = this.state;

      this.changePage({ query, page });
    }
  }

  changePage({ query, page }) {
    this.updateQueryParams({ query, page });
    this.search(query, { page });
  }

  render() {
    const { error, query, artists, page } = this.state;
    const currentPage = page || 1;

    const numberOfPages =
      artists && artists.total > artists.limit
        ? Math.ceil(artists.total / artists.limit)
        : 1;

    return (
      <div className="content container">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="#">Recherche</a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Artist
            </li>
          </ol>
        </nav>
        <div className="page-header">
          <h1>Artistes</h1>
        </div>
        <div className="panel panel-default">
          <div className="panel-heading">Rechercher un artiste Spotify</div>
          <div className="panel-body">
            <form className="form-inline" onSubmit={e => e.preventDefault()}>
              <div className="form-group">
                <input
                  type="search"
                  className="form-control"
                  placeholder="Mot(s)-clé(s)"
                  onChange={this.handleSearchInputChange}
                  defaultValue={query}
                />
              </div>
            </form>
          </div>
        </div>
        {error && <Error error={error} />}
        {artists ? (
          <div className="container artists">
            {artists.items &&
              artists.items.map(({ id, images, name, genres }) => (
                <SearchResultItem
                  id={id}
                  key={id}
                  name={name}
                  images={images}
                  genres={genres}
                />
              ))}
          </div>
        ) : (
          <Loading />
        )}

        <Pagination
          currentPage={currentPage}
          numberOfPages={numberOfPages}
          goToPage={this.goToPage}
          goToPreviousPage={this.goToPreviousPage}
          goToNextPage={this.goToNextPage}
        />
      </div>
    );
  }
}

export default withRouter(SearchPage);
