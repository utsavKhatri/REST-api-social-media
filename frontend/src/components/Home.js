import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

import { MyContext } from "../context";

import PostCard from "./PostCard";

const Home = () => {
  const { refresh, setRefresh } = useContext(MyContext);
  const userData = JSON.parse(localStorage.getItem("user-profile"));
  const [currentpage, setCurrentpage] = useState(1);
  const [feedData, setFeedData] = useState();
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
      .catch(function (error) {
        console.error(error);
      });
  };

  useEffect(() => {
    reFetchData();
  }, [currentpage]);

  return (
    <React.Fragment>
      <Container className="py-5">
        <Row>
          {feedData !== undefined ? (
            feedData.map((post) => (
              <Col xs={12} md={4}>
                <PostCard
                  key={post.id}
                  post={post}
                  reFetchData={reFetchData}
                />
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
