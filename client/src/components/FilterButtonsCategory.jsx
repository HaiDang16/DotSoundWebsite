import React, { useEffect, useState } from "react";
import { IoChevronDown } from "react-icons/io5";

import { motion } from "framer-motion";
import { useStateValue } from "../context/StateProvider";
import { actionType } from "../context/reducer";
import { useSelector, useDispatch } from "react-redux";
import { SET_CATEGORY_FILTER } from "../store/actions";

const FilterButtonsCategory = ({ filterData, flag, filterInit }) => {
  const [filterName, setFilterName] = useState(null);
  const [filterMenu, setFilterMenu] = useState(false);
  const dispatch = useDispatch();

  const updateFilterButton = (name, id) => {
    setFilterName(name);
    setFilterMenu(false);
    console.log("catid: ", id);
    dispatch({ type: SET_CATEGORY_FILTER, categoryFilter: id });
  };

  useEffect(() => {
    if (filterInit && filterData) {
      const initialArtist = filterData.find((data) => data._id === filterInit);
      if (initialArtist) {
        setFilterName(initialArtist.catName);
      }
    }
  }, [filterInit, filterData]);

  return (
    <div
      className="border border-gray-300 rounded-md px-4 py-1 relative cursor-pointer hover:border-gray-400"
      onClick={() => setFilterMenu(!filterMenu)}
    >
      <p className="text-base tracking-wide text-white flex items-center gap-2 ">
        {!filterName && flag}
        {filterName && (
          <>
            {filterName.length > 15
              ? `${filterName.slice(0, 14)}...`
              : filterName}
          </>
        )}
        <IoChevronDown
          className={`text-base text-textColor duration-150 transition-all ease-in-out ${
            filterMenu ? "rotate-180" : "rotate-0"
          }`}
        />
      </p>
      {filterData && filterMenu && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="w-48 z-50 backdrop-blur-sm max-h-44 overflow-y-scroll scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-400 py-2 flex flex-col rounded-md shadow-md absolute top-8 left-0"
        >
          {filterData?.map((data) => (
            <div
              key={data.catName}
              className="flex items-center gap-2 px-4 py-1 hover:bg-gray-200"
              onClick={() => updateFilterButton(data.catName, data._id)}
            >
              <p className="w-full">
                {data.catName.length > 15
                  ? `${data.catName.slice(0, 14)}...`
                  : data.catName}
              </p>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default FilterButtonsCategory;
