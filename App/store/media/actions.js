import * as actionTypes from './actionType';

export const setMediaData = mediaData => ({
  type: actionTypes.MEDIA_SET_MEDIA_DATA,
  mediaData,
});

export const setGenres = genres => ({
  type: actionTypes.MEDIA_SET_GENRES,
  genres,
});

export const setMediaType = mediaType => ({
  type: actionTypes.MEDIA_SET_MEDIA_TYPE,
  mediaType,
});

export const setTimeWindow = timeWindow => ({
  type: actionTypes.MEDIA_SET_TIME_WINDOW,
  timeWindow,
});

export const setPage = page => ({
  type: actionTypes.MEDIA_SET_PAGE,
  page,
});

export const setActiveGenre = activeGenre => ({
  type: actionTypes.MEDIA_SET_ACTIVE_GENRE,
  activeGenre,
});

export const setTotalPages = totalPages => ({
  type: actionTypes.MEDIA_SET_TOTAL_PAGES,
  totalPages,
});
