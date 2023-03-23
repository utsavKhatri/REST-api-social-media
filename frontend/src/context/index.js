import { useColorMode } from "@chakra-ui/react";
import axios from "axios";

import React, { createContext, useState } from "react";

export const MyContext = createContext();

export function MyContextProvider({ children }) {
  const { colorMode, toggleColorMode } = useColorMode();
  const [refresh, setRefresh] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState({});
  const [feedData, setFeedData] = useState();
  const userData = JSON.parse(localStorage.getItem("user-profile"));

  const options = {
    url: "http://localhost:1337/graphql",
    method: "post",
    headers: {
      Authorization: `Bearer ${userData.token}`,
    },
    data: {
      query:
        "{getAllPosts{    id    caption    image    like{        id        user{            id            username   profilePic     }    }    comments{        id        text        user{            id            username  profilePic      }    }    postBy{        id        username profilePic   }    save{        id        user{            id      profilePic      username        }    }    sharedWith{        id    }}}",
    },
  };
    const reFetchData = () => {
    axios
      .request(options)
      .then((response) => {
        console.log(response.data.data.getAllPosts);
        setFeedData(response.data.data.getAllPosts);
        setRefresh(!refresh);
      })
      .catch((error)=>{
      console.log(error); 
        if (error.response.status === 401) {
          localStorage.removeItem("user-profile");
          localStorage.removeItem("user-token");
          window.location.href = "/login";
        }
      });
  };

  return (
    <MyContext.Provider
      value={{
        colorMode,
        toggleColorMode,
        refresh,
        setRefresh,isLoggedIn, setIsLoggedIn, reFetchData, feedData
      }}
    >
      {children}
    </MyContext.Provider>
  );
}
