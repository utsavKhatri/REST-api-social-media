import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
// import { MyContext } from "../../context";

const Signup = () => {
  const navigate = useNavigate();
  // const navigate = useNavigate();
  // const formik = useFormik({
  //   initialValues: {
  //     username: "",
  //     email: "",
  //     password: "",
  //     postpic:{},
  //   },
  //   onSubmit: (values) => {
  //     fetch("http://localhost:1337/signup", {
  //       method: "POST",
  //       body: JSON.stringify(values, null, 2),
  //     })
  //       .then((response) => {
  //         if (response.status === 200) {
  //           return response.json();
  //         } else {
  //           return response
  //             .json()
  //             .then((data) => toast.error(data.message))
  //             .catch((err) => console.log(err));
  //         }
  //       })
  //       .then((response) => {
  //         setTimeout(() => {
  //           navigate("/auth/login");
  //         }, 500);
  //       })
  //       .catch((err) => {
  //         console.log(err.message);
  //       });
  //   },
  // });
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

    console.log(...formData);
    fetch("http://localhost:1337/signup", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.status === 201) {
          alert("successfully created account");
          navigate("/auth/login");
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
      <Flex bg="gray.100" align="center" justify="center" h="100vh">
        <Toaster />
        <Box bg="white" p={3} rounded="md" w={"50%"}>
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
                  variant="filled"
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="email">Email Address</FormLabel>
                <Input
                  id="email"
                  name="email"
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
