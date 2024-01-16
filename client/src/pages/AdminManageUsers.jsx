import React, { useEffect, useState } from "react";
import { AiOutlineClear } from "react-icons/ai";
import { motion } from "framer-motion";
import { getAllUsers } from "../api"; 
import DashboardUserCard from "./DashboardUserCard";
import { useSelector, useDispatch } from "react-redux";
import { IoAdd,   } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { 
  SET_ALL_USERS,
} from "../store/actions";

const DashboardUser = () => {
  const dispatch = useDispatch();
  const [emailFilter, setEmailFilter] = useState("");
  const [isFocus, setIsFocus] = useState(false);

  const [filtereUsers, setFiltereUsers] = useState(null);
  const allUsers = useSelector((state) => state.customization.allUsers);

  useEffect(() => {
    if (!allUsers) {
      getAllUsers().then((data) => { 
        dispatch({
          type: SET_ALL_USERS,
          allUsers: data.users,
        });
      });
    }
  }, []);

  useEffect(() => {
    if (emailFilter) {
      const filtered = allUsers.filter(
        (data) =>
          data.cusEmail.includes(emailFilter) ||
          data.cusFirstName.includes(emailFilter) ||
          data.cusLastName.includes(emailFilter) ||
          (data.cusLastName + " " + data.cusFirstName).includes(emailFilter)
      );
      setFiltereUsers(filtered);
    }
  }, [emailFilter]);

  return (
    <div className="w-full p-4 flex items-center justify-center flex-col">
      <div className="w-full flex justify-center items-center gap-24">
        <NavLink
          to={"/Admin/ManageUsers/Add"}
          className="flex items-center px-4 py-3 border rounded-md border-gray-300 hover:border-gray-400 hover:shadow-md cursor-pointer"
        >
          <IoAdd />
        </NavLink>
        <input
          type="text"
          placeholder="Search here"
          className={`w-52 px-4 py-2 border ${
            isFocus ? "border-gray-500 shadow-md" : "border-gray-300"
          } rounded-md bg-transparent outline-none duration-150 transition-all ease-in-out text-base text-white font-semibold`}
          value={emailFilter}
          onChange={(e) => setEmailFilter(e.target.value)}
          onBlur={() => setIsFocus(false)}
          onFocus={() => setIsFocus(true)}
        />

        {emailFilter && (
          <motion.i
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileTap={{ scale: 0.75 }}
            onClick={() => {
              setEmailFilter("");
              setFiltereUsers(null);
            }}
          >
            <AiOutlineClear className="text-3xl text-white cursor-pointer" />
          </motion.i>
        )}
      </div>

      <div className="relative w-full py-12 min-h-[400px] overflow-x-scroll scrollbar-thin scrollbar-track-slate-300 scrollbar-thumb-slate-400 my-4 flex flex-col items-center justify-start p-4 border border-gray-300 rounded-md gap-3">
        <div className="absolute top-4 left-4">
          <p className="text-lg font-bold text-white">
            <span className="text-lg font-semibold text-white">
              Tổng người dùng:{" "}
            </span>
            {filtereUsers ? filtereUsers?.length : allUsers?.length}
          </p>
        </div>

        <div className="w-full min-w-[750px] flex items-center justify-between mt-5">
          {/* prettier-ignore */}
          <p className="text-sm text-white font-semibold w-275 min-w-[160px] text-center">Hình đại diện</p>
          {/* prettier-ignore */}
          <p className="text-sm text-white font-semibold w-275 min-w-[160px] text-center">Họ và tên</p>
          {/* prettier-ignore */}
          <p className="text-sm text-white font-semibold w-275 min-w-[160px] text-center">Email</p>
          {/* prettier-ignore */}
          <p className="text-sm text-white font-semibold w-275 min-w-[160px] text-center">Xác thực email</p>
          {/* prettier-ignore */}
          <p className="text-sm text-white font-semibold w-275 min-w-[160px] text-center">Ngày tạo</p>
          {/* prettier-ignore */}
          <p className="text-sm text-white font-semibold w-275 min-w-[160px] text-center">Phân quyền</p>{" "}
        </div>
        {allUsers && !filtereUsers
          ? allUsers?.map((data, i) => (
              <DashboardUserCard data={data} key={data._id} index={i} />
            ))
          : filtereUsers?.map((data, i) => (
              <DashboardUserCard data={data} key={data._id} index={i} />
            ))}
      </div>
    </div>
  );
};

export default DashboardUser;
