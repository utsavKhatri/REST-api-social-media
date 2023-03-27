import { useColorMode,  } from "@chakra-ui/react";
import React, { createContext,  useState } from "react";
import gql from "graphql-tag";
import { useQuery } from "react-apollo";
export const MyContext = createContext();

export function MyContextProvider({ children }) {
  const { colorMode, toggleColorMode } = useColorMode();
  const [refresh, setRefresh] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState({});




  const GET_POSTS = gql`
    {
      getAllPosts {
        id
        caption
        image
        like {
          id
          user {
            id
            username
            profilePic
          }
        }
        comments {
          id
          text
          user {
            id
            username
            profilePic
          }
        }
        postBy {
          id
          username
          profilePic
          bio
        }
        save {
          id
          user {
            id
            profilePic
            username
          }
        }
        sharedWith {
          id
        }
      }
    }
  `;

  const { loading, error, data, refetch } = useQuery(GET_POSTS);


  return (
    <MyContext.Provider
      value={{
        colorMode,
        toggleColorMode,
        refresh,
        setRefresh,
        isLoggedIn,
        setIsLoggedIn,
        GET_POSTS,
        data,
        refetch,
        loading,
        error,
      }}
    >
      {children}
    </MyContext.Provider>
  );
}
