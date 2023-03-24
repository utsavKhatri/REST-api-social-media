import {
  Box,
  Center,
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
  CardHeader,
  CardBody,
  CardFooter,
  IconButton,
  Flex,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  PopoverTrigger,
  Popover,
  Hide,
} from "@chakra-ui/react";
import { AiFillHeart, AiFillDelete, AiOutlineHeart } from "react-icons/ai";
import { FaBookmark, FaRegBookmark, FaShare } from "react-icons/fa";
import { BsFillShareFill, BsThreeDotsVertical } from "react-icons/bs";

import toast, { Toaster } from "react-hot-toast";
import CommentCard from "./CommentCard";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const PostCard = ({ post, reFetchData }) => {
  const userData = JSON.parse(localStorage.getItem("user-profile"));
  const [isLiked, setIsLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userList, setUserList] = useState();

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
          reFetchData();
        } else {
          alert(response.data.message);
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
          setIsLiked(!isLiked);
          if (isLiked) {
            toast.success("dislike");
          } else {
            toast.success("liked");
          }
          navigate("/");
          reFetchData();
        } else {
          toast.error("something went wrong");
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
          setSaved(!saved);
          if (saved) {
            toast.success("saved");
          } else {
            toast.success("un saved");
          }
          navigate("/");
          reFetchData();
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
          reFetchData();
        } else {
          toast.error("something went wrong");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Center py={10}>
      <Toaster />
      {/* <Box
        role={"group"}
        p={6}
        maxW={"330px"}
        w={"full"}
        bg={useColorModeValue("white", "gray.800")}
        boxShadow={"2xl"}
        rounded={"lg"}
        pos={"relative"}
        zIndex={1}
      >
        {post.image !== "" && (
          <Box
            rounded={"lg"}
            mt={-12}
            pos={"relative"}
            height={"230px"}
            _after={{
              transition: "all .3s ease",
              content: '""',
              w: "full",
              h: "full",
              pos: "absolute",
              top: 5,
              left: 0,
              backgroundImage: `url(${post.image})`,
              filter: "blur(15px)",
              zIndex: -1,
            }}
            _groupHover={{
              _after: {
                filter: "blur(20px)",
              },
            }}
          >
            <Image
              rounded={"lg"}
              height={230}
              width={282}
              objectFit={"cover"}
              src={post.image}
            />
          </Box>
        )}
        <Stack pt={10} align={"center"} alignItems={"left"}>
          <Stack direction={"row"} alignSelf={"right"}>
            <Link
              to={
                post.postBy.id !== userData.id
                  ? `/follow/${post.postBy.id}`
                  : "/profile"
              }
            >
              <Stack direction={"row"} spacing={4} align={"center"}>
                <Avatar size="xs" src={post.postBy.profilePic} alt={"Author"} />
                <Text
                  color={"gray.500"}
                  fontSize={"sm"}
                  textTransform={"uppercase"}
                >
                  {post.postBy.username}
                </Text>
              </Stack>
            </Link>
          </Stack>

          <Heading fontSize={"2xl"} fontFamily={"body"} fontWeight={500}>
            {post.caption}
          </Heading>
          <Stack direction={"row"}>
            <Stack
              direction={"row"}
              align={"center"}
              alignItems={"center"}
              justifyContent={"center"}
              w={16}
            >
              <Text fontSize={"sm"}>{post.like.length}</Text>
              <Button variant={"unstyled"} onClick={handleLike}>
                <AiFillHeart color={isLiked ? "red" : "gray"} />
              </Button>
            </Stack>
            <Stack direction={"row"} align={"center"}>
              <Text color={"gray.600"} fontSize={"sm"}>
                {post.save.length}
              </Text>
              <Button variant={"unstyled"} onClick={handleSave}>
                <BsFillBookmarkFill color={saved ? "black" : "gray"} />
              </Button>
            </Stack>
            <Stack direction={"row"} align={"center"}>
              <Text color={"gray.600"} fontSize={"sm"}>
                {post.sharedWith.length}
              </Text>
              <Button variant={"unstyled"} onClick={fetchUserlist}>
                <FaShare color="blue" />
              </Button>
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
            </Stack>
            {userData.id === post.postBy.id && (
              <Stack direction={"row"} alignSelf={"end"}>
                <Button
                  variant={"unstyled"}
                  color={"red"}
                  onClick={handleDelete}
                >
                  <AiFillDelete color="red" />
                </Button>
              </Stack>
            )}
          </Stack>
          <Stack>
            <CommentCard post={post} reFetchData={reFetchData} />
          </Stack>
        </Stack>
      </Box> */}

      <Card maxW="md">
        <CardHeader>
          <Flex spacing="4">
            <Flex flex="1" gap="4" alignItems="center" flexWrap="nowarp">
              <Link
                to={
                  post.postBy.id !== userData.id
                    ? `/follow/${post.postBy.id}`
                    : "/profile"
                }
              >
                <Avatar name="Segun Adebayo" src={post.postBy.profilePic} />
              </Link>

              <Box>
                <Link
                  to={
                    post.postBy.id !== userData.id
                      ? `/follow/${post.postBy.id}`
                      : "/profile"
                  }
                >
                  <Heading size="sm">{post.postBy.username}</Heading>
                </Link>
                <Hide below="md">
                  <Text>{post.postBy.bio}</Text>
                </Hide>
              </Box>
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
              {userData.id === post.postBy.id && (
                <PopoverContent w="fit-content" _focus={{ boxShadow: "none" }}>
                  <PopoverArrow />
                  <PopoverBody>
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
                  </PopoverBody>
                </PopoverContent>
              )}
            </Popover>
          </Flex>
        </CardHeader>
        <CardBody>
          <Text>{post.caption}</Text>
        </CardBody>

        {post.image !== "" && (
          <Image objectFit="cover" src={post.image} alt="Chakra UI" />
        )}

        <CardFooter justify="space-between" flexWrap="wrap">
          <Stack direction="row" align="center" w={"100%"}>
            <Button
              flex="1"
              onClick={handleLike}
              variant="ghost"
              leftIcon={
                post.like.some((us) => us.user.id === userData.id) ? (
                  <AiFillHeart color="red" />
                ) : (
                  <AiOutlineHeart />
                )
              }
            >
              {post.like.length}
            </Button>
            <Button
              flex="1"
              variant="ghost"
              onClick={fetchUserlist}
              leftIcon={<FaShare />}
            >
              {post.sharedWith.length}
            </Button>
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
            <Button
              flex="1"
              variant="ghost"
              onClick={handleSave}
              leftIcon={
                post.save.some((us) => us.user.id === userData.id) ? (
                  <FaBookmark />
                ) : (
                  <FaRegBookmark />
                )
              }
            >
              {post.save.length}
            </Button>
          </Stack>
          <Stack w={"100%"}>
            <CommentCard post={post} reFetchData={reFetchData} />
          </Stack>
        </CardFooter>
      </Card>
    </Center>
  );
};
export default PostCard;
