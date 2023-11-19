import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import "react-h5-audio-player/lib/styles.css";
import { actionType } from "../context/reducer";
import { filterByLanguage, filters } from "../utils/supportfunctions";
import {
  SET_ALL_SONGS,
  SET_ARTISTS,
  SET_ALL_ARTISTS,
  SET_LANGUAGE_FILTER,
  SET_SONG,
  SET_SONG_PLAYING,
  SET_CURRENT_PLAYLIST,
} from "../store/actions";
import { Navigate } from "react-router-dom";
const PlaylistCard = ({ playlist }) => {
  return (
    <div className="playlist-card">
      <img src={playlist.imageURL} alt={playlist.name} />
      <h3>{playlist.name}</h3>
      <p>{playlist.songs.length} bài hát</p>
    </div>
  );
};
const ForYou_PlaylistCard = ({ playlists }) => {
  return (
    <div className="playlist-list">
      {playlists.map((playlist) => (
        <PlaylistCard key={playlist._id} playlist={playlist} />
      ))}
    </div>
  );
};
export default ForYou_PlaylistCard;
