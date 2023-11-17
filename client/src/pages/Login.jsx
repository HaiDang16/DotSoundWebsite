import AlertError from "../../components/shared/AlertError";
import AlertSuccess from "../../components/shared/AlertSuccess";
import { BsApp, BsCheckSquare } from "react-icons/bs";
import logoGoogle from "../../assets/img/logoGoogle.png";
import logoGu from "../../assets/img/logoGu.png";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// Đăng nhập bằng google
import { app } from "../../config/firebase.config";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import React, { useEffect } from "react";
import { useStateValue } from "../../context/StateProvider";
import { actionType } from "../../context/reducer";
import { validateUser } from "../../api";
import { LoginBg } from "../../assets/video";
import { IoSearch, IoCartOutline } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { SET_USER, SET_AUTH } from "../../store/actions";
import BackgroundLogin from "../../assets/img/background_Login.jpg";
const Login = () => {
  const firebaseAuth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const [isBsApp, setIsBsApp] = useState(true);

  const handleIconClick = () => {
    setIsBsApp(!isBsApp);
  };

  const handleForgotPass = () => {
    navigate("/ForgotPassword");
  };

  const loginWithGoogle = async () => {
    await signInWithPopup(firebaseAuth, provider).then((userCred) => {
      if (userCred) {
        dispatch({
          type: SET_AUTH,
          auth: true,
        });
        window.localStorage.setItem("auth", "true");

        firebaseAuth.onAuthStateChanged((userCred) => {
          if (userCred) {
            userCred.getIdToken().then((token) => {
              window.localStorage.setItem("auth", "true");
              validateUser(token).then((data) => {
                dispatch({
                  type: SET_USER,
                  user: data,
                });
                console.log(data);
                window.localStorage.setItem("userData", JSON.stringify(data));
              });
            });
            navigate("/", { replace: true });
          } else {
            dispatch({
              type: SET_AUTH,
              auth: false,
            });
            dispatch({
              type: SET_USER,
              user: null,
            });
            navigate("/Login");
          }
        });
      }
    });
  };

  // Khúc này của Đăng nhập chay
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ email: "", password: "" });
  const [accountValid, setAccoutValid] = useState("");

  async function submit(e) {
    e.preventDefault();

    if (!email || !password) {
      // alert("Tên đăng nhập và mật khẩu không được để trống");
      setError({
        email: "Email không được để trống",
        password: "Mật khẩu không được để trống",
      });
    } else {
      try {
        const response = await axios.post(
          "http://localhost:4000/api/users/Login",
          {
            email,
            password,
          }
        );
        if (response.data.message === "Account exist") {
          navigate("/");
          console.log(response.data.user);
          dispatch({
            type: SET_AUTH,
            auth: true,
          });
          window.localStorage.setItem("auth", "true");
          dispatch({
            type: SET_USER,
            user: response.data,
          });
          window.localStorage.setItem(
            "userData",
            JSON.stringify(response.data)
          );
        } else if (response.data.message === "Invalid account") {
          setAccoutValid("Email hoặc mật khẩu không đúng");
        }
      } catch (error) {
        console.error("Lỗi xảy ra: ", error);
        alert("Có lỗi xảy ra khi thực hiện đăng nhập. Vui lòng thử lại sau.");
      }
    }
  }
  return (
    <div
      style={{ backgroundImage: `url(${BackgroundLogin})` }}
      className="w-full h-auto mt-20 flex flex-col justify-center items-center rounded-lg shadow-md md:p-10 bg-center bg-cover bg-size font-sans relative"
    >
      {" "}
      <section className="px-5 lg:px-0 max-w-[570px]">
        <div className="flex justify-center mb-4">
          <img className="h-30 w-20" src={logoGu} alt="" />
        </div>
        <div className="text-white text-center mt-2 mb-6 text-[15px]">
          <p>
            <span className="ml-2">
              Nhận voucher giảm giá và quà tặng độc quyền từ các thương hiệu làm
              đẹp, thời trang và phong cách sống
            </span>
            .
          </p>
          <p>Gợi ý bài viết và sản phẩm dựa trên sở thích của bạn</p>
        </div>
        <h1 className=" text-[30px] leading-9 font-bold mb-8 font-sans mx-auto text-white text-center">
          Đăng Nhập
        </h1>

        <form className="py-4 md:py-0  ">
          <div className="my-3">
            <label className="text-lg font-bold text-white">Email:</label>
          </div>
          <div className="mb-5">
            <input
              className="w-full px-4 py-3 border-b border-solid border-[#9BA4B5] focus:outline-none focus:border-blue-900 text[16px] 
                    leading-7 placeholder:text-zinc-600  rounded-md cursor-text bg-slate-200 "
              type="email"
              placeholder="Địa chỉ email"
              name="email"
              //  value={formData.email}
              // onChange={handleInputChange}
              onChange={(e) => {
                setEmail(e.target.value);
                setError({ ...error, email: "" }); // Xóa thông báo lỗi khi người dùng thay đổi dữ liệu
              }}
            />
          </div>

          <div className="mt-8">
            <div className="my-3">
              <label className="text-lg font-bold text-white">Mật khẩu:</label>
            </div>
            <input
              className="w-full px-4 py-3 border-b border-solid border-[#9BA4B5] focus:outline-none focus:border-blue-900 text[16px] 
                    leading-7 placeholder:text-zinc-600  rounded-md cursor-text  bg-slate-200"
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu"
              name="password"
              // value={formData.email}
              // onChange={handleInputChange}
              onChange={(e) => {
                setPassword(e.target.value);
                setError({ ...error, password: "" }); // Xóa thông báo lỗi khi người dùng thay đổi dữ liệu
              }}
            />
            <svg
              onClick={() => setShowPassword(!showPassword)}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5 text-gray-500"
            ></svg>
          </div>
          {accountValid && <AlertError msg={accountValid} />}
          {/* {accountValid && (
            <div className="mb-5 text-red-500 italic text-lg text-center w-full font-semibold">
              {accountValid}
            </div>
          )} */}
          <div className="text-white mt-5 ml-4 flex items-center">
            {isBsApp ? (
              <BsApp onClick={handleIconClick} />
            ) : (
              <BsCheckSquare
                onClick={handleIconClick}
                style={{ color: "white" }}
              />
            )}
            <p className="ml-2">Nhớ mật khẩu</p>
            <button
              className="border-b-2 border-b-red-600 ml-[270px]"
              onClick={handleForgotPass}
            >
              Quên mật khẩu ?
            </button>
          </div>
          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-white text-black text-[18px] leading-[30px] rounded-lg px-4 py-3 font-bold hover:bg-cardOverlay/80"
              onClick={submit}
            >
              Đăng Nhập
            </button>

            <div class="flex items-center justify-between mt-5">
              <div class="border-t-2 border-white flex-1 mt-2"></div>
              <div class="text-lg text-white mx-5">Hoặc</div>
              <div class="border-t-2 border-white flex-1 mt-2"></div>
            </div>
            <div className="mt-8 flex items-center relative">
              <div
                className="flex w-full items-center justify-center gap-2 px-4 py-2 rounded-md bg-cardOverlay 
          cursor-pointer hover:bg-card hover:shadow-md duration-100 ease-in-out transition-all"
                onClick={loginWithGoogle}
              >
                <FcGoogle className="text-xl" />
                Tiếp tục với Google
              </div>
            </div>
            <div className="flex items-center justify-center">
              <p className="mt-11 text-white text-[15px]">Bạn chưa đăng ký ?</p>
              <Link
                to={"/Register"}
                className="mt-11 text-white text-[15px] border-b-2 border-b-red-600 ml-2"
              >
                Tạo tài khoản
              </Link>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};
export default Login;
