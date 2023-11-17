import React from "react";
import { BsEmojiFrown } from "react-icons/bs";
import { motion } from "framer-motion";
import { AiOutlineClose } from "react-icons/ai";
import { FaExclamationCircle } from "react-icons/fa";
const AlertErrorBottom = ({ msg }) => {
  return (
    <motion.div
      initial={{ x: 1000, y: 0 }}
      transition={{ duration: 0.5 }}
      animate={{ x: 0, y: 0 }}
      className="fixed right-1 bottom-20 px-10 py-2 rounded-xl"
    >
      <div className="w-440 bg-card rounded-md shadow-md backdrop-blur-md px-4 py-2 flex items-center gap-4">
        <div className="w-[4px] h-10 bg-red-500 rounded-md"></div>
        <FaExclamationCircle className="text-xl text-red-500" />
        <p className="text-base font-semibold text-black">
          {msg?.length > 50 ? `${msg?.slice(0, 50)}...` : msg}
        </p>
      </div>
    </motion.div>
  );
};

export default AlertErrorBottom;
