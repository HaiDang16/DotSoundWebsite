import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
const SearchCard = ({
  key,
  index,
  songName,
  songImageURL,
  songID,
  songArtist,
  songAlbum,
}) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/ProductDetail/`);
  };
  console.log(songArtist);
  return (
    <motion.div
      whileTap={{ scale: 0.8 }}
      initial={{ opacity: 0, translateX: -50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="flex-auto h-full w-full flex flex-col py-1 px-5 cursor-pointer hover:bg-cardOverlay"
      key={key}
      onClick={handleClick}
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
export default SearchCard;
