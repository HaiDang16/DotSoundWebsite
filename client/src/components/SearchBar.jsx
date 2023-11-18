import React from "react";
import { IoSearch } from "react-icons/io5";
import { actionType } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";
import { useSelector, useDispatch } from "react-redux";

const SearchBar = () => {
  const dispatch = useDispatch();
  const searchTerm = useSelector((state) => state.customization.searchTerm);
  const setSearchTerm = (value) => {
    dispatch({
      type: actionType.SET_SEARCH_TERM,
      searchTerm: value,
    });
  };

  return (
    <div className="w-full h-16 flex items-center justify-center">
      <div className="w-full gap-4 p-2 md:w-2/3  shadow-xl rounded-md flex items-center">
        <IoSearch className="text-3xl text-white" />
        <input
          type="text"
          value={searchTerm}
          className="w-full h-full bg-transparent text-lg text-white  border-none outline-none "
          placeholder="Tìm kiếm bài hát, nghệ sĩ,..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBar;
