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
import { useFormik } from "formik";
import React from "react";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      newPassword: "",
    },
    onSubmit: (values) => {
      fetch("http://localhost:1337/forgot-password", {
        method: "POST",
        body: JSON.stringify(values, null, 2),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.status === 200) {
            toast.success("Password reset successfully");
            return response.json();
          } else {
            return response
              .json()
              .then((data) => toast.error(data.message))
              .catch((err) => console.log(err));
          }
        })
        .then(() => {
          navigate("/login");
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
  });
  return (
    <Flex bg={useColorModeValue("white.200", "gray.600")} align="center" justify="center" h="100vh">
      <Toaster />
      <Box bg={useColorModeValue("white.100", "gray.900")} p={3} rounded="md" w={"50%"}>
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
                focusBorderColor="green.400"
                value={formik.values.email}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="newPassword">newPassword</FormLabel>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                variant="filled"
                placeholder="enter new password"
                focusBorderColor="green.400"
                onChange={formik.handleChange}
                value={formik.values.newPassword}
              />
            </FormControl>

            <Button type="submit" colorScheme="purple" width="full">
              Change Password
            </Button>
          </VStack>
        </form>
      </Box>
    </Flex>
  );
};

export default ForgotPassword;
