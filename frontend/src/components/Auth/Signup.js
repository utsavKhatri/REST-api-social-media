import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
// import { MyContext } from "../../context";

const Signup = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("postpic", file);

    fetch("http://localhost:1337/signup", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.status === 201) {
          alert("successfully created account");
          navigate("/login");
          response.json();
        } else {
          response
            .json()
            .then((data) => alert(data.message))
            .catch((err) => console.log(err));
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert(error);
      });
  };
  return (
    <>
      <Flex bg={useColorModeValue("white.100", "gray.600")} align="center" justify="center" h="100vh">
        <Box bg={useColorModeValue("white.100", "gray.900")} p={3} rounded="md" w={"50%"}>
          <form
            onSubmit={handleSubmit}
          >
            <VStack spacing={4} align="flex-start">
              <FormControl>
                <FormLabel htmlFor="username">Username</FormLabel>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="enter username"
                  focusBorderColor="green.400"
                  variant="filled"
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="email">Email Address</FormLabel>
                <Input
                  id="email"
                  name="email"
                  focusBorderColor="green.400"
                  placeholder="enter email"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  variant="filled"
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Input
                  id="password"
                  name="password"
                  focusBorderColor="green.400"
                  placeholder="enter password"
                  type="password"
                  variant="filled"
                  onChange={(e) => setPass(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="postpic">Profile Photo</FormLabel>
                <Input
                  id="postpic"
                  name="postpic"
                  focusBorderColor="green.400"
                  type="file"
                  variant={"unstyled"}
                  onChange={handleFileChange}
                />
              </FormControl>
              <Button type="submit" bgColor={"#68D391"} width="full">
                Signup
              </Button>
            </VStack>
          </form>
        </Box>
      </Flex>
    </>
  );
};

export default Signup;
