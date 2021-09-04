import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: 'a72c9cd11375413053bccd6b3e6aaefe',
  },
});

export const getGenres = mediaType =>
  instance.get(`/genre/${mediaType}/list`).then(res => res.data);

export const getMovies = ({mediaType, timeWindow, page = 3}) =>
  instance
    .get(`/trending/${mediaType}/${timeWindow}`, {params: {page}})
    .then(res => res.data);

export const castInfo = ({mediaType, mediaId}) =>
  instance.get(`/${mediaType}/${mediaId}/credits`).then(res => res.data);

export const getDetails = ({mediaType, mediaId}) =>
  instance.get(`/${mediaType}/${mediaId}`).then(res => res.data);

export const getMediaByGenre = ({mediaType, genreId, page}) =>
  instance
    .get(`/discover/${mediaType}`, {params: {page, with_genres: genreId}})
    .then(res => res.data);
