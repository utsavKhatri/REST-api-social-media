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
import {
  AiFillHeart,
  AiFillDelete,
  AiOutlineHeart,
  AiOutlineCloudDownload,
} from "react-icons/ai";
import { FaBookmark, FaRegBookmark, FaShare } from "react-icons/fa";
import { BsFillShareFill, BsThreeDotsVertical } from "react-icons/bs";

import toast, { Toaster } from "react-hot-toast";
import CommentCard from "./CommentCard";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { MyContext } from "../context";

const PostCard = ({ post }) => {
  const { refetch } = useContext(MyContext);
  const userData = JSON.parse(localStorage.getItem("user-profile"));
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
          // console.log(response.data);

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
          // console.log(response.data);
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
          // console.log(response.data);
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
        // console.log(response.data.data.getAllUsers);
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
          // console.log(response.data);
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
        // console.log(url);
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

  return (
    <Center py={10}>
      <Toaster />
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
        </CardHeader>
        <CardBody>
          <Text>{post.caption}</Text>
        </CardBody>

        {post.image !== "" && (
          <Image
            objectFit="cover"
            src={post.image}
            alt="img"
            crossOrigin="anonymous"
          />
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
            <CommentCard post={post} refetch={refetch} />
          </Stack>
        </CardFooter>
      </Card>
    </Center>
  );
};
export default PostCard;
