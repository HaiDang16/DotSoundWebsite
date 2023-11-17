import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import themes from "./themes";
import Routes from "./routes";
import "./App.css";
import {
  getAuth,
  GoogleAuthProvider,
  inMemoryPersistence,
  signInWithPopup,
} from "firebase/auth";
import { getAllSongs, validateUser } from "./api";
import {
  Dashboard,
  Loader,
  Login,
  MusicPlayer,
  ThinhHanh,
  UserProfile,
} from "./components";
import { useStateValue } from "./context/StateProvider";
import { actionType } from "./context/reducer";
import { motion, AnimatePresence } from "framer-motion";
import { SET_USER, SET_ALL_SONGS } from "./store/actions";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const [{ user, allSongs, song, isSongPlaying, miniPlayer }, dispatch] =
  //   useStateValue();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const isLoggedIn = window.localStorage.getItem("auth") === "true";
    console.log("isLoggedIn", isLoggedIn);
    if (isLoggedIn) {
      const userData = JSON.parse(window.localStorage.getItem("userData"));
      // Thực hiện các hành động cần thiết để hiển thị trạng thái đăng nhập
      console.log("userData: ", userData);
      dispatch({
        type: SET_USER,
        user: userData,
      });
    }
    setIsLoading(false);
  }, []);

  const customization = useSelector((state) => state.customization);
  const allSongs = useSelector((state) => state.customization.allSongs);

  const isSongPlaying = useSelector(
    (state) => state.customization.isSongPlaying
  );
  console.log("isSongPlaying ", isSongPlaying);
  useEffect(() => {
    if (!allSongs) {
      getAllSongs().then((data) => {
        dispatch({
          type: SET_ALL_SONGS,
          allSongs: data.songs,
        });
        console.log("data.songs: ", data.songs);
      });
    }
  }, []);
  return (
    <AnimatePresence mode="wait">
      <div className="h-auto min-w-[680px]">
        <Routes />
      </div>
      {isSongPlaying && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`fixed min-w-[700px] h-26  inset-x-0 bottom-0  bg-cardOverlay drop-shadow-2xl backdrop-blur-md flex items-center justify-center`}
        >
          <MusicPlayer />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
