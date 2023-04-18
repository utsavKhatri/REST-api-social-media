import { Box, Flex, VStack } from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import { Container } from "react-bootstrap";
import { InfinitySpin } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

import { MyContext } from "../context";

import PostCard from "./PostCard";
import LatestPostcard from "./LatestPostcard";

const Home = () => {
  const { refetch, data, loading, error } = useContext(MyContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("user-profile")) {
      refetch();
    } else {
      navigate("/login");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading)
    return (
      <Flex justifyContent={"center"} alignItems={"center"} w={"100%"}>
        <InfinitySpin width="200" color="#bddff2" />
      </Flex>
    );
  if (error)
    return (
      <Flex justifyContent={"center"} alignItems={"center"} w={"100%"}>
        <h1>something went wrong</h1>
      </Flex>
    );
  return (
    <React.Fragment>
      <Container className="py-5">
        <VStack>
          {/* <LatestPostcard/> */}
                        {/* <PostCard key={post.id} post={post} /> */}

          {data.getAllPosts.map((post) => (
            <Box md={4} key={post.id + 2}>
              <LatestPostcard key={post.id} post={post}/>
            </Box>
          ))}
        </VStack>
      </Container>
    </React.Fragment>
  );
};

export default Home;
