import { Container, Heading, Stack } from "@chakra-ui/react";
import { gql } from "apollo-boost";
// import axios from "axios";
import React, { useEffect } from "react";
import { useQuery } from "react-apollo";
import { Col, Row } from "react-bootstrap";
import NormalPostCard from "./NormalPostCard";

const ReceivePost = () => {
  const userData = JSON.parse(localStorage.getItem("user-profile"));

  const GET_RECEIVE_POSTS = gql`
    query GetReceivedPost($id: ID!) {
      getReceivedPost(id: $id) {
        post {
          id
          caption
          image
        }
        shareBy {
          id
          username
          profilePic
        }
        sharedWith {
          id
          username
          profilePic
        }
      }
    }
  `;

  const { loading, error, data, refetch } = useQuery(GET_RECEIVE_POSTS, {
    variables: { id: userData.id },
  });


  useEffect(() => {
    refetch();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <Stack my={3}>
        <Heading as="h2" size="xl">
          Received shared post
        </Heading>

        {error || loading ? (
          <h1>{error || "loading...."}</h1>
        ) : (
          <Row>
            {data.getReceivedPost ? (
              data.getReceivedPost.map((post, i) => (
                <Col xs={12} md={5} key={i}>
                  <NormalPostCard post={post.post} />
                </Col>
              ))
            ) : (
              <h1>nothing here</h1>
            )}
          </Row>
        )}
      </Stack>
    </Container>
  );
};

export default ReceivePost;
