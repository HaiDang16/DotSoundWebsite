import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import BackgroundLogin from "../assets/img/background_Login.jpg";
import {
  getAllAlbums,
  getPlaylistByUserID,
  getPlaylistDetails,
  getAllArtist,
  getAllSongs,
} from "../api";
import { useSelector, useDispatch } from "react-redux";
import {
  SET_ALL_SONGS,
  SET_SONG_PLAYING,
  SET_ALL_ARTISTS,
  SET_ALL_ALBUMS,
  SET_SONG,
  RESET_PLAYLIST,
  SET_CURRENT_PLAYLIST,
} from "../store/actions";
import { ForYou_SongCard } from "../components";
const ForYou = () => {
  const dispatch = useDispatch();
  const allAlbums = useSelector((state) => state.customization.allAlbums);
  const languageFilter = useSelector(
    (state) => state.customization.languageFilter
  );
  const allSongs = useSelector((state) => state.customization.allSongs);
  const allArtists = useSelector((state) => state.customization.allArtists);
  const [filteredSongs, setFilteredSongs] = useState(null);
  const userData = JSON.parse(window.localStorage.getItem("userData"));
  const userDataID = userData?.user?._id;
  useEffect(() => {
    if (!allSongs) {
      getAllSongs().then((data) => {
        console.log(data.songs);
        dispatch({
          type: SET_ALL_SONGS,
          allSongs: data.songs,
        });
      });
    }
    if (!allArtists) {
      getAllArtist().then((data) => {
        dispatch({ type: SET_ALL_ARTISTS, allArtists: data.artists });
      });
    }
    if (!allAlbums) {
      getAllAlbums().then((data) => {
        console.log(data);
        dispatch({ type: SET_ALL_ALBUMS, allAlbums: data.albums });
      });
    }
  }, []);

  // useEffect(() => {
  //   if (searchTerm.length > 0) {
  //     const filtered = allSongs.filter(
  //       (data) =>
  //         data.artist.toLowerCase().includes(searchTerm) ||
  //         data.language.toLowerCase().includes(searchTerm) ||
  //         data.name.toLowerCase().includes(searchTerm) ||
  //         data.artist.includes(artistFilter)
  //     );
  //     setFilteredSongs(filtered);
  //   } else {
  //     setFilteredSongs(null);
  //   }
  // }, [searchTerm]);

  // useEffect(() => {
  //   const filtered = allSongs?.filter((data) => data.artist === artistFilter);
  //   if (filtered) {
  //     setFilteredSongs(filtered);
  //   } else {
  //     setFilteredSongs(null);
  //   }
  // }, [artistFilter]);

  //   useEffect(() => {
  //     const filterByLanguage = allSongs?.filter(
  //       (data) => data.songCategory.songCategoryName.toLowerCase() === filterTerm
  //     );
  //     if (filterByLanguage) {
  //       setFilteredSongs(filterByLanguage);
  //     } else {
  //       setFilteredSongs(null);
  //     }
  //   }, [filterTerm]);

  // useEffect(() => {
  //   const filtered = allSongs?.filter((data) => data.album === albumFilter);
  //   if (filtered) {
  //     setFilteredSongs(filtered);
  //   } else {
  //     setFilteredSongs(null);
  //   }
  // }, [albumFilter]);

  useEffect(() => {
    const filterByLanguage = allSongs?.filter(
      (data) => data.songLanguage === languageFilter
    );
    if (filterByLanguage) {
      setFilteredSongs(filterByLanguage);
    } else {
      setFilteredSongs(null);
    }
  }, [languageFilter]);
  const [loadedDetails, setLoadedDetails] = useState();
  useEffect(() => {
    getPlaylistByUserID(userDataID).then((res) => {
      console.log("getPlaylistByUserID res: ", res);
      setLoadedDetails(res.playlists);
      console.log(res.playlists);
    });
  }, []);

  return (
    <div
      style={{ backgroundImage: `url(${BackgroundLogin})` }}
      className="relative w-full h-auto flex flex-col justify-center "
    >
      <div className="md:p-20 z-0">
        <div className="my-10">
          <div className=" text-white font-medium flex justify-between">
            <div className="my-2 text-2xl">Album mới nhất</div>
            <div className="px-4 my-2 text-lg">Tất cả</div>
          </div>
          <div className="h-56 w-full grid grid-rows-1 scroll-hidden gap-10 items-center overscroll-behavior-x-contain overflow-x-scroll">
            <div className="flex flex-nowrap gap-4 h-full">
              {allAlbums &&
                allAlbums
                  .slice(0, 5)
                  .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                  .map((data, index) => (
                    <AlbumCard key={index} data={data} index={index} />
                  ))}
            </div>
          </div>
        </div>

        <div className="my-10">
          <div className=" text-white font-medium flex justify-between">
            <div className="my-2 text-2xl">Nghê sĩ yêu thích của bạn</div>
            <div className="px-4 my-2 text-lg">Tất cả</div>
          </div>
          <div className="h-72 w-full grid grid-rows-1 scroll-hidden gap-3 items-center overscroll-behavior-x-contain overflow-x-scroll">
            <div className="flex flex-nowrap gap-4">
              {allArtists &&
                allArtists
                  .slice(0, 5)
                  .sort((a, b) => b.artistName.localeCompare(a.artistName))
                  .map((data, index) => (
                    <ArtistCard key={index} data={data} index={index} />
                  ))}
            </div>
          </div>
        </div>
        <div className="my-10">
          <div className=" text-white font-medium flex justify-between">
            <div className="my-2 text-2xl">Danh sách phát của bạn</div>
            <div className="px-4 my-2 text-lg">Tất cả</div>
          </div>
          <div className="flex flex-wrap mt-6">
            {loadedDetails
              ?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
              .map((playlist) => (
                <PlaylistItem
                  key={playlist.id}
                  playlistName={playlist.playlistName}
                  playlistImageURL={playlist.playlistImageURL}
                  playlistID={playlist.id}
                />
              ))}
          </div>
        </div>
        <div className="my-10">
          <div className=" text-white font-medium flex justify-between">
            <div className="my-2b  text-2xl">Bài hát</div>
          </div>
          <ForYou_SongCard
            musics={allSongs.sort((a, b) =>
              a.songName.localeCompare(b.songName)
            )}
          />
        </div>
      </div>
    </div>
  );
};
export const ArtistCard = ({ data, index }) => {
  const [isDelete, setIsDelete] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, translateX: -50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="relative w-full min-w-180 px-2 py-4 gap-3 cursor-pointer hover:shadow-xl hover:bg-card bg-gray-100 shadow-md rounded-lg flex flex-col items-center"
    >
      <img
        src={data?.artistImageURL}
        className="w-full h-40 object-cover rounded-md"
        alt=""
      />

      <p className="text-base text-textColor">{data.artistName}</p>
      {/* <div className="flex items-center gap-4">
                <a href={data.instagram} target="_blank">
                    <motion.i whileTap={{ scale: 0.75 }}>
                        <IoLogoInstagram className="text-gray-500 hover:text-headingColor text-xl" />
                    </motion.i>
                </a>
                <a href={data.twitter} target="_blank">
                    <motion.i whileTap={{ scale: 0.75 }}>
                        <IoLogoTwitter className="text-gray-500 hover:text-headingColor text-xl" />
                    </motion.i>
                </a>
            </div> */}
    </motion.div>
  );
};

