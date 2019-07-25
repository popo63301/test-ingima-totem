import express from "express";
import spotify from "./spotify";

/* eslint-disable no-console */

const port = process.env.PORT || 3001;
const app = express();

const limit = 20;

app.use((req, res, next) => {
  spotify.setAccessToken(req.headers.authorization);

  next();
});

app.get("/api/search", async (req, res, next) => {
  const { q, p } = req.query;

  const page = Number(p);

  const options = Object.assign({}, page && { offset: page * limit });

  try {
    // spotify.setAccessToken(req.headers.authorization)

    const results = await spotify.searchArtists(q, options);
    res.json(results.body.artists);
  } catch (err) {
    next(err);
  }
});

app.get("/api/artist/:id/", async (req, res, next) => {
  const { id } = req.params;
  const { p } = req.query;

  const page = Number(p);

  const options = Object.assign({}, page && { offset: page * limit });
  try {
    const result = await spotify.getArtistAlbums(id, options);

    res.json(result.body);
  } catch (err) {
    next(err);
  }
});

app.get("/api/album/:id", async (req, res, next) => {
  const { id } = req.params;

  try {
    const [{ body: albumInfo }, { body: albumTracks }] = await Promise.all([
      spotify.getAlbum(id),
      spotify.getAlbumTracks(id)
    ]);

    const album = {
      albumInfo,
      albumTracks
    };

    res.json(album);
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err) {
    if (err.statusCode === 401) {
      return res.status(401).json(err);
    }

    return res.status(500).json(err);
  }

  next();
});

app.listen(port, err => {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    console.log("Server listening: http://localhost:%s", port);
  }
});
