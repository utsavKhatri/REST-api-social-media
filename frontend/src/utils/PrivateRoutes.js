import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { MyContext } from "../context";
import Navbar from "../components/Navbar";

const PrivateRoutes = () => {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useContext(MyContext);
  const checkUserToken = () => {
    const userToken = localStorage.getItem("user-token");
    const userData = JSON.parse(localStorage.getItem("user-profile"));

    if (!userToken || !userData) {
      setIsLoggedIn({ token: false });
      navigate("/login");
    }
    else{
      setIsLoggedIn({ token: true });
    }
  };
  // checkUserToken();

  useEffect(() => {
    checkUserToken();
  });

  // eslint-disable-next-line eqeqeq
  return isLoggedIn.token == true ? (
    <>
      <Navbar />
      <Outlet />
    </>
  ) : (
    <h1>...Loading</h1>
  );
};

export default PrivateRoutes;
