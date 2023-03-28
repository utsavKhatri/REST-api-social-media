import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { MyContext } from "../context";
import Navbar from "../components/Navbar";

const PrivateRoutes = () => {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useContext(MyContext);
  const checkUserToken = async () => {
    const userData = await JSON.parse(localStorage.getItem("user-profile"));

    // eslint-disable-next-line eqeqeq
    if (userData.email == "admin@gmail.com") {
      setIsLoggedIn({ token: true });
    } else {
      setIsLoggedIn({ token: false });
      navigate("/admin/login");
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
