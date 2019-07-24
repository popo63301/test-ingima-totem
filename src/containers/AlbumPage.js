import React from 'react'

import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'

import Loading from '../components/Loading'
import Error from '../components/Error'

import api from '../utils/api'

function msToMinutesAndSeconds(ms) {
  const m = Math.floor(ms / 60000)
  const s = ((ms % 60000) / 1000).toFixed(0)
  return m + ':' + (s < 10 ? '0' : '') + s
}

class AlbumPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = { album: null, error: null }
  }

  async getAlbum() {
    const {
      match: { params },
    } = this.props

    try {
      const album = await api.getAlbum(params.id)

      this.setState({ album, error: null })
    } catch (error) {
      this.setState({ error })
    }
  }

  componentDidMount() {
    this.getAlbum()
  }

  render() {
    const { album, error } = this.state
    if (error) return <Error error={error} />
    if (!album) return <Loading />

    const { albumInfo, albumTracks } = album

    return (
      <div className="album container">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to={'/artist/' + albumInfo.artists[0].id}>Artists</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {albumInfo.artists[0].name}
            </li>
          </ol>
        </nav>
        <div className="page-header">
          <h1>{albumInfo.name}</h1>
        </div>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div className="col">
            <img
              src={
                albumInfo.images.length
                  ? albumInfo.images[0].url
                  : 'http://placehold.it/540x540'
              }
              className="thumbnail img-responsive"
              alt={'Album name'}
            />
          </div>
          <div className="col">
            <ul className="list-group">
              {albumTracks.items.map(
                ({ id, name, track_number, duration_ms }) => (
                  <li key={id} className="list-group-item">
                    {track_number}. {name}{' '}
                    <span className="badge">
                      {msToMinutesAndSeconds(duration_ms)}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>
    )

    return (
      <div className="container">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          {albumTracks.map(({ id, name, images }) => (
            <div
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
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default withRouter(AlbumPage)
