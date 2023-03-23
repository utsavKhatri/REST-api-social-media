import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { MyContext } from "../context";

import PostCard from "./PostCard";

const Home = () => {
  const { refresh,reFetchData, setRefresh, feedData } = useContext(MyContext);
  const userData = JSON.parse(localStorage.getItem("user-profile"));





  useEffect(() => {
    
    reFetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <Container className="py-5">
        <Row>
          {feedData !== undefined ? (
            feedData.map((post) => (
              <Col xs={12} md={4} key={post.id+2}>
                <PostCard key={post.id} post={post} reFetchData={reFetchData} />
              </Col>
            ))
          ) : (
            <div>Loading...</div>
          )}
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default Home;
