import axios from "axios";

const api = axios.create({
  baseURL: "/api/",
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 1000
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = token;

  return config;
});

const setupAuthInterceptor = history => {
  api.interceptors.response.use(
    ({ data }) => (data === "OK" ? null : data),
    error => {
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        return history.push("/login");
      }
    }
  );
};

const search = (q, params) => api.get("search", { params: { q, ...params } });

const getArtistAlbums = (artistId, params) =>
  api.get("artist/" + artistId, { params: { ...params } });
const getAlbum = albumId => api.get("album/" + albumId);

export default { search, getArtistAlbums, getAlbum, setupAuthInterceptor };