export const AlbumCard = ({ data, index }) => {
  const dispatch = useDispatch();
  const [isDelete, setIsDelete] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0, translateX: -50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="relative overflow-hidden w-1/3 h-full min-w-180 px-2 py-4 gap-3 cursor-pointer hover:shadow-xl hover:bg-card bg-gray-100 shadow-md rounded-lg flex flex-col items-center"
    >
      <img
        src={data?.albumImageURL}
        className="w-full h-40 object-cover rounded-md"
        alt=""
      />

      <p className="text-base text-textColor">{data.albumName}</p>
    </motion.div>
  );
};
const PlaylistItem = ({ playlistName, playlistImageURL, playlistID }) => {
  const dispatch = useDispatch();
  console.log(playlistID);
  const isSongPlaying = useSelector(
    (state) => state.customization.isSongPlaying
  );
  const song = useSelector((state) => state.customization.song);
  const playlist = useSelector((state) => state.customization.playlist) || [];
  const handlePlayPlaylist = async () => {
    let response;
    await getPlaylistDetails(playlistID).then((res) => {
      console.log("getPlaylistDetails res: ", res);
      response = res.playlist.playlistItems;
      console.log("response: ", response);
    });

    try {
      dispatch({
        type: RESET_PLAYLIST,
      });

      const playlistItems = response;
      playlistItems.forEach((playlistItem) => {
        const songNew = playlistItem.playlistSongID;
        console.log(songNew);
        dispatch({
          type: SET_CURRENT_PLAYLIST,
          playlist: songNew,
        });
      });
      console.log("playlist: ", playlist);
      if (!isSongPlaying) {
        dispatch({
          type: SET_SONG_PLAYING,
          isSongPlaying: true,
        });
      }

      const songIndex = allSongs.findIndex(
        (song) =>
          song.songImageURL === playlistItems[0].playlistSongID.songImageURL
      );
      if (song !== songIndex) {
        dispatch({
          type: SET_SONG,
          song: songIndex,
        });
      }
    } catch (error) {
      console.error("Error fetching playlist details:", error);
    }
  };

  const allSongs = useSelector((state) => state.customization.allSongs);
  if (!allSongs) {
    getAllSongs().then((data) => {
      dispatch({
        type: SET_ALL_SONGS,
        allSongs: data.songs,
      });
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, translateX: -50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ duration: 0.3 }}
      key={playlistID}
      className="relative overflow-hidden min-w-[260px] py-3 px-3 hover:bg-cardOverlay bg-primary h-full min-w-180 gap-3 cursor-pointer hover:shadow-xl mr-4  rounded-xl flex flex-col items-center"
      onClick={handlePlayPlaylist}
    >
      <img
        className="w-full h-36  object-cover rounded-md"
        src={playlistImageURL}
      />
      <div className="flex items-center justify-center font-normal text-lg text-website">
        {playlistName}
      </div>
    </motion.div>
  );
};
export default ForYou;
