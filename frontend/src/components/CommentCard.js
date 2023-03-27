import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  FormControl,
  Input,
  Text,
} from "@chakra-ui/react";
import React, {  useState } from "react";
import { Col, Row } from "react-bootstrap";

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
          console.log(response.data);
        }
      })
      .catch((error) => {
        console.log(error.data);
      });
  };
  return (
    <Accordion allowToggle>
      <AccordionItem>
        <h2>
          <AccordionButton sx={{
            outline: "none",
            borderBlock: "none",
            _hover: {
              bg: "blue.50",
            }
          }}>
            <Box as="span" flex="1" textAlign="left">
              {post.comments.length} Comments...
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>

        <AccordionPanel>
          <form>
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
              <Box key={comment.id} p={2}>
                <Row>
                  <Text>{comment.text}</Text>
                </Row>
                <Row className="text-muted bg-light text-right py-2">
                  <Col xs={3}>
                    <Avatar size={"xs"} src={comment.user.profilePic} />
                  </Col>
                  <Col>
                    <Text>{comment.user.username}</Text>
                  </Col>
                </Row>
              </Box>
            ))}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default CommentCard;
