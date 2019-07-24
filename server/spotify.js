import SpotifyWebApi from 'spotify-web-api-node'

import config from '../config'

const { clientId, clientSecret, redirectUri } = config.spotify

const spotifyApi = new SpotifyWebApi({
  clientId,
  clientSecret,
  redirectUri,
})

export default spotifyApi
