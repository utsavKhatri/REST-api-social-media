import React, { useEffect } from "react";
import { useQuery } from "react-apollo";
import gql from "graphql-tag";
import { Box, Center, Container, Flex, VStack } from "@chakra-ui/react";
import PostCard from "../PostCard";
import { useParams } from "react-router-dom";

const UserPosts = () => {
  let { id } = useParams();
  // const GET_POSTS = gql`
  //   query GetAllPosts($userid: ID) {
  //     getAllPosts(userid: $userid) {
  //       id
  //       caption
  //       image
  //       like {
  //         id
  //         user {
  //           id
  //           username
  //           profilePic
  //         }
  //       }
  //       comments {
  //         id
  //         text
  //         user {
  //           id
  //           username
  //           profilePic
  //         }
  //       }
  //       postBy {
  //         id
  //         username
  //         profilePic
  //         bio
  //       }
  //       save {
  //         id
  //         user {
  //           id
  //           profilePic
  //           username
  //         }
  //       }
  //       sharedWith {
  //         id
  //       }
  //     }
  //   }
  // `;
  // const { loading, error, data } = useQuery(GET_POSTS, {
  //   variables: { userid: id },
  // });


  // if (error)
  //   return (
  //     <Flex justifyContent={"center"} alignItems={"center"} w={"100%"}>
  //       <h1>something went wrong</h1>
  //     </Flex>
  //   );
  return (
    <React.Fragment>
      <Container className="py-5">
        <VStack>
          {/* {loading ? (
            <Center>...loading</Center>
          ) : (
            data.getAllPosts.map((post) => (
              <Box md={4} key={post.id + 2}>
                <PostCard key={post.id} post={post} />
              </Box>
            ))
          )} */}
          <h1>ksajdhksdh</h1>
        </VStack>
      </Container>
    </React.Fragment>
  );
};

export default UserPosts;
