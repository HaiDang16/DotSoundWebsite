import React, { useState } from "react";
import moment from "moment";
import { motion } from "framer-motion";
import { changingUserRole, getAllUsers, removeUser } from "../api";
import { actionType } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";
import { MdDelete, MdEdit } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import {
  SET_ALL_SONGS,
  SET_SONG_PLAYING,
  SET_ARTISTS,
  SET_ALL_ARTISTS,
  SET_ALL_USERS,
} from "../store/actions";
import AlertErrorBottom from "../components/AlertErrorBottom";
import AlertSuccessBottom from "../components/AlertSuccessBottom";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const DashboardUserCard = ({ data, index }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateRole, setIsUpdateRole] = useState(false);
  const [isAlert, setIsAlert] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const allUsers = useSelector((state) => state.customization.allUsers);
  const user = useSelector((state) => state.customization.user);
  const createdAt = moment(new Date(data.createdAt)).format("DD/MM/YYYY");
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const UpdateUserRole = (userId, role) => {
    setIsLoading(true);
    setIsUpdateRole(false);
    changingUserRole(userId, role).then((res) => {
      if (res) {
        getAllUsers().then((data) => {
          dispatch({
            type: SET_ALL_USERS,
            allUsers: data.users,
          });
        });
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    });
  };

  const deleteuser = (userId) => {
    setIsLoading(true);
    removeUser(userId).then((res) => {
      console.log("removeUser res: ", res);
      if (res) {
        setIsAlert("success");
        setAlertMessage("Xoá người dùng thành công");
        setTimeout(() => {
          setIsAlert(null);
          getAllUsers().then((data) => {
            dispatch({
              type: SET_ALL_USERS,
              allUsers: data.users,
            });
          });

          setIsLoading(false);
        }, 2000);
      }
    });
  };
  const handleUpdate = () => {
    navigate(`/Admin/ManageUsers/Update?id=${data._id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="relative w-full rounded-md flex items-center justify-between py-4 bg-lightOverlay cursor-pointer hover:bg-gray-400 hover:shadow-md"
    >
      {console.log("user.user: ", user.user)}
      {console.log("user: ", user)}
      <div
        onMouseEnter={() => setDropdownVisible(true)}
        onMouseLeave={() => setDropdownVisible(false)}
        className="relative"
      >
        {user && data._id !== user._id && (
          <div className="relative">
            <div className="w-8 h-8 rounded-md flex items-center justify-center text-white text-2xl">
              ...
            </div>
            {isDropdownVisible && (
              <div className="absolute left-4 top-8 bg-white rounded-md shadow-md p-2 z-50">
                <div
                  className="h-50 flex hover:text-red-500 py-1"
                  onClick={() => deleteuser(data._id)}
                >
                  <MdDelete className="text-xl mr-2" />
                  <p>Xoá</p>
                </div>
                <div
                  className="w-28 h-50 flex hover:text-green-500 py-1"
                  onClick={handleUpdate}
                >
                  <MdEdit className="text-xl mr-2 " />
                  <p>Chỉnh sửa</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {/* {user && data._id !== user._id && (
        <motion.div
          whileTap={{ scale: 0.75 }}
          className="absolute left-4 w-8 h-8 rounded-md flex items-center justify-center bg-gray-300"
          onClick={() => deleteuser(data._id)}
        >
          <MdDelete className="text-xl text-red-400 hover:text-red-500" />
        </motion.div>
      )}
      {user && data._id !== user._id && (
        <motion.div
          whileTap={{ scale: 0.75 }}
          className="absolute left-4 w-8 h-8 rounded-md flex items-center justify-center bg-gray-300"
          onClick={() => deleteuser(data._id)}
        >
          <MdDelete className="text-xl text-red-400 hover:text-red-500" />
        </motion.div>
      )} */}
      <div className="w-275 min-w-[160px] flex items-center justify-center">
        {/* prettier-ignore */}
        <img src={data.cusAvatar} alt="" className="w-10 h-10 object-cover rounded-md min-w-[40px] shadow-md"
        />
      </div>
      {/* prettier-ignore */}
      <p className="text-base text-white w-275 min-w-[160px] text-center">{data.cusLastName} {data.cusFirstName}</p>
      {/* prettier-ignore */}
      <p className="text-base text-white w-275 min-w-[160px] text-center">{data.cusEmail}</p>
      {/* prettier-ignore */}
      <p className={`text-base ${data.emailVerified ? "text-white" : "text-red-500"}  w-275 min-w-[160px] text-center`}>{data.emailVerified ? 'Đã xác thực' : 'Chưa xác thực'}</p>
      {/* prettier-ignore */}
      <p className="text-base text-white w-275 min-w-[160px] text-center">{createdAt}</p>
      <div className=" w-275 min-w-[160px] text-center flex items-center justify-center gap-6 relative">
        <p className="text-base text-white">
          {" "}
          {user && data._id !== user._id
            ? data.cusRole === "admin"
              ? "Quản trị"
              : "Thành viên"
            : "Đang đăng nhập"}
        </p>
        {user && data._id !== user._id && (
          <motion.p
            whileTap={{ scale: 0.75 }}
            className="text-[10px]  font-semibold text-textColor px-1 bg-purple-200 rounded-sm hover:shadow-md"
            onClick={() => setIsUpdateRole(true)}
          >
            {data.cusRole === "admin"
              ? "Đặt làm thành viên"
              : "Đặt làm quản trị"}
          </motion.p>
        )}
        {isUpdateRole && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute z-10 top-6 right-4 rounded-md p-4 flex items-start flex-col gap-4 bg-white shadow-xl"
          >
            <p className="text-textColor text-sm font-semibold">
              Bạn muốn đặt phân quyền cho người dùng này là{" "}
              <span>
                {data.cusRole === "admin" ? "thành viên" : "quản trị"}
              </span>{" "}
              ?
            </p>
            <div className="flex items-center gap-4">
              <motion.button
                whileTap={{ scale: 0.75 }}
                className="outline-none border-none text-sm px-4 py-1 rounded-md bg-blue-200 text-black hover:shadow-md"
                onClick={() =>
                  UpdateUserRole(
                    data._id,
                    data.cusRole === "admin" ? "member" : "admin"
                  )
                }
              >
                Yes
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.75 }}
                className="outline-none border-none text-sm px-4 py-1 rounded-md bg-gray-200 text-black hover:shadow-md"
                onClick={() => setIsUpdateRole(false)}
              >
                No
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      {isLoading && (
        <div className="absolute inset-0 bg-card animate-pulse"></div>
      )}
      {isAlert && (
        <>
          {isAlert === "success" ? (
            <AlertSuccessBottom msg={alertMessage} />
          ) : (
            <AlertErrorBottom msg={alertMessage} />
          )}
        </>
      )}
    </motion.div>
  );
};

export default DashboardUserCard;
