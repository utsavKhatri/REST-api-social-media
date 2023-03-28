import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Button,
  Container,
  FormControl,
  Input,
  Spinner,
  Avatar,
  Center,
} from "@chakra-ui/react";
import gql from "graphql-tag";

import { useQuery } from "react-apollo";
import { Link, useNavigate } from "react-router-dom";
import TableRow from "./TableRow";

const Dashboard = () => {
  const [searchValue, setSearchValue] = useState("");
  const GET_ALL_USER = gql`
    query GetAllUsers($search: String) {
      getAllUsers(search: $search) {
        id
        username
        email
        bio
        profilePic
        posts {
          id
        }
        followers {
          id
        }
        following {
          id
        }
        likes {
          id
        }
        comments {
          id
        }
        savedposts {
          id
        }
      }
    }
  `;

  const { loading, error, data, refetch } = useQuery(GET_ALL_USER, {
    variables: { search: searchValue },
  });
  const navigate = useNavigate();

  const handleSearch = async (v) => {
    await setSearchValue(v);
    await refetch();
  };

  useEffect(() => {
    refetch();
  });

  return (
    <Box>
      <FormControl p={3}>
        <Input
          placeholder="enter serach term"
          onKeyUp={(e) => handleSearch(e.target.value)}
        />
      </FormControl>
      <Container className="container-fluid mt-4">
        {!error ? (
          loading ? (
            <Center>
              <Spinner />
            </Center>
          ) : (
            <TableContainer>
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th isNumeric>No.</Th>
                    <Th>Profile Pic</Th>
                    <Th>Username</Th>
                    <Th>Email</Th>
                    <Th>Bio</Th>
                    <Th isNumeric>Posts</Th>
                    <Th isNumeric>Followers</Th>
                    <Th isNumeric>Following</Th>
                    <Th isNumeric>Likes</Th>
                    <Th isNumeric>Comments</Th>
                    <Th isNumeric>Saves</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data.getAllUsers.length > 1 ? (
                    data.getAllUsers.map((data, index) => (
                      <TableRow data={data} refetch={refetch} index={index}/>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={7} textAlign={"center"}>
                        No data found
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          )
        ) : (
          <div>something went wrong</div>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;
