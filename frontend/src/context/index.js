import { useColorMode, useDisclosure } from "@chakra-ui/react";
import axios from "axios";

import React, { createContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const MyContext = createContext();

export function MyContextProvider({ children }) {
  const { colorMode, toggleColorMode } = useColorMode();
  const [refresh, setRefresh] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState({});
  const [feedData, setFeedData] = useState();
  const userData = JSON.parse(localStorage.getItem("user-profile"));






  const reFetchData = () => {
    const options = {
      url: "http://localhost:1337/graphql",
      method: "post",
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
      data: {
        query:
          "{getAllPosts{    id    caption    image    like{        id        user{            id            username   profilePic     }    }    comments{        id        text        user{            id            username  profilePic      }    }    postBy{        id        username profilePic bio  }    save{        id        user{            id      profilePic      username        }    }    sharedWith{        id    }}}",
      },
    };
    axios
      .request(options)
      .then((response) => {
        console.log(response.data.data.getAllPosts);
        setFeedData(response.data.data.getAllPosts);
        setRefresh(!refresh);
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 401 || error.response.status === 403) {
          localStorage.removeItem("user-profile");
          localStorage.removeItem("user-token");
          return window.location.href = "/login";
        }
      });
  };



  return (
    <MyContext.Provider
      value={{
        colorMode,
        toggleColorMode,
        refresh,
        setRefresh,
        isLoggedIn,
        setIsLoggedIn,
        reFetchData,
        feedData,
      }}
    >
      {children}
    </MyContext.Provider>
  );
}
