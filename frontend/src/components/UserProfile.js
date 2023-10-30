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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Divider,
  Card,
  CardBody,
  StackDivider,
  CardHeader,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { CiShare1 } from "react-icons/ci";
import { toast, Toaster } from "react-hot-toast";
import NormalPostCard from "./NormalPostCard";
import { InfinitySpin } from "react-loader-spinner";
import { useQuery } from "react-apollo";
import { gql } from "apollo-boost";

const UserProfile = () => {
  const userData = JSON.parse(localStorage.getItem("user-profile"));
  const [extras, setExtras] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [file, setFile] = useState(null);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  const GET_USER = gql`
    query GetUser($id: ID!) {
      getUser(id: $id) {
        id
        username
        email
        bio
        profilePic
        posts {
          id
          caption
          image
        }
        following {
          id
          username
          profilePic
          email
        }
        followers {
          id
          username
          profilePic
          email
        }
        comments {
          id
          text
          post {
            id
            caption
            image
          }
        }
        likes {
          id
          post {
            id
            caption
            image
          }
        }
        savedposts {
          id
          post {
            id
            caption
            image
          }
        }
      }
    }
  `;

  const { loading, error, data, refetch } = useQuery(GET_USER, {
    variables: { id: userData.id },
  });

  // const options = {
  //   method: "POST",
  //   url: "http://localhost:1337/graphql",
  //   headers: {
  //     Authorization: `Bearer ${userData.token}`,
  //   },
  //   data: {
  //     query:
  //       "query GetUser($id: ID!) {   getUser(id:$id){       id       username       email  bio  profilePic       posts{           id           caption           image       }       following{           id           username           profilePic           email       }       followers{           id           username           profilePic           email       }       comments{           id           text           post{               id               caption               image         }       }       likes{   id    post{  id   caption   image }     }      savedposts{ id  post{   id     caption     image } }   }\n}\n",
  //     variables: { id: userData.id },
  //   },
  // };

  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${userData.token}`);

    if (file === null) {
      formData.append("username", name);
      formData.append("bio", bio);
    } else {
      formData.append("username", name);
      formData.append("bio", bio);
      formData.append("postpic", file);
    }

    fetch("http://localhost:1337/profile", {
      method: "POST",
      body: formData,
      headers: headers,
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("Success:", data);
        refetch();
        navigate("/profile");
        onClose();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleFollow = (id) => {
    const followOption = {
      method: "POST",
      url: `http://localhost:1337/user/follow/${id}`,
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    };

    axios
      .request(followOption)
      .then((response) => {
        // console.log(response.data);
        if (response.status === 200) {
          toast.success("You are now following this user");
          refetch();
        } else {
          toast.error("something went wrong");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleOpenUpdate = () => {
    setBio(data.getUser.bio);
    setName(data.getUser.username);
    onOpen();
  };

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Toaster />
      <Center py={6}>
        {error && (
          <Box>
            <Text>{error.message}</Text>
          </Box>
        )}
        {!loading ? (
          <VStack direction={"row"}>
            <Box
              maxW={"270px"}
              w={"full"}
              // eslint-disable-next-line react-hooks/rules-of-hooks
              bg={useColorModeValue("white.100", "gray.900")}
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
                  src={data.getUser.profilePic}
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
                    {data.getUser.username}
                  </Heading>
                  <Text color={"gray.500"}>{data.getUser.email}</Text>
                  <Divider
                    style={{
                      marginBlock: "10px",
                    }}
                  />
                  {data.getUser.bio && (
                    <Text color={"gray.500"} textAlign={"center"}>
                      {data.getUser.bio}
                    </Text>
                  )}
                </Stack>

                <Stack direction={"row"} justify={"center"} spacing={6}>
                  <Stack spacing={0} align={"center"}>
                    <Text fontWeight={600}>
                      {data.getUser.following.length}
                    </Text>
                    <Text fontSize={"sm"} color={"gray.500"}>
                      Follwing
                    </Text>
                  </Stack>
                  <Stack spacing={0} align={"center"}>
                    <Text fontWeight={600}>
                      {data.getUser.followers.length}
                    </Text>
                    <Text fontSize={"sm"} color={"gray.500"}>
                      Followers
                    </Text>
                  </Stack>
                  <Stack spacing={0} align={"center"}>
                    <Text fontWeight={600}>{data.getUser.posts.length}</Text>
                    <Text fontSize={"sm"} color={"gray.500"}>
                      Posts
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
                  {extras ? "Hide" : "Show more"}
                </Button>
                <Button
                  w={"full"}
                  mt={8}
                  bg={"green.400"}
                  color={"white"}
                  rounded={"md"}
                  onClick={handleOpenUpdate}
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "lg",
                  }}
                >
                  Update profile
                </Button>
                <Modal onClose={onClose} isOpen={isOpen} isCentered>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Update Profile</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      {" "}
                      <form onSubmit={handleOnSubmit}>
                        <VStack spacing={4} align="flex-start">
                          <FormControl>
                            <FormLabel htmlFor="username">Username</FormLabel>
                            <Input
                              id="username"
                              name="username"
                              type="text"
                              variant="outline"
                              focusBorderColor="green.400"
                              placeholder="Enter new username"
                              onChange={(e) => setName(e.target.value)}
                              defaultValue={data.getUser.username}
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel htmlFor="bio">Bio</FormLabel>
                            <Input
                              required
                              id="bio"
                              name="bio"
                              type="text"
                              variant="outline"
                              focusBorderColor="green.400"
                              defaultValue={data.getUser.bio}
                              placeholder="write something about your self"
                              onChange={(e) => setBio(e.target.value)}
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel htmlFor="postpic">
                              Upload profile photo
                            </FormLabel>
                            <Input
                              id="postpic"
                              name="postpic"
                              type="file"
                              variant="unstyled"
                              onChange={handleFileChange}
                            />
                          </FormControl>
                          <Button
                            type="submit"
                            bgColor={"lightgreen"}
                            width="full"
                          >
                            Update
                          </Button>
                        </VStack>
                      </form>
                    </ModalBody>
                    <ModalFooter>
                      <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </Box>
            </Box>
            <Box>
              {extras === true && (
                <Container>
                  <Col>
                    <Stack my={3}>
                      <Heading as="h2" size="xl">
                        My Following
                      </Heading>
                      <Row>
                        {data.getUser.following.length > 0 ? (
                          data.getUser.following.map((user) => (
                            <Col
                              xs={12}
                              md={4}
                              key={user.id}
                              justify={"center"}
                            >
                              <Card maxW={"md"} m={3} key={user.id}>
                                <Stack
                                  direction={"row"}
                                  justify={"space-between"}
                                  p={3}
                                  px={5}
                                  alignItems={"center"}
                                >
                                  <Box>
                                    <Avatar src={user.profilePic} />
                                  </Box>
                                  <Stack
                                    direction={"row"}
                                    alignItems={"center"}
                                    justify={"flex-start"}
                                  >
                                    <Heading size={"md"}>
                                      {user.username}
                                    </Heading>
                                    <Button
                                      onClick={() => handleFollow(user.id)}
                                      size={"sm"}
                                      bg={"purple.200"}
                                    >
                                      unfollow
                                    </Button>
                                  </Stack>
                                </Stack>
                              </Card>
                            </Col>
                          ))
                        ) : (
                          <div>No following</div>
                        )}
                      </Row>
                    </Stack>
                    <Stack my={3}>
                      <Heading as="h2" size="xl">
                        My Followers
                      </Heading>
                      <Row>
                        {data.getUser.followers.length > 0 ? (
                          data.getUser.followers.map((user) => (
                            <Col
                              xs={12}
                              md={4}
                              key={user.id}
                              justify={"center"}
                            >
                              <Card maxW={"md"} m={3} key={user.id}>
                                <Stack
                                  direction={"row"}
                                  justify={"space-between"}
                                  p={3}
                                  px={5}
                                  alignItems={"center"}
                                >
                                  <Box>
                                    <Avatar src={user.profilePic} />
                                  </Box>
                                  <Stack
                                    direction={"row"}
                                    alignItems={"center"}
                                    justify={"flex-start"}
                                  >
                                    <Heading size={"md"}>
                                      {user.username}
                                    </Heading>

                                    <Link to={`/follow/${user.id}`}>
                                      <Button size={"sm"}>
                                        <CiShare1 />
                                      </Button>
                                    </Link>
                                  </Stack>
                                </Stack>
                              </Card>
                            </Col>
                          ))
                        ) : (
                          <div>No followers</div>
                        )}
                      </Row>
                    </Stack>

                    <Stack my={3}>
                      <Heading as="h2" size="xl">
                        My Posts
                      </Heading>
                      <Row>
                        {data.getUser.posts.length > 0 ? (
                          data.getUser.posts.map((post) => (
                            <Col
                              xs={12}
                              md={4}
                              key={post.id}
                              justify={"center"}
                            >
                              <NormalPostCard post={post} />
                            </Col>
                          ))
                        ) : (
                          <div>No posts</div>
                        )}
                      </Row>
                    </Stack>

                    <Stack my={3}>
                      <Heading as="h2" size="xl">
                        My Savedpost
                      </Heading>
                      <Row>
                        {data.getUser.savedposts.length > 0 ? (
                          data.getUser.savedposts.map((post) => (
                            <Col
                              xs={12}
                              md={4}
                              key={post.post.id}
                              justify={"center"}
                            >
                              <NormalPostCard post={post.post} />
                            </Col>
                          ))
                        ) : (
                          <div>No posts</div>
                        )}
                      </Row>
                    </Stack>

                    <Stack my={3}>
                      <Heading as="h2" size="xl">
                        My Comments
                      </Heading>
                      <Row>
                        {data.getUser.comments.length > 0 ? (
                          data.getUser.comments.map((comment) => (
                            <Col
                              xs={12}
                              md={4}
                              key={comment.id}
                              justify={"center"}
                            >
                              <Card m={3} key={comment.id}>
                                <CardHeader>
                                  <Heading size="md">{comment.text}</Heading>
                                </CardHeader>
                                <StackDivider />
                                <CardBody>
                                  <Stack spacing="4">
                                    <Box>
                                      <Heading
                                        size="xs"
                                        textTransform="uppercase"
                                      >
                                        Comment on {comment.post.postBy} post
                                      </Heading>
                                      <Text pt="2" fontSize="sm">
                                        {comment.post.caption}{" "}
                                      </Text>
                                    </Box>
                                  </Stack>
                                </CardBody>
                              </Card>
                            </Col>
                          ))
                        ) : (
                          <div>No comments</div>
                        )}
                      </Row>
                    </Stack>
                  </Col>
                </Container>
              )}
            </Box>
          </VStack>
        ) : (
          <Flex justify={"center"} alignItems={"center"} w={"100%"}>
            <InfinitySpin width="200" color="#bddff2" />
          </Flex>
        )}
      </Center>
    </>
  );
};
export default UserProfile;
