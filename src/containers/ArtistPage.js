import React from "react";

import { Link } from "react-router-dom";
import { withRouter } from "react-router";

import Loading from "../components/Loading";
import Error from "../components/Error";

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

    this.setState({ page: newPage });
    this.changePage({ page: newPage });
  }

  goToNextPage() {
    const { page } = this.state;
    const newPage = page + 1;

    this.setState({ page: newPage });
    this.changePage({ page: newPage });
  }

  goToPage(page) {
    if (!isNaN(page)) {
      this.setState({ page });
      this.changePage({ page });
    }
  }

  changePage({ page }) {
    this.updateQueryParams({ page });
    this.getArtistAlbums(page);
  }

  pagination(currentPage, pageCount) {
    const delta = 2;
    const left = currentPage - delta;
    const right = currentPage + delta + 1;
    let result = [];

    result = Array.from({ length: pageCount }, (v, k) => k + 1).filter(
      i => i && i >= left && i < right
    );

    if (result.length > 1) {
      if (result[0] > 1) {
        if (result[0] > 2) {
          result.unshift("...");
        }
        result.unshift(1);
      }

      if (result[result.length - 1] < pageCount) {
        if (result[result.length - 1] !== pageCount - 1) {
          result.push("...");
        }
        result.push(pageCount);
      }
    }

    return result;
  }

  render() {
    const { artistAlbums, page, totalAlbumsNumber, limit, error } = this.state;

    if (error) return <Error error={error} />;

    if (!artistAlbums) return <Loading />;

    const currentPage = page || 1;

    const numberOfPages =
      totalAlbumsNumber > limit ? Math.ceil(totalAlbumsNumber / limit) : 1;

    const pages = this.pagination(currentPage, numberOfPages);

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

        {pages && pages.length > 1 && (
          <div className="container text-center">
            <nav aria-label="Page navigation example">
              <ul className="pagination">
                {currentPage > 1 && (
                  <li>
                    <button
                      className="page-link"
                      onClick={this.goToPreviousPage}
                    >
                      Previous
                    </button>
                  </li>
                )}
                {pages.map((page, index) => (
                  <li
                    className={`page-item ${page == currentPage && "disabled"}`}
                    key={"page" + index}
                  >
                    <button
                      className="page-link"
                      onClick={() => page != currentPage && this.goToPage(page)}
                    >
                      {page}
                    </button>
                  </li>
                ))}
                {currentPage < numberOfPages && (
                  <li className="page-item">
                    <button className="page-link" onClick={this.goToNextPage}>
                      Next
                    </button>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(ArtistPage);
