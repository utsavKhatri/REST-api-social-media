import { Avatar, Button, Center, Td, Tr } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

const TableRow = ({ data, index, refetch }) => {
  const navigate = useNavigate();
  const handleStatus = async (id) => {
    const response = await fetch(
      `http://localhost:1337/admin/toggleUser/${id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user-token")}`,
        },
      }
    );
    const body = await response.json();
    if (body.message === "ok") {
      return refetch();
    }
  };

  const handlePosts = async (id) => {
    navigate(`/post-by-user/${id}`);
  };
  return (
    <Tr key={index}>
      <Td isNumeric>{index + 1}</Td>
      <Td>
        <Center>
          <Avatar src={data.profilePic} size="sm" />
        </Center>
      </Td>
      <Td>{data.username}</Td>
      <Td>{data.email}</Td>
      <Td>{data.bio}</Td>
      <Td isNumeric>
        {data.posts.length === 0 ? (
          <Button size={"xs"}>0</Button>
        ) : (
          <Button onClick={() => handlePosts(data.id)}>
            {data.posts.length}
          </Button>
        )}
      </Td>
      <Td isNumeric>{data.followers.length}</Td>
      <Td isNumeric>{data.following.length}</Td>
      <Td isNumeric>{data.likes.length}</Td>
      <Td isNumeric>{data.comments.length}</Td>
      <Td isNumeric>{data.savedposts.length}</Td>
      <Td>
        <Button
          sx={{
            _hover: {
              bg: data.isActive ? "green" : "red",
              color: data.isActive ? "white" : "black",
            },
          }}
          size={"sm"}
          onClick={() => handleStatus(data.id)}
        >
          {data.isActive ? "Active" : "inActive"}
        </Button>
      </Td>
    </Tr>
  );
};

export default TableRow;
