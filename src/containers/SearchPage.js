import React, { Component } from 'react'

import { withRouter } from 'react-router'

import { Link } from 'react-router-dom'

import _ from 'lodash'
import api from '../utils/api'

import Loading from '../components/Loading'
import Error from '../components/Error'

import SearchResultItem from '../components/SearchResultItem'

function getQueryParams(query) {
  const params = new URLSearchParams(location.search)

  return {
    query: params.get('q'),
    page: params.get('p'),
  }
}

class SearchPage extends Component {
  constructor(props) {
    super(props)

    this.search = _.throttle(this.search.bind(this), 500)
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this)
    this.goToNextPage = this.goToNextPage.bind(this)
    this.goToPreviousPage = this.goToPreviousPage.bind(this)

    const { location } = this.props

    const params = location.search && getQueryParams(location.search)

    this.state = {
      artists: {},
      ...params,
      error: null,
    }

    if (params.query) this.search(params.query, { page: params.page })
  }

  updateQueryParams({ query, page }) {
    const { history } = this.props

    const params = new URLSearchParams()

    params.set('q', query)

    if (page && page > 1) {
      params.set('p', page)
    }

    history.push({
      search: params.toString(),
    })
  }

  handleSearchInputChange(e) {
    const query = e.target.value

    if (!query || query.length < 3) return

    this.search(query)

    const page = 1

    this.setState({ page })

    this.updateQueryParams({ query, page })
  }

  async search(query, { page } = {}) {
    try {
      this.setState({ query })

      const artists = await api.search(query, { p: page })

      this.setState({ artists })
    } catch (error) {
      this.setState({ error })
    }
  }

  goToNextPage() {
    this.setState(({ page }) => ({ page: page - 1 }))
  }

  goToPreviousPage() {
    this.setState(({ page }) => ({ page: page + 1 }))
  }

  goToPage(page) {
    const { query } = this.state

    this.setState({ page })

    this.updateQueryParams({ query, page })
    this.search(query, page)
  }

  render() {
    const { error, query, artists, page } = this.state

    const numberOfPages =
      artists && artists.total > artists.limit
        ? Math.round(artists.total / artists.limit)
        : 1

    let pages = []

    for (let index = 1; index < numberOfPages; index++) {
      pages.push(index)
    }

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
        {pages &&
          pages.length > 1 && (
            <div className="container text-center">
              <nav aria-label="Page navigation example">
                <ul className="pagination">
                  {artists.limit * page > artists.total && (
                    <li>
                      <a
                        className="page-link"
                        href="#"
                        onClick={this.goToPreviousPage}>
                        Previous
                      </a>
                    </li>
                  )}
                  {pages.map(page => (
                    <li className="page-item" key={'page' + page}>
                      <a
                        className="page-link"
                        href="#"
                        onClick={() => this.goToPage(page)}>
                        {page}
                      </a>
                    </li>
                  ))}
                  {artists.limit * page < artists.total && (
                    <li className="page-item">
                      <a
                        className="page-link"
                        href="#"
                        onClick={this.goToNextPage}>
                        Next
                      </a>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
          )}
      </div>
    )
  }
}

export default withRouter(SearchPage)
