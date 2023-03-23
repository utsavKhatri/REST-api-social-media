import { Container, Heading, Stack } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import NormalPostCard from "./NormalPostCard";
// import NormalPostCard from "./NormalPostCard";

const ReceivePost = () => {
  const [postData, setPostData] = useState();
  const userData = JSON.parse(localStorage.getItem("user-profile"));

  const options = {
    method: "POST",
    url: "http://localhost:1337/graphql",
    headers: {
      Authorization: `Bearer ${userData.token}`,
    },
    data: {
      query:
        "query GetReceivedPost($id:ID!){\n    getReceivedPost(id:$id){\n        post{\n            id\n            caption\n            image\n        }\n        shareBy{\n            id\n            username\n            profilePic\n        }\n        sharedWith{\n            id\n            username\n            profilePic\n        }\n    }\n}",
      variables: { id: userData.id },
    },
  };
  useEffect(() => {
    axios
      .request(options)
      .then((response) => {
        if (response.status === 200) {
          setPostData(response.data.data.getReceivedPost);
        } else {
          alert("Something went wrong");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <Container>
      <Stack my={3}>
        <Heading as="h2" size="xl">
          Received shared post
        </Heading>
        <Row>
          {postData ? (
            postData.map((post, i) => (
              <Col xs={12} md={5} key={i}>
                <NormalPostCard post={post.post} />
              </Col>
            ))
          ) : (
            <h1>nothing here</h1>
          )}
        </Row>
      </Stack>
    </Container>
  );
};

export default ReceivePost;
