import { Box, Flex, VStack } from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import { Container } from "react-bootstrap";
import { InfinitySpin } from "react-loader-spinner";

import { MyContext } from "../context";

import PostCard from "./PostCard";

const Home = () => {
  const { reFetchData, feedData } = useContext(MyContext);

  useEffect(() => {
    reFetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <Container className="py-5">
        <VStack>
          {feedData !== undefined ? (
            feedData.map((post) => (
              <Box md={4} key={post.id + 2}>
                <PostCard key={post.id} post={post} reFetchData={reFetchData} />
              </Box>
            ))
          ) : (
            <Flex justifyContent={"center"} alignItems={"center"} w={"100%"}>
              <InfinitySpin width="200" color="#bddff2" />
            </Flex>
          )}
        </VStack>
      </Container>
    </React.Fragment>
  );
};

export default Home;
