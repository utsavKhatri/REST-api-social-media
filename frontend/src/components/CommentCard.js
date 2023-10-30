import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useState } from "react";

const CommentCard = ({ post, refetch }) => {
  const [commenttext, setCommenttext] = useState();
  const userData = JSON.parse(localStorage.getItem("user-profile"));

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
          // console.log(response.data);
        }
      })
      .catch((error) => {
        console.log(error.data);
      });
  };
  return (
    <Accordion allowToggle>
      <AccordionItem backgroundColor={useColorModeValue("white", "gray.800")}>
        
          <AccordionButton
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
            <Box as="span" flex="1" textAlign="left">
              {post.comments.length} Comments...
            </Box>
            <AccordionIcon />
          </AccordionButton>
        

        <AccordionPanel
          backgroundColor={useColorModeValue("gray.50", "gray.800")}
        >
          <form backgroundColor={useColorModeValue("gray.50", "gray.800")}>
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
    </Accordion>
  );
};

export default CommentCard;
