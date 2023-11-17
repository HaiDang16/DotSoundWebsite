import React, { useEffect, useState } from "react";
import { getAllSongs } from "../api";
import { actionType } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";
import { SongCard } from "./DashboardSongs";
import Filter from "./Filter";
import Header from "./Header";
import Footer from "./Footer";
import { motion } from "framer-motion";
import { blue_200, blue_600, banner } from "../assets/img";
import Release from "./Release";
import { filterByLanguage } from "../utils/supportfunctions";
import { getAllArtist } from "../api";
import { IoLogoInstagram, IoLogoTwitter } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { getAllAlbums, deleteAlbumsById } from "../api";

const ForYou = () => {
    const [
        {
            searchTerm,
            isSongPlaying,
            song,
            allSongs,
            artistFilter,
            filterTerm,
            albumFilter,
            languageFilter,
            artists,
            allAlbums,
        },
        dispatch,
    ] = useStateValue();

    const [filteredSongs, setFilteredSongs] = useState(null);


    useEffect(() => {
        if (!allSongs) {
            getAllSongs().then((data) => {
                dispatch({
                    type: actionType.SET_ALL_SONGS,
                    allSongs: data.data,
                });
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

    useEffect(() => {
        const filterByLanguage = allSongs?.filter(
            (data) => data.category.toLowerCase() === filterTerm
        );
        if (filterByLanguage) {
            setFilteredSongs(filterByLanguage);
        } else {
            setFilteredSongs(null);
        }
    }, [filterTerm]);

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
            (data) => data.language === languageFilter
        );

        if (filterByLanguage) {
            setFilteredSongs(filterByLanguage);
        } else {
            setFilteredSongs(null);
        }
    }, [languageFilter]);

    useEffect(() => {
        if (!artists) {
            getAllArtist().then((data) => {
                dispatch({ type: actionType.SET_ARTISTS, artists: data.data });
            });
        }
    }, []);
    return (
        <div className="relative w-full h-auto flex flex-col justify-center bg_website_02">
            <Header />


            {/* {searchTerm.length > 0 && (
        <p className="m-4 text-base text-white right-0 z-10">
          Searched for :
          <span className="text-xl text-white font-semibold">{searchTerm}</span>
        </p>
      )}

      <Filter className={"z-30"} setFilteredSongs={setFilteredSongs} />

      <div className="w-full h-auto flex items-center justify-evenly gap-4 flex-wrap p-4"></div>
 */}
            {/* Content ThinhHanh */}
            <div className="md:p-20 z-0">
                <div className="my-10">
                    <div className=" text-white font-medium flex justify-between">
                        <div className="my-2 text-2xl">PlayList</div>
                        <div className="px-4 my-2 text-lg">Tất cả</div>
                    </div>
                    <div className="h-56 w-full grid grid-rows-1 scroll-hidden gap-10 items-center overscroll-behavior-x-contain overflow-x-scroll">
                        <div className="flex flex-nowrap gap-4 h-full">
                            {/* <KhamPhaSongContainer musics={allSongs} /> */}
                            {allAlbums &&
                                allAlbums.slice(0, 5).map((data, index) => (
                                    <AlbumCard key={index} data={data} index={index} />
                                ))}
                        </div>
                    </div>
                </div>

                {/* <dir>
          <Release setFilteredSongs={setFilteredSongs} />
          <ReleaseSongContainer
            musics={filteredSongs ? filteredSongs : allSongs}
          />
        </dir> */}
                {/* <Filter setFilteredSongs={setFilteredSongs} /> */}
                {/* <Filter className={"z-30"} setFilteredSongs={setFilteredSongs} />
                <div className="w-full h-auto flex items-center justify-evenly gap-4 flex-wrap p-4">
                    <HomeSongContainer
                        musics={filteredSongs ? filteredSongs : allSongs}
                    />
                </div> */}

                <div className="my-10">
                    <div className=" text-white font-medium flex justify-between">
                        <div className="my-2 text-2xl">Nghê sĩ yêu thích của bạn</div>
                        <div className="px-4 my-2 text-lg">Tất cả</div>
                    </div>
                    <div className="h-72 w-full grid grid-rows-1 scroll-hidden gap-3 items-center overscroll-behavior-x-contain overflow-x-scroll">
                        <div className="flex flex-nowrap gap-4">
                            {/* <Top10SongContainer musics={allSongs} /> */}
                            {artists &&
                                artists.slice(0, 5).map((data, index) => (
                                    <ArtistCard key={index} data={data} index={index} />
                                ))}

                        </div>
                    </div>
                </div>

                <div className="my-10">
                    <div className=" text-white font-medium flex justify-between">
                        <div className="my-2b  text-2xl">Bài hát</div>
                    </div>
                    <Filter className={"z-30"} setFilteredSongs={setFilteredSongs} />
                    <div className="h-full w-full grid grid-cols-2 gap-10 items-center ">
                        <SongContainer musics={filteredSongs ? filteredSongs : allSongs} />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export const HomeSongContainer = ({ musics }) => {
    const [{ isSongPlaying, song }, dispatch] = useStateValue();

    const addSongToContext = (index) => {
        if (!isSongPlaying) {
            dispatch({
                type: actionType.SET_SONG_PLAYING,
                isSongPlaying: true,
            });
        }
        if (song !== index) {
            dispatch({
                type: actionType.SET_SONG,
                song: index,
            });
        }
    };
    return (
        <>
            {musics?.map((data, index) => (
                <motion.div
                    key={data._id}
                    whileTap={{ scale: 0.8 }}
                    initial={{ opacity: 0, translateX: -50 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="relative w-40 min-w-210 px-2 py-4 cursor-pointer hover:shadow-xl hover:bg-card bg-gray-100 shadow-md rounded-lg flex flex-col items-center"
                    onClick={() => addSongToContext(index)}
                >
                    <div className="w-40 min-w-[160px] h-40 min-h-[160px] rounded-lg drop-shadow-lg relative overflow-hidden">
                        <motion.img
                            whileHover={{ scale: 1.05 }}
                            src={data.imageURL}
                            alt=""
                            className=" w-full h-full rounded-lg object-cover"
                        />
                    </div>

                    <p className="text-base text-headingColor font-semibold my-2">
                        {data.name.length > 25 ? `${data.name.slice(0, 25)}` : data.name}
                        <span className="block text-sm text-gray-400 my-1">
                            {data.artist}
                        </span>
                    </p>
                </motion.div>
            ))}
        </>
    );
};
export const ReleaseSongContainer = ({ musics }) => {
    const [{ isSongPlaying, song }, dispatch] = useStateValue();

    const addSongToContext = (index) => {
        if (!isSongPlaying) {
            dispatch({
                type: actionType.SET_SONG_PLAYING,
                isSongPlaying: true,
            });
        }
        if (song !== index) {
            dispatch({
                type: actionType.SET_SONG,
                song: index,
            });
        }
    };
    return (
        <>
            {musics?.map((data, index) => (
                <div>
                    <motion.div
                        key={data._id}
                        whileTap={{ scale: 0.8 }}
                        initial={{ opacity: 0, translateX: -50 }}
                        animate={{ opacity: 1, translateX: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className=" cursor-pointer hover:shadow-xl hover:bg-card h-12 w-225 bg-slate-400 mr-10 rounded-lg border-4 border-gray-300"
                        onClick={() => addSongToContext(index)}
                    >
                        <div className="h-12 w-225 bg-blue-300 rounded-lg drop-shadow-lg relative overflow-hidden">
                            <motion.img
                                whileHover={{ scale: 1.05 }}
                                src={data.imageURL}
                                alt=""
                                className=" w-full h-full rounded-lg object-cover"
                            />
                            <p className="text-base text-headingColor font-semibold my-2">
                                {data.name.length > 25
                                    ? `${data.name.slice(0, 25)}`
                                    : data.name}
                                <span className="block text-sm text-gray-400 my-1">
                                    {data.artist}
                                </span>
                            </p>
                        </div>
                    </motion.div>
                </div>
            ))}
        </>
    );
};

export const KhamPhaSongContainer = ({ musics }) => {
    const [{ isSongPlaying, song }, dispatch] = useStateValue();

    const addSongToContext = (index) => {
        if (!isSongPlaying) {
            dispatch({
                type: actionType.SET_SONG_PLAYING,
                isSongPlaying: true,
            });
        }
        if (song !== index) {
            dispatch({
                type: actionType.SET_SONG,
                song: index,
            });
        }
    };
    return (
        <>
            {musics?.map((data, index) => (
                <div>
                    <motion.div
                        key={data._id}
                        whileTap={{ scale: 0.8 }}
                        initial={{ opacity: 0, translateX: -50 }}
                        animate={{ opacity: 1, translateX: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className=" cursor-pointer hover:shadow-xl hover:bg-card h-auto w-275 bg-slate-400 mr-6 rounded-lg border-4 border-gray-300"
                        onClick={() => addSongToContext(index)}
                    >
                        <div className="w-full min-w-[160px] h-40 min-h-[160px] rounded-lg drop-shadow-lg relative overflow-hidden">
                            <motion.img
                                whileHover={{ scale: 1.05 }}
                                src={data.imageURL}
                                alt=""
                                className=" w-full h-full rounded-lg object-cover"
                            />
                        </div>
                    </motion.div>
                </div>
            ))}
        </>
    );
};

export const SongContainer = ({ musics }) => {
    const [{ isSongPlaying, song }, dispatch] = useStateValue();

    const addSongToContext = (index) => {
        if (!isSongPlaying) {
            dispatch({
                type: actionType.SET_SONG_PLAYING,
                isSongPlaying: true,
            });
        }
        if (song !== index) {
            dispatch({
                type: actionType.SET_SONG,
                song: index,
            });
        }
    };
    return (
        <>
            {musics?.map((data, index) => (
                <div className=" flex flex-col-2 justify-center">
                    <motion.div
                        key={data._id}
                        whileTap={{ scale: 0.8 }}
                        initial={{ opacity: 0, translateX: -50 }}
                        animate={{ opacity: 1, translateX: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className=" cursor-pointer hover:shadow-xl hover:bg-card h-auto w-2/3 bg-slate-400 mr-16 rounded-xl border-4 border-gray-300"
                        onClick={() => addSongToContext(index)}
                    >
                        <div className=" flex">

                            <div className=" h-5 min-w-[160px] w-5 min-h-[160px] rounded-lg drop-shadow-lg relative overflow-hidden">
                                <motion.img
                                    whileHover={{ scale: 1.05 }}
                                    src={data.imageURL}
                                    alt=""
                                    className=" w-full h-full rounded-lg object-cover"
                                />
                            </div>
                            <p className="text-base text-white font-semibold my-2 pl-10">
                                {data.name.length > 25 ? `${data.name.slice(0, 25)}` : data.name}
                                <span className="block text-sm  my-2">{data.artist}</span>
                            </p>
                        </div>

                    </motion.div>
                </div>
            ))}
        </>
    );
};

export const TheLoaiSongContainer = ({ musics }) => {
    const [{ isSongPlaying, song }, dispatch] = useStateValue();

    const addSongToContext = (index) => {
        if (!isSongPlaying) {
            dispatch({
                type: actionType.SET_SONG_PLAYING,
                isSongPlaying: true,
            });
        }
        if (song !== index) {
            dispatch({
                type: actionType.SET_SONG,
                song: index,
            });
        }
    };
    return (
        <>
            {musics?.map((data, index) => (
                <div>
                    <motion.div
                        key={data._id}
                        whileTap={{ scale: 0.8 }}
                        initial={{ opacity: 0, translateX: -50 }}
                        animate={{ opacity: 1, translateX: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className=" cursor-pointer hover:shadow-xl hover:bg-card h-auto w-auto bg-slate-400 mr-10 rounded-lg border-4 border-gray-300"
                        onClick={() => addSongToContext(index)}
                    >
                        <div className="h-28 min-w-[160px] w-275  rounded-lg drop-shadow-lg relative overflow-hidden">
                            <motion.img
                                whileHover={{ scale: 1.05 }}
                                src={data.imageURL}
                                alt=""
                                className=" w-full h-full rounded-lg object-cover"
                            />
                        </div>
                    </motion.div>
                </div>
            ))}
        </>
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
                src={data?.imageURL}
                className="w-full h-40 object-cover rounded-md"
                alt=""
            />

            <p className="text-base text-textColor">{data.name}</p>
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
    const [isDelete, setIsDelete] = useState(false);
    const [alert, setAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState(null);

    const [dispatch] = useStateValue();
    const deleteObject = (id) => {
        console.log(id);
        deleteAlbumsById(id).then((res) => {
            // console.log(res.data);
            if (res.data.success) {
                setAlert("success");
                setAlertMsg(res.data.msg);
                getAllAlbums().then((data) => {
                    dispatch({
                        type: actionType.SET_ALL_ALBUMS,
                        allAlbums: data.data,
                    });
                });
                setTimeout(() => {
                    setAlert(false);
                }, 4000);
            } else {
                setAlert("error");
                setAlertMsg(res.data.msg);
                setTimeout(() => {
                    setAlert(false);
                }, 4000);
            }
        });
    };
    return (
        <motion.div
            initial={{ opacity: 0, translateX: -50 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="relative  overflow-hidden w-1/3 h-full min-w-180 px-2 py-4 gap-3 cursor-pointer hover:shadow-xl hover:bg-card bg-gray-100 shadow-md rounded-lg flex flex-col items-center"
        >
            <img
                src={data?.imageURL}
                className="w-full h-40 object-cover rounded-md"
                alt=""
            />

            <p className="text-base text-textColor">{data.name}</p>



        </motion.div>
    );
};

export default ForYou;
