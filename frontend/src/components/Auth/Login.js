import React, { useContext, useEffect } from "react";
import { useFormik } from "formik";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { MyContext } from "../../context";
// import { useNavigate } from "react-router-dom";

const Login = () => {
  const { setIsLoggedIn } = useContext(MyContext);

  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      fetch("http://localhost:1337/login", {
        method: "POST",
        body: JSON.stringify(values, null, 2),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else {
            return response
              .json()
              .then((data) => toast.error(data.message))
              .catch((err) => console.log(err));
          }
        })
        .then((response) => {
          localStorage.clear();
          localStorage.setItem("user-token", response.userToken.token);
          localStorage.setItem(
            "user-profile",
            JSON.stringify(response.userToken)
          );
          setIsLoggedIn({
            token: true,
          });
          navigate("/");
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
  });

  return (
    <>
      <Flex bg="gray.100" align="center" justify="center" h="100vh">
        <Toaster />
        <Box bg="white" p={3} rounded="md" w={"50%"}>
          <form onSubmit={formik.handleSubmit}>
            <VStack spacing={4} align="flex-start">
              <FormControl>
                <FormLabel htmlFor="email">Email Address</FormLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  variant="filled"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  variant="filled"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                />
              </FormControl>
              <Link to={"/signup"}>Register account</Link>
              <Button type="submit" colorScheme="purple" width="full">
                Login
              </Button>
            </VStack>
          </form>
        </Box>
      </Flex>
    </>
  );
};

export default Login;
