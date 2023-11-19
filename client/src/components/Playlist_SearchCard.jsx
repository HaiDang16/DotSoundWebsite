import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  SET_ALL_SONGS,
  SET_ARTISTS,
  SET_ALL_ARTISTS,
  SET_LANGUAGE_FILTER,
  SET_SONG,
  SET_SONG_PLAYING,
} from "../store/actions";
const PlaylistSearchCard = ({
  key,
  index,
  songName,
  songImageURL,
  songID,
  songArtist,
  songAlbum,
  onSelect,
}) => {
  const navigate = useNavigate();

  console.log(songArtist);
  const dispatch = useDispatch();
  const song = useSelector((state) => state.customization.song);
  const isSongPlaying = useSelector(
    (state) => state.customization.isSongPlaying
  );
  const handleSongClick = (e) => {
    onSelect({songID});
  };

  return (
    <motion.div
      whileTap={{ scale: 0.8 }}
      initial={{ opacity: 0, translateX: -50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="flex-auto h-full w-full flex flex-col py-1 px-5 hover:bg-cardOverlay"
      key={key}
      onClick={handleSongClick}
    >
      <div className="flex items-center">
        <div className="w-14 h-14 ml-2 mr-4 rounded-full">
          <img
            src={songImageURL}
            alt="Hỉnh ảnh"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="flex flex-col">
          <p>{songName}</p>
          <p className="text-sm text-gray-600 mt-1">
            {songArtist} ({songAlbum})
          </p>
        </div>
      </div>
    </motion.div>
  );
};
export default PlaylistSearchCard;
