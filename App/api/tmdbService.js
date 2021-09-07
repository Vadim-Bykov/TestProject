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

export const getCastInfo = ({mediaType, mediaId}) =>
  instance.get(`/${mediaType}/${mediaId}/credits`).then(res => res.data);

export const getDetails = ({mediaType, mediaId}) =>
  instance.get(`/${mediaType}/${mediaId}`).then(res => res.data);

export const getMediaByGenre = ({mediaType, genreId, page}) =>
  instance
    .get(`/discover/${mediaType}`, {params: {page, with_genres: genreId}})
    .then(res => res.data);

// List AUTH_4
const access_token_auth_4 =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNzJjOWNkMTEzNzU0MTMwNTNiY2NkNmIzZTZhYWVmZSIsInN1YiI6IjYwOTJmOGM0ZjNiNDlhMDAyYTFlNDEyNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.sa7veC1eAo-AshOWhWMa0RUUHXOf0bluZwOmNovjyNo';

const listInstance = axios.create({
  baseURL: 'https://api.themoviedb.org/4',
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    Authorization:
      'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzY29wZXMiOlsiYXBpX3JlYWQiLCJhcGlfd3JpdGUiXSwidmVyc2lvbiI6MSwibmJmIjoxNjMxMDE4MDA3LCJzdWIiOiI2MDkyZjhjNGYzYjQ5YTAwMmExZTQxMjQiLCJhdWQiOiJhNzJjOWNkMTEzNzU0MTMwNTNiY2NkNmIzZTZhYWVmZSIsImp0aSI6IjM0NzQ0MzgifQ.qpFWehmjONocSFq94rLMq66k3g313uiZeToSA5J6J7U',
  },
  // url: 7107051,
});

const getRequestBody = (mediaType, mediaId) => ({
  items: [
    {
      media_type: mediaType,
      media_id: mediaId,
    },
  ],
});

export const getList = (page = 1) =>
  listInstance
    .get(`/list/7107051`, {
      // url: '7107051',
      params: {page},
      sort_by: 'original_order.desc',
    })
    .then(res => res.data);

export const addMedia = (mediaType, mediaId) =>
  listInstance
    .post(`/list/7107051/items`, getRequestBody(mediaType, mediaId))
    .then(res => res.data);

export const removeMedia = (mediaType, mediaId) =>
  listInstance
    .delete(`/list/7107051/items`, {data: getRequestBody(mediaType, mediaId)})
    .then(res => res.data);

//
//
// `https://www.themoviedb.org/auth/access?request_token={request_token}`;

`{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzY29wZXMiOlsiYXBpX3JlYWQiLCJhcGlfd3JpdGUiXSwidmVyc2lvbiI6MSwibmJmIjoxNjMxMDE4MDA3LCJzdWIiOiI2MDkyZjhjNGYzYjQ5YTAwMmExZTQxMjQiLCJhdWQiOiJhNzJjOWNkMTEzNzU0MTMwNTNiY2NkNmIzZTZhYWVmZSIsImp0aSI6IjM0NzQ0MzgifQ.qpFWehmjONocSFq94rLMq66k3g313uiZeToSA5J6J7U",
  "account_id": "6092f8c4f3b49a002a1e4124",
  "status_code": 1,
  "status_message": "Success.",
  "success": true
}`;

// List
`{
  "id": 7107051,
  "status_code": 1,
  "status_message": "The item/record was created successfully.",
  "success": true
}`;
