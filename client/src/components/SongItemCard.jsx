import { useNavigate } from "react-router-dom";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

import { motion } from "framer-motion";
const SongItemCard = ({
  id,
  songName,
  songArtist,
  songLanguage,
  songCategory,
  onSelect,
}) => {
  const stars = [];
  const navigate = useNavigate();
  const handleClick = () => {
    onSelect({
      //catName,
      // proName,
      // proPrice,
      // proQuantity,
      // proDescription,
      // proMaterial,
      // proRate,
      // proUpdateDate,
      // proStatus,
      // catID,
      id,
      songName,
      songArtist,
      songLanguage,
      songCategory,
    });
  };

  return (
    <div
      className=" w-40 h-auto border border-gray-400 bg-white rounded-lg"
      key={id}
      onClick={handleClick}
    >
      <div className="w-auto h-auto flex-col relative flex items-center">
        <img className="w-1/2 h-1/2" src={null} alt={"img"} />
      </div>
      <div className="w-full h-auto py-3 border-t border-gray-400 ">
        <p className=" text-black text-10 p-3 font-semibold">{songName}</p>

        <div className="flex p-2 items-center"></div>
      </div>
    </div>
  );
};

export default SongItemCard;
