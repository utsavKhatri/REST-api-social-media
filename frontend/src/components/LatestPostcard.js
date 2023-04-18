import React from "react";
import {
  Box,
  Heading,
  Text,
  Stack,
  Image,
  Avatar,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
  IconButton,
  Flex,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  PopoverTrigger,
  Popover,
  Hide,
  Icon,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  FormControl,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";
import toast, { Toaster } from "react-hot-toast";
import { useContext, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import { FiHeart, FiMessageCircle, FiSend, FiBookmark } from "react-icons/fi";
import { BsFillShareFill, BsThreeDotsVertical } from "react-icons/bs";
import { AiFillDelete, AiOutlineCloudDownload } from "react-icons/ai";
import { MyContext } from "../context";

const LatestPostcard = ({ post }) => {
  const { refetch } = useContext(MyContext);
  const userData = JSON.parse(localStorage.getItem("user-profile"));
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userList, setUserList] = useState();
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const handleDelete = () => {
    const options = {
      method: "DELETE",
      url: `http://localhost:1337/post/${post.id}`,
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    };
    axios
      .request(options)
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);

          alert(response.data.message);
          navigate("/");
          refetch();
        } else {
          alert(response.data.message);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleSave = () => {
    const options = {
      method: "GET",
      url: `http://localhost:1337/save/${post.id}`,
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    };
    axios
      .request(options)
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          refetch();
        } else {
          toast.error("something went wrong");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleLike = () => {
    const options = {
      method: "GET",
      url: `http://localhost:1337/like/${post.id}`,
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    };
    axios
      .request(options)
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          refetch();
        } else {
          toast.error("something went wrong");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchUserlist = () => {
    const optionsFetcjUser = {
      url: "http://localhost:1337/graphql",
      method: "post",
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
      data: {
        query: "{getAllUsers{    id  username profilePic  }}",
      },
    };
    onOpen();
    axios
      .request(optionsFetcjUser)
      .then((response) => {
        console.log(response.data.data.getAllUsers);
        setUserList(response.data.data.getAllUsers);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const handleSharePost = (usId) => {
    const options = {
      method: "POST",
      url: `http://localhost:1337/post/share/${post.id}?sharedWith=${usId}`,
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
      body: {
        sharedWith: usId,
      },
    };
    axios
      .request(options)
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          onClose();
          navigate("/");
          refetch();
        } else {
          toast.error("something went wrong");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const download = () => {
    axios({
      url: post.image,
      method: "GET",
      responseType: "blob", // Force to receive data in a Blob Format
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        console.log(url);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "download-img.png"); // Set a default filename for the downloaded file
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const [commenttext, setCommenttext] = useState();

  const handlepostComment = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("text", commenttext);
    fetch(`http://localhost:1337/comment/${post.id}`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          refetch();
          setCommenttext("");
          return alert(response.data.message);
        } else {
          console.log(response.data);
        }
      })
      .catch((error) => {
        console.log(error.data);
      });
  };

  const hoursAgo = (date) => {
    const pastDate = new Date(parseInt(date));
    const currentDate = new Date();
    const hoursAgo = Math.round((currentDate - pastDate) / 3600000);
    return hoursAgo;
  };
  return (
    <Box
      maxW="md"
      borderWidth="1px"
      boxShadow={"md"}
      borderRadius="md"
      overflow="hidden"
      mb={4}
    >
      {/* Post Image */}
      {post.image !== "" && (
        <Box>
          <Image
            src={post.image}
            alt="Post"
            objectFit="cover"
            w="100%"
            h="auto"
          />
        </Box>
      )}

      <Flex
        py={0}
        backgroundColor={useColorModeValue("gray.50", "gray.900")}
        direction={"column"}
      >
        {/* Post Author */}
        <Flex p={4} alignItems={"center"} justifyContent={"space-between"}>
          <Flex alignItems={"center"}>
            <Link
              to={
                post.postBy.id !== userData.id
                  ? `/follow/${post.postBy.id}`
                  : "/profile"
              }
            >
              <Avatar size="sm" src={post.postBy.profilePic} mr={4} />
            </Link>

            <Flex flexDirection={"column"}>
              <Link
                to={
                  post.postBy.id !== userData.id
                    ? `/follow/${post.postBy.id}`
                    : "/profile"
                }
              >
                <Text fontWeight="bold" my={"auto"}>
                  {post.postBy.username}
                </Text>
              </Link>
              <Hide below="md">
                <Text my={"auto"}>{post.postBy.bio && post.postBy.bio}</Text>
              </Hide>
            </Flex>
          </Flex>
          <Popover placement="bottom" isLazy>
            <PopoverTrigger>
              <IconButton
                aria-label="More server options"
                icon={<BsThreeDotsVertical />}
                variant="ghost"
                w="fit-content"
              />
            </PopoverTrigger>
            <PopoverContent w="fit-content" _focus={{ boxShadow: "none" }}>
              <PopoverArrow />
              <PopoverBody>
                {userData.id === post.postBy.id && (
                  <Stack>
                    <Button
                      variant={"unstyled"}
                      color={"red"}
                      onClick={handleDelete}
                      leftIcon={<AiFillDelete color="red" />}
                    >
                      Delete post
                    </Button>
                  </Stack>
                )}

                {post.image !== "" && (
                  <Stack>
                    <Button
                      variant={"unstyled"}
                      alignItems={"center"}
                      color={"#9191ff"}
                      onClick={() => download(post.image)}
                      leftIcon={<AiOutlineCloudDownload color={"black"} />}
                      crossOrigin="anonymous"
                    >
                      Download Post
                    </Button>
                  </Stack>
                )}
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Flex>

        {/* Likes and Comments Count */}
        <Flex px={4} pb={4}>
          <Text fontWeight="semibold" mr={1}>
            {post.like.length} likes
          </Text>
          <Text color="gray.500">•</Text>
          <Text ml={1} color="gray.500">
            {post.comments.length} comments
          </Text>
        </Flex>

        {/* Post Caption */}
        <Flex px={4} pb={4}>
          <Text>{post.caption}</Text>
        </Flex>

        {/* Timestamp and Translation */}
        <Flex px={4} pb={4}>
          <Text color="gray.500" fontSize="sm" mr={2}>
            {hoursAgo(post.createdAt)} HOUR AGO
          </Text>
          <Text color="gray.500" fontSize="sm">
            SEE TRANSLATION
          </Text>
        </Flex>

        {/* Like/Comment/Share Buttons */}
        <Flex px={4} pb={4} justifyContent={"space-between"}>
          <Flex>
            <IconButton
              aria-label="Like"
              onClick={handleLike}
              icon={
                <Icon
                  color={
                    post.like.some((us) => us.user.id === userData.id)
                      ? "red"
                      : "black"
                  }
                  fill={
                    post.like.some((us) => us.user.id === userData.id)
                      ? "red"
                      : "white"
                  }
                  as={FiHeart}
                />
              }
              fontSize="xl"
              variant="ghost"
              mr={4}
            />
            <IconButton
              aria-label="Comment"
              icon={<Icon as={FiMessageCircle} />}
              fontSize="xl"
              variant="ghost"
              onClick={() => setIsCommentsVisible(!isCommentsVisible)}
              mr={4}
            />

            {/* <Accordion allowToggle>
            <AccordionItem
              backgroundColor={useColorModeValue("white", "gray.800")}
            >
              <AccordionButton
                padding={0}
                border={0}
                sx={{
                  outline: "none",
                  borderBlock: "none",
                  _hover: {
                    bg: "gray.300",
                    color: "black",
                  },
                  _dark: {
                    _hover: {
                      bg: "gray.900",
                      color: "white",
                    },
                  },
                }}
              >
                <IconButton
                  aria-label="Comment"
                  icon={<Icon as={FiMessageCircle} />}
                  fontSize="xl"
                  variant="ghost"
                  onClick={handleSave}
                />
              </AccordionButton>

              <AccordionPanel
                backgroundColor={useColorModeValue("gray.50", "gray.800")}
              >
                <form
                  backgroundColor={useColorModeValue("gray.50", "gray.800")}
                >
                  <FormControl id="email" className="d-flex gap-2">
                    <Input
                      type="text"
                      placeholder="enter comment here"
                      value={commenttext}
                      onChange={(e) => setCommenttext(e.target.value)}
                    />
                    <Button
                      bg={"blue.400"}
                      color={"white"}
                      onClick={handlepostComment}
                      _hover={{
                        bg: "blue.500",
                      }}
                    >
                      Post
                    </Button>
                  </FormControl>
                </form>
                {post.comments.length > 0 &&
                  post.comments.map((comment) => (
                    <Flex key={comment.id} p={2} alignItems="center">
                      <Avatar
                        size="sm"
                        src={comment.user.profilePic}
                        mr={3}
                        my={"auto"}
                      />
                      <Box flex="1">
                        <Text fontWeight="bold" fontSize="sm" mb={1}>
                          {comment.user.username}
                        </Text>
                        <Text fontSize="sm">{comment.text}</Text>
                      </Box>
                    </Flex>
                  ))}
              </AccordionPanel>
            </AccordionItem>
          </Accordion> */}

            <IconButton
              aria-label="Share"
              onClick={fetchUserlist}
              icon={<Icon as={FiSend} />}
              fontSize="xl"
              variant="ghost"
            />
            <Modal onClose={onClose} isOpen={isOpen} isCentered>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Modal Title</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Stack spacing="4">
                    {userList &&
                      userList.map((us) => (
                        <Card key={us.id} size={"sm"}>
                          <CardBody
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <Heading
                              size="sm"
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "10px",
                              }}
                            >
                              <Avatar size={"sm"} src={us.profilePic} />
                              {us.username}
                            </Heading>
                            <div>
                              <Button
                                flex="1"
                                variant="ghost"
                                onClick={() => handleSharePost(us.id)}
                                leftIcon={<BsFillShareFill />}
                              >
                                Share
                              </Button>
                            </div>
                          </CardBody>
                        </Card>
                      ))}
                  </Stack>
                </ModalBody>
                <ModalFooter>
                  <Button onClick={onClose}>Close</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Flex>
          <IconButton
            aria-label="Bookmark"
            icon={
              <Icon
                fill={
                  post.save.some((us) => us.user.id === userData.id)
                    ? "black"
                    : "white"
                }
                color="black"
                as={FiBookmark}
              />
            }
            fontSize="xl"
            onClick={handleSave}
            justifySelf={"flex-end"}
            variant="ghost"
          />
        </Flex>
        {isCommentsVisible && (
          <Flex px={4} pb={4} flexDirection={"column"}>
            <form onSubmit={handlepostComment}>
              <Flex alignItems="center">
                <Avatar size="sm" src={userData.profilePic} mr={4} />
                <Input
                  type="text"
                  value={commenttext}
                  onChange={(e) => setCommenttext(e.target.value)}
                  placeholder="Add a comment..."
                  fontSize="sm"
                  focusBorderColor="blue.400"
                  flex="1"
                  mr={2}
                />
                <Button
                  type="submit"
                  fontWeight="semibold"
                  _hover={{
                    backgroundColor: "blue.400",
                    color: "white",
                    boxShadow: "md",
                  }}
                  fontSize="sm"
                >
                  Post
                </Button>
              </Flex>
            </form>

            {post.comments.length > 0 &&
              post.comments.map((comment) => (
                <Flex key={comment.id} p={2} alignItems="center">
                  <Avatar
                    size="sm"
                    src={comment.user.profilePic}
                    mr={3}
                    my={"auto"}
                  />
                  <Box flex="1" my={"auto"}>
                    <Text my={"auto"} fontWeight="bold" fontSize="sm" mb={1}>
                      {comment.user.username}
                    </Text>
                    <Text my={"auto"} fontSize="sm">
                      {comment.text}
                    </Text>
                  </Box>
                </Flex>
              ))}
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default LatestPostcard;
