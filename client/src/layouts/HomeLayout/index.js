import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Header, Footer, Loader, MusicPlayer } from "../../components";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
const UserLayout = () => {
  const [isLoading, setIsLoading] = useState(true); // Ban đầu đặt isLoading là true để hiển thị ProductList_Loading
  const isSongPlaying = useSelector(
    (state) => state.customization.isSongPlaying
  );

  useEffect(() => {
    // Thực hiện các tác vụ để lấy dữ liệu cho Outlet ở đây
    // Khi dữ liệu đã được lấy xong, setIsLoading(false) để chuyển sang hiển thị Outlet
    // Đây chỉ là một ví dụ, bạn cần thay thế phần này bằng logic thực tế của bạn
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <>
      <Header />

      <div className="h-auto flex items-center justify-center min-w-[680px]">
        {isLoading ? <Loader /> : <Outlet />}
        
      </div>

      <Footer />
    </>
  );
};

export default UserLayout;
