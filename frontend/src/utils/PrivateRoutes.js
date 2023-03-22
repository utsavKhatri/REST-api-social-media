import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { MyContext } from "../context";
import Navbar from "../components/Navbar";

const PrivateRoutes = () => {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useContext(MyContext);
  const userData = JSON.parse(localStorage.getItem("user-profile"));

  const checkUserToken = () => {
    const userToken = localStorage.getItem("user-token");
    if (!userToken && !userData) {
      setIsLoggedIn({ token: false });
      navigate("/login");
    }
  };
  // checkUserToken();

  useEffect(() => {
    checkUserToken();
  });

  // eslint-disable-next-line eqeqeq
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default PrivateRoutes;
