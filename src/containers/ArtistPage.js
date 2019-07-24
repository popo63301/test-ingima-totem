import React from 'react'

import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'

import Loading from '../components/Loading'
import Error from '../components/Error'

import api from '../utils/api'

class ArtistPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      artistAlbums: null,
      error: null,
    }
  }

  async getArtistAlbums() {
    const {
      match: { params },
    } = this.props

    try {
      const { items: artistAlbums } = await api.getArtistAlbums(params.id)

      this.setState({ artistAlbums, error: null })
    } catch (error) {
      this.setState({ error })
    }
  }

  componentDidMount() {
    this.getArtistAlbums()
  }

  render() {
    const { artistAlbums, error } = this.state

    if (error) return <Error error={error} />

    if (!artistAlbums) return <Loading />

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
        <div className="row" style={{ justifyContent: 'space-between' }}>
          {artistAlbums.map(({ id, name, images }) => (
            <Link
              key={id}
              to={'/album/' + id}
              className="card album-link"
              style={{ width: '14rem', marginBottom: '2rem' }}>
              <img
                className="card-img-top"
                src={
                  images.length ? images[1].url : 'http://placehold.it/300x300'
                }
                alt="Card image cap"
              />
              <div className="card-body">
                <p className="card-text">{name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    )
  }
}

export default withRouter(ArtistPage)
