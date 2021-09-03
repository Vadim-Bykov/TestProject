import * as actionTypes from './actionType';
import {initialState} from './state';

export const mediaReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.MEDIA_SET_MEDIA_DATA:
      return {
        ...state,
        mediaData: action.mediaData,
      };

    case actionTypes.MEDIA_SET_GENRES:
      return {
        ...state,
        genres: action.genres,
      };

    case actionTypes.MEDIA_SET_MEDIA_TYPE:
      return {
        ...state,
        mediaType: action.mediaType,
      };

    case actionTypes.MEDIA_SET_TIME_WINDOW:
      return {
        ...state,
        timeWindow: action.timeWindow,
      };

    case actionTypes.MEDIA_SET_PAGE:
      return {
        ...state,
        page: action.page,
      };

    case actionTypes.MEDIA_SET_ACTIVE_GENRE:
      return {
        ...state,
        activeGenre: action.activeGenre,
      };

    case actionTypes.MEDIA_SET_TOTAL_PAGES:
      return {
        ...state,
        totalPages: action.totalPages,
      };

    default:
      return state;
  }
};
