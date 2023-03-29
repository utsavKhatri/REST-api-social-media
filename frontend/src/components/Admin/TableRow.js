import { Avatar, Button, Center, Td, Tr } from "@chakra-ui/react";
import React from "react";

const TableRow = ({ data, index, refetch, key }) => {
  const handleStatus = async (id) => {
    console.log("insise fubn",id);
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

  return (
    <Tr key={key-1}>
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
        <Button size={"xs"}>{data.posts.length}</Button>
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
          {console.log(data.isActive)}
          {data.isActive ? "Active" : "inActive"}
        </Button>
      </Td>
    </Tr>
  );
};

export default TableRow;
