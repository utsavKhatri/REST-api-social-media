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
  CardFooter,
  Card,
  CardBody,
  StackDivider,
  CardHeader,
} from "@chakra-ui/react";
// import { BiChat, BiLike, BiShare } from "@chakra-ui/icons";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "../context";
import { CiShare1 } from "react-icons/ci";
import { toast, Toaster } from "react-hot-toast";
import NormalPostCard from "./NormalPostCard";
import { InfinitySpin } from "react-loader-spinner";

const UserProfile = () => {
  const userData = JSON.parse(localStorage.getItem("user-profile"));
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [extras, setExtras] = useState(false);
  const { reFetchData } = useContext(MyContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [file, setFile] = useState(null);
  const [unfollowId, setUnfollowId] = useState();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  const options = {
    method: "POST",
    url: "http://localhost:1337/graphql",
    headers: {
      Authorization: `Bearer ${userData.token}`,
    },
    data: {
      query:
        "query GetUser($id: ID!) {   getUser(id:$id){       id       username       email  bio  profilePic       posts{           id           caption           image       }       following{           id           username           profilePic           email       }       followers{           id           username           profilePic           email       }       comments{           id           text           post{               id               caption               image         }       }       likes{   id    post{  id   caption   image }     }      savedposts{ id  post{   id     caption     image } }   }\n}\n",
      variables: { id: userData.id },
    },
  };

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
    } else {
      formData.append("postpic", file);
      formData.append("bio", bio);
    }

    fetch("http://localhost:1337/profile", {
      method: "POST",
      body: formData,
      headers: headers,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        fetchUserProfile();
        navigate("/profile");
        onClose();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const fetchUserProfile = () => {
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
        console.log(response.data);
        if (response.status === 200) {
          toast.success("You are now following this user");
          fetchUserProfile();
        } else {
          toast.error("something went wrong");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <>
      <Toaster />
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
                  <Divider
                    style={{
                      marginBlock: "10px",
                    }}
                  />
                  {profile.bio && (
                    <Text color={"gray.500"} textAlign={"center"}>
                      {profile.bio}
                    </Text>
                  )}
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
                  <Stack spacing={0} align={"center"}>
                    <Text fontWeight={600}>{profile.posts.length}</Text>
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
                  onClick={onOpen}
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
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel htmlFor="bio">Bio</FormLabel>
                            <Input
                              id="bio"
                              name="bio"
                              type="text"
                              variant="outline"
                              focusBorderColor="green.400"
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
                        {profile.following.length > 0 ? (
                          profile.following.map((user) => (
                            <Col
                              xs={12}
                              md={4}
                              key={user.id}
                              justifyContent={"center"}
                            >
                              <Card maxW={"md"} m={3} key={user.id}>
                                <Stack
                                  direction={"row"}
                                  justifyContent={"space-between"}
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
                                    justifyContent={"flex-start"}
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
                        {profile.followers.length > 0 ? (
                          profile.followers.map((user) => (
                            <Col
                              xs={12}
                              md={4}
                              key={user.id}
                              justifyContent={"center"}
                            >
                              <Card maxW={"md"} m={3} key={user.id}>
                                <Stack
                                  direction={"row"}
                                  justifyContent={"space-between"}
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
                                    justifyContent={"flex-start"}
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
                        {profile.posts.length > 0 ? (
                          profile.posts.map((post) => (
                            <Col
                              xs={12}
                              md={4}
                              key={post.id}
                              justifyContent={"center"}
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
                        {profile.savedposts.length > 0 ? (
                          profile.savedposts.map((post) => (
                            <Col
                              xs={12}
                              md={4}
                              key={post.post.id}
                              justifyContent={"center"}
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
                        {profile.comments.length > 0 ? (
                          profile.comments.map((comment) => (
                            <Col
                              xs={12}
                              md={4}
                              key={comment.id}
                              justifyContent={"center"}
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
          <Flex justifyContent={"center"} alignItems={"center"} w={"100%"}>
            <InfinitySpin width="200" color="#bddff2" />
          </Flex>
        )}
      </Center>
    </>
  );
};
export default UserProfile;
