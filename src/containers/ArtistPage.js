import React from "react";

import { Link } from "react-router-dom";
import { withRouter } from "react-router";

import Loading from "../components/Loading";
import Error from "../components/Error";
import Pagination from "../components/Pagination";

import api from "../utils/api";

function getQueryParams(query) {
  const params = new URLSearchParams(query);

  return {
    page: params.get("p")
  };
}

class ArtistPage extends React.Component {
  constructor(props) {
    super(props);

    this.goToPage = this.goToPage.bind(this);
    this.goToNextPage = this.goToNextPage.bind(this);
    this.goToPreviousPage = this.goToPreviousPage.bind(this);
    this.changePage = this.changePage.bind(this);

    this.state = {
      artistAlbums: null,
      error: null,
      page: 1
    };
  }

  componentDidMount() {
    const { location } = this.props;

    const params = location.search && getQueryParams(location.search);

    this.getArtistAlbums(params.page);
  }

  async getArtistAlbums(p) {
    const {
      match: { params }
    } = this.props;

    try {
      const {
        items: artistAlbums,
        total: totalAlbumsNumber,
        limit
      } = await api.getArtistAlbums(params.id, { p: p ? p - 1 : 0 });

      this.setState({
        artistAlbums,
        page: Number(p),
        totalAlbumsNumber,
        limit,
        error: null
      });
    } catch (error) {
      this.setState({ error });
    }
  }

  updateQueryParams({ page }) {
    const { history } = this.props;

    const params = new URLSearchParams();

    if (page && page > 1) {
      params.set("p", page);
    }

    history.push({
      search: params.toString()
    });
  }

  goToPreviousPage() {
    const { page } = this.state;
    const newPage = page - 1;

    this.changePage({ page: newPage });
  }

  goToNextPage() {
    const { page } = this.state;
    const newPage = page + 1;

    this.changePage({ page: newPage });
  }

  goToPage(page) {
    if (!isNaN(page)) {
      this.changePage({ page });
    }
  }

  changePage({ page }) {
    this.updateQueryParams({ page });
    this.getArtistAlbums(page);
  }

  render() {
    const { artistAlbums, page, totalAlbumsNumber, limit, error } = this.state;

    if (error) return <Error error={error} />;

    if (!artistAlbums) return <Loading />;

    const currentPage = page || 1;

    const numberOfPages =
      totalAlbumsNumber > limit ? Math.ceil(totalAlbumsNumber / limit) : 1;

    return (
      <div className="content container">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {artistAlbums[0].artists[0].name}
            </li>
          </ol>
        </nav>
        <div className="page-header">
          <h1>{}</h1>
        </div>
        <div className="row" style={{ justifyContent: "space-between" }}>
          {artistAlbums.map(({ id, name, images }) => (
            <Link
              key={id}
              to={"/album/" + id}
              className="card album-link"
              style={{ width: "14rem", marginBottom: "2rem" }}
            >
              <img
                className="card-img-top"
                src={
                  images.length ? images[1].url : "http://placehold.it/300x300"
                }
                alt="Card image cap"
              />
              <div className="card-body">
                <p className="card-text">{name}</p>
              </div>
            </Link>
          ))}
        </div>

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

export default withRouter(ArtistPage);
