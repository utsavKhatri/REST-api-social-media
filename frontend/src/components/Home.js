import { Box, VStack } from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

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
            <div>Loading...</div>
          )}
        </VStack>
      </Container>
    </React.Fragment>
  );
};

export default Home;
