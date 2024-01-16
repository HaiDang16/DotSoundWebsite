import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAllCategories, createCategory, updateCategory } from "../api";
import { MdEdit } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { SET_ALL_CATEGORIES } from "../store/actions";
import { IoAdd } from "react-icons/io5";
import { AiOutlineClear } from "react-icons/ai";
import { LogoDotSounds } from "../assets/img";
import AlertErrorBottom from "../components/AlertErrorBottom";
import AlertSuccessBottom from "../components/AlertSuccessBottom";

const DashboardAlbum = () => {
  const dispatch = useDispatch();
  const allCategories = useSelector(
    (state) => state.customization.allCategories
  );
  const [isFocus, setIsFocus] = useState(false);
  const [albumFilter, setAlbumFilter] = useState("");
  const [filteredAlbums, setFilteredAlbums] = useState(null);
  const [isAdd, setIsAdd] = useState(false);
  const [catName, setCatName] = useState("");
  const [isAlert, setIsAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);

  useEffect(() => {
    if (!allCategories) {
      getAllCategories().then((res) => {
        console.log("getAllCategories res: ", res);
        dispatch({ type: SET_ALL_CATEGORIES, allCategories: res.categories });
      });
    }
  }, []);

  useEffect(() => {
    if (albumFilter.length > 0) {
      const filtered = allCategories.filter((data) =>
        data.catName.toLowerCase().includes(albumFilter.toLowerCase())
      );
      console.log("filtered: ", filtered);
      setFilteredAlbums(filtered);
    } else {
      setFilteredAlbums(null);
    }
  }, [albumFilter]);

  const handleCreateCategory = async () => {
    if (!catName) {
      setIsAlert("error");
      setAlertMsg("Required fields are missing");
      setTimeout(() => {
        setIsAlert(null);
      }, 2000);
    } else {
      const data = { catName: catName };
      createCategory(data).then((res) => {
        if (res.status === 201) {
          setIsAlert("success");
          setAlertMsg(res.data.message);
          setTimeout(() => {
            setIsAlert(null);
            getAllCategories().then((res) => {
              dispatch({
                type: SET_ALL_CATEGORIES,
                allCategories: res.categories,
              });
            });
            setIsAdd(!isAdd);
          }, 1500);
        } else {
          setIsAlert("error");
          setAlertMsg(res.data.message);
          setTimeout(() => {
            setIsAlert(null);
          }, 2000);
        }
      });
    }
  };

  return (
    <div className="w-full p-4 flex items-center justify-center flex-col">
      <div className="w-full flex justify-center items-center gap-24">
        <div
          onClick={() => setIsAdd(!isAdd)}
          className="flex items-center text-white px-4 py-3 border rounded-md border-gray-300 hover:border-gray-400 hover:shadow-md cursor-pointer"
        >
          <IoAdd />
          <div className="px-2">Thêm thể loại</div>
        </div>
        <input
          type="text"
          placeholder="Nhập từ khoá cần tìm kiếm"
          className={` w-64 px-4 py-3 border ${
            isFocus ? "border-gray-500 shadow-md" : "border-gray-300"
          } rounded-md bg-transparent outline-none duration-150 transition-all ease-in-out text-base text-white font-semibold`}
          value={albumFilter}
          onChange={(e) => setAlbumFilter(e.target.value)}
          onBlur={() => setIsFocus(false)}
          onFocus={() => setIsFocus(true)}
        />

        {albumFilter && (
          <motion.i
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileTap={{ scale: 0.75 }}
            onClick={() => {
              setAlbumFilter("");
              setFilteredAlbums(null);
            }}
          >
            <AiOutlineClear className="text-3xl text-white cursor-pointer" />
          </motion.i>
        )}
      </div>
      <div className="relative w-full  my-4 p-4 py-12 border border-gray-300">
        <div className="absolute top-4 left-4">
          <p className="text-lg font-bold text-white">
            <span className="text-lg font-semibold text-white">
              Tổng thể loại:{" "}
            </span>
            {filteredAlbums ? filteredAlbums?.length : allCategories?.length}
          </p>
        </div>

        {allCategories && (
          <CategoryContainer
            data={filteredAlbums ? filteredAlbums : allCategories}
          />
        )}
      </div>
      {isAdd && (
        <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-1/3 p-6 rounded-lg flex flex-col items-center">
            <h2 className="text-2xl mb-4 text-center">TẠO THỂ LOẠI</h2>
            <div className="h-2/3 overflow-y-scroll scrollbar flex flex-wrap items-center px-20">
              <label className="font-normal tracking-wide">
                Nhập thể loại mới:
              </label>
              <div className="w-full lg:w-300 p-3 flex items-center rounded-md shadow-sm border border-gray-400 mt-3">
                <input
                  type="text"
                  placeholder="Nhập tên thể loại"
                  className="w-full text-base font-semibold text-black outline-none bg-transparent"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                />
              </div>
            </div>
            <div className="flex mt-5 w-2/3">
              <button
                onClick={handleCreateCategory}
                className="bg_website_02 text-white font-bold py-2 px-4 rounded mt-4 mr-10 w-full"
              >
                Tạo
              </button>{" "}
              <button
                onClick={() => setIsAdd(!isAdd)}
                className="bg-gray-500 text-white font-bold py-2 px-4 rounded mt-4 w-full"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {isAlert && (
        <>
          {isAlert === "success" ? (
            <AlertSuccessBottom msg={alertMsg} />
          ) : (
            <AlertErrorBottom msg={alertMsg} />
          )}
        </>
      )}
    </div>
  );
};
export const CategoryContainer = ({ data }) => {
  return (
    <div className=" w-full flex flex-wrap gap-10 items-center justify-evenly mt-5">
      {data.map((data, index) => (
        <CategoryCard key={index} data={data} index={index} />
      ))}
    </div>
  );
};

export const CategoryCard = ({ data, index }) => {
  const [isAlert, setIsAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [catName, setCatName] = useState(data.catName);
  const dispatch = useDispatch();

  const handleUpdateCategory = async () => {
    if (!catName) {
      setIsAlert("error");
      setAlertMsg("Vui lòng nhập tên thể loại");
      setTimeout(() => {
        setIsAlert(null);
      }, 2000);
    } else {
      const dataReq = { catName: catName, catID: data._id };
      updateCategory(dataReq).then((res) => {
        console.log("updateCategory res: ", res);
        if (res.status === 200) {
          setIsAlert("success");
          setAlertMsg(res.data.message);
          setTimeout(() => {
            setIsAlert(null);
            getAllCategories().then((res) => {
              dispatch({
                type: SET_ALL_CATEGORIES,
                allCategories: res.categories,
              });
            });
            setIsUpdate(!isUpdate);
          }, 1500);
        } else {
          setIsAlert("error");
          setAlertMsg(res.data.message);
          setTimeout(() => {
            setIsAlert(null);
          }, 2000);
        }
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, translateX: -50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="relative  overflow-hidden w-44 min-w-180 px-2 py-4 gap-3 cursor-pointer hover:shadow-xl hover:bg-card bg-gray-100 shadow-md rounded-lg flex flex-col items-center"
    >
      <div className="w-full h-40 bg_website_02 opacity-90">
        <img src={LogoDotSounds} className="w-full h-full rounded-xl " alt="" />
      </div>

      <p className="w-full overflow-hidden font-semibold text-base text-textColor text-center whitespace-nowrap overflow-ellipsis mb-2">
        {data.catName}
      </p>

      <motion.i
        className="absolute bottom-2 right-2"
        whileTap={{ scale: 0.75 }}
        onClick={() => setIsUpdate(!isUpdate)}
      >
        <MdEdit className=" text-gray-400 hover:text-green-400 text-xl cursor-pointer" />
      </motion.i>
      {isUpdate && (
        <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-1/3 p-6 rounded-lg flex flex-col items-center">
            <h2 className="text-2xl mb-4 text-center">TẠO THỂ LOẠI</h2>
            <div className="h-2/3 overflow-y-scroll scrollbar flex flex-wrap items-center">
              <div className="w-full lg:w-300 p-3 flex items-center rounded-md shadow-sm border border-gray-300 mt-3">
                <input
                  type="text"
                  placeholder="Tên thể loại"
                  className="w-full text-base font-semibold text-black outline-none bg-transparent"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                />
              </div>
            </div>
            <div className="flex mt-5">
              <button
                onClick={handleUpdateCategory}
                className="bg_website_02 text-white font-bold py-2 px-4 rounded mt-4 mr-10"
              >
                Cập nhật
              </button>{" "}
              <button
                onClick={() => setIsUpdate(!isUpdate)}
                className="bg-gray-500 text-white font-bold py-2 px-4 rounded mt-4"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
      {isAlert && (
        <div className="z-10">
          {isAlert === "success" ? (
            <AlertSuccessBottom msg={alertMsg} />
          ) : (
            <AlertErrorBottom msg={alertMsg} />
          )}
        </div>
      )}
    </motion.div>
  );
};

export default DashboardAlbum;
