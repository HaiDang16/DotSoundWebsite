// action - state management
import * as actionTypes from "./actions";

export const initialState = {
  user: null,
  allUsers: null,
  allSongs: null,
  allArtists: null,
  allAlbums: null,
  auth: false || window.localStorage.getItem("auth") === "true",
  searchTerm: null,
  artists: null,
  artistFilter: null,
  languageFilter: null,
  albumFilter: null,
  song: 0,
  isSongPlaying: false,
  miniPlayer: false,
  categoryFilter: null,
};

// ==============================|| CUSTOMIZATION REDUCER ||============================== //

const customizationReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user,
      };

    case actionTypes.SET_AUTH:
      return {
        ...state,
        auth: action.auth,
      };
    case actionTypes.SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.searchTerm,
      };

    case actionTypes.SET_FILTER_TERM:
      return {
        ...state,
        filterTerm: action.filterTerm,
      };
    case actionTypes.SET_ARTISTS:
      return {
        ...state,
        artists: action.artists,
      };

    case actionTypes.SET_ARTIST_FILTER:
      return {
        ...state,
        artistFilter: action.artistFilter,
      };

    case actionTypes.SET_LANGUAGE_FILTER:
      return {
        ...state,
        languageFilter: action.languageFilter,
      };

    case actionTypes.SET_ALL_USERS:
      return {
        ...state,
        allUsers: action.allUsers,
      };

    case actionTypes.SET_ALL_SONGS:
      return {
        ...state,
        allSongs: action.allSongs,
      };

    case actionTypes.SET_ALL_ALBUMS:
      return {
        ...state,
        allAlbums: action.allAlbums,
      };

    case actionTypes.SET_ALBUM_FILTER:
      return {
        ...state,
        albumFilter: action.albumFilter,
      };

    case actionTypes.SET_SONG:
      return {
        ...state,
        song: action.song,
      };

    case actionTypes.SET_SONG_PLAYING:
      return {
        ...state,
        isSongPlaying: action.isSongPlaying,
      };

    case actionTypes.SET_MINI_PLAYER:
      return {
        ...state,
        miniPlayer: action.miniPlayer,
      };
    case actionTypes.SET_ALL_CATEGORIES:
      return {
        ...state,
        allCategories: action.allCategories,
      };
    case actionTypes.SET_CATEGORY_FILTER:
      return {
        ...state,
        categoryFilter: action.categoryFilter,
      };
    case actionTypes.SET_ALL_ARTISTS:
      return {
        ...state,
        allArtists: action.allArtists,
      };

    default:
      return state;
  }
};

export default customizationReducer;
