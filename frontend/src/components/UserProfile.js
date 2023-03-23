import {
  Heading,
  Avatar,
  Box,
  Center,
  Image,
  Flex,
  Text,
  Stack,
  Button,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import {  useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";


const UserProfile = () => {
  const userData = JSON.parse(localStorage.getItem("user-profile"));
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [extras, setExtras] = useState(false);
  const options = {
    method: "POST",
    url: "http://localhost:1337/graphql",
    headers: {
      Authorization: `Bearer ${userData.token}`,
    },
    data: {
      query: 'query GetUser($id: ID!) {   getUser(id:$id){       id       username       email       profilePic       posts{           id           caption           image       }       following{           id           username           profilePic           email       }       followers{           id           username           profilePic           email       }       comments{           id           text           post{               id               caption               image           }       }       likes{           id           post{               id               caption               image           }       }   }\n}\n',
      variables: { id: userData.id }
    },
  };

  useEffect(() => {
    setTimeout(() => {
      axios
        .request(options)
        .then((response) => {
          console.log(response.data.data.getUser);
          setProfile(response.data.data.getUser);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
        });
    }, 500);
  }, []);

  return (
    <>
      <Center py={6}>
        {loading === false ? (
          <VStack direction={"row"}>
            <Box
              maxW={"270px"}
              w={"full"}
              // bg={"white", "gray.800")}
              boxShadow={"2xl"}
              rounded={"md"}
              overflow={"hidden"}
            >
              <Image
                h={"120px"}
                w={"full"}
                src={"https://source.unsplash.com/random"}
                objectFit={"cover"}
              />
              <Flex justify={"center"} mt={-12}>
                <Avatar
                  size={"xl"}
                  src={profile.profilePic}
                  alt={"Author"}
                  css={{
                    border: "2px solid white",
                  }}
                />
              </Flex>

              <Box p={6}>
                <Stack spacing={0} align={"center"} mb={5}>
                  <Heading
                    fontSize={"2xl"}
                    fontWeight={500}
                    fontFamily={"body"}
                  >
                    {profile.username}
                  </Heading>
                  <Text color={"gray.500"}>{profile.email}</Text>
                </Stack>

                <Stack direction={"row"} justify={"center"} spacing={6}>
                  <Stack spacing={0} align={"center"}>
                    <Text fontWeight={600}>{profile.following.length}</Text>
                    <Text fontSize={"sm"} color={"gray.500"}>
                      Follwing
                    </Text>
                  </Stack>
                  <Stack spacing={0} align={"center"}>
                    <Text fontWeight={600}>{profile.followers.length}</Text>
                    <Text fontSize={"sm"} color={"gray.500"}>
                      Followers
                    </Text>
                  </Stack>
                </Stack>

                <Button
                  w={"full"}
                  mt={8}
                  bg={"blue.400"}
                  color={"white"}
                  rounded={"md"}
                  onClick={() => setExtras(!extras)}
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "lg",
                  }}
                >
                  Extra data
                </Button>

              </Box>
            </Box>
            <Box>
              {extras === true && (
                <Container>
                  <Col>
                    <h1>My Posts</h1>
                    <Row>
                      {profile.posts.length > 0 &&
                        profile.posts.map((post) => (
                          <Col xs={12} md={4}>
                            <Card>
                              <h3>
                                {post.caption}
                              </h3>
                              <Image src={post.image} />
                            </Card>
                          </Col>
                        ))}
                    </Row>
                    <h1>My comments</h1>
                    <Row>
                      {profile.comments.length > 0 &&
                        profile.comments.map((comment) => (
                          <Col xs={12} md={4}>
                            <h1>
                            {comment.text}
                            </h1>
                            <small>comment on {comment.post.caption}</small>
                          </Col>
                        ))}
                    </Row>
                  </Col>
                </Container>
              )}
            </Box>
          </VStack>
        ) : (
          <div>Loading...</div>
        )}
      </Center>
    </>
  );
};
export default UserProfile;
