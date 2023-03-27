import {
  Heading,
  Avatar,
  Box,
  Center,
  Text,
  Stack,
  Button,
  Badge,
} from "@chakra-ui/react";
import { gql } from "apollo-boost";
import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-apollo";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";

export default function FollowCard() {
  const userData = localStorage.getItem("user-token");
  const currentUser = JSON.parse(localStorage.getItem("user-profile"));
  const [isFollowing, setIsFollowing] = useState(false);
  let { id } = useParams();

  const GET_SINGLE_USER = gql`
    query GetUser($id: ID!) {
      getUser(id: $id) {
        id
        username
        email
        profilePic
        isActive
        posts {
          id
        }
        following {
          id
          username
          email
          profilePic
        }
        followers {
          id
          username
          email
          profilePic
        }
      }
    }
  `;

  const { loading, error, data, refetch } = useQuery(GET_SINGLE_USER, {
    variables: { id: id },
  });

  const handleFollow = () => {
    const followOption = {
      method: "POST",
      url: `http://localhost:1337/user/follow/${id}`,
      headers: {
        Authorization: `Bearer ${userData}`,
      },
    };

    axios
      .request(followOption)
      .then((response) => {
        console.log(response.data);
        if (response.status === 200) {
          setIsFollowing(!isFollowing);
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

  return (
    <>
      <Toaster />
      <Center py={6}>
        {loading || error ? (
          <Text>{error || "loading...."}</Text>
        ) : (
          <Box
            maxW={"320px"}
            w={"full"}
            bg={{ color: "white" }}
            boxShadow={"2xl"}
            rounded={"lg"}
            p={6}
            textAlign={"center"}
          >
            <Avatar
              size={"xl"}
              src={data.getUser.profilePic}
              alt={"Avatar Alt"}
              mb={4}
              pos={"relative"}
              _after={{
                content: '""',
                w: 4,
                h: 4,
                bg: data.getUser.isActive ? "green.500" : "red.500",
                border: "2px solid white",
                rounded: "full",
                pos: "absolute",
                bottom: 0,
                right: 3,
              }}
            />
            <Heading fontSize={"2xl"} fontFamily={"body"}>
              {data.getUser.username}
            </Heading>
            <Text fontWeight={600} color={"gray.500"} mb={4}>
              {data.getUser.email}
            </Text>
            <Stack align={"center"} justify={"center"} direction={"row"} mt={6}>
              <Badge px={2} py={1} bg={{ color: "white" }} fontWeight={"400"}>
                #art
              </Badge>
              <Badge px={2} py={1} bg={{ color: "white" }} fontWeight={"400"}>
                #photography
              </Badge>
              <Badge px={2} py={1} bg={{ color: "white" }} fontWeight={"400"}>
                #music
              </Badge>
            </Stack>
            <Stack direction={"row"} justify={"center"} spacing={6}>
              <Stack spacing={0} align={"center"}>
                <Text fontWeight={600}> {data.getUser.followers.length}</Text>
                <Text fontSize={"sm"} color={"gray.500"}>
                  Folloers
                </Text>
              </Stack>
              <Stack spacing={0} align={"center"}>
                <Text fontWeight={600}> {data.getUser.following.length}</Text>
                <Text fontSize={"sm"} color={"gray.500"}>
                  Following
                </Text>
              </Stack>
              <Stack spacing={0} align={"center"}>
                <Text fontWeight={600}> {data.getUser.posts.length}</Text>
                <Text fontSize={"sm"} color={"gray.500"}>
                  Posts
                </Text>
              </Stack>
            </Stack>
            <Stack mt={8} direction={"row"} spacing={4}>
              <Button
                flex={1}
                fontSize={"sm"}
                rounded={"full"}
                _focus={{
                  bg: "gray.200",
                }}
              >
                Message
              </Button>
              <Button
                flex={1}
                fontSize={"sm"}
                rounded={"full"}
                bg={"blue.400"}
                color={"white"}
                onClick={handleFollow}
                boxShadow={
                  "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
                }
                _hover={{
                  bg: "blue.500",
                }}
                _focus={{
                  bg: "blue.500",
                }}
              >
                {data.getUser.followers.some(
                  (user) => user.id === currentUser.id
                )
                  ? "unFollow"
                  : "Follow"}
              </Button>
            </Stack>
          </Box>
        )}
      </Center>
    </>
  );
}
