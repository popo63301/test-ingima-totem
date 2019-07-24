import React from 'react'

import { Link } from 'react-router-dom'

export default function SearchResultItem({ name, images, id, genres }) {
  return (
    <Link to={'/artist/' + id} className="media-container artist-link" key={id}>
      <div className="media">
        <img
          className="align-self-start mr-3"
          width="64"
          height="64"
          src={images.length ? images[2].url : 'http://placehold.it/300x300'}
          alt="Generic placeholder image"
        />
        <div className="media-body">
          <h5 className="mt-0">{name}</h5>
          {genres && <div>{genres.join(', ')}</div>}
        </div>
      </div>
    </Link>
  )
}
