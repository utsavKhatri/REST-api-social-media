import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Img,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { MyContext } from "../context";

export default function Navbar() {
  // const {  } = useContext(MyContext);
  const userData = JSON.parse(localStorage.getItem("user-profile"));
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const{ reFetchData} = useContext(MyContext);
  const [file, setFile] = useState(null);

  const [caption, setCaption] = useState("");

  const navigate = useNavigate();
  const handleLogout = () => {
    fetch("http://localhost:1337/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          localStorage.clear();
          navigate("/login");
          localStorage.setItem("chakra-ui-color-mode", "light");
          return alert("logout successfully");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${userData.token}`);

    if (file === null) {
      formData.append("caption", caption);
    } else {
      formData.append("postpic", file);
      formData.append("caption", caption);
    }

    console.log(JSON.stringify(...formData));
    fetch("http://localhost:1337/create-post", {
      method: "POST",
      body: formData,
      headers: headers,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        reFetchData();
        navigate("/");
        onClose();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Box>
            <Link to={"/"}>
              <Img
                w={10}
                src="https://img.icons8.com/fluency/48/null/gog-galaxy--v2.png"
                alt="logo"
              />
            </Link>
          </Box>

          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7}>
              <Button onClick={onOpen}>+ Create post</Button>

              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay m={0} />
                <ModalContent m={0}>
                  <ModalHeader>Create new Post</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <form onSubmit={handleOnSubmit}>
                      <VStack spacing={4} align="flex-start">
                        <FormControl>
                          <FormLabel htmlFor="caption">Caption</FormLabel>
                          <Input
                            id="caption"
                            name="caption"
                            type="text"
                            variant="outline"
                            focusBorderColor="green.400"
                            placeholder="write something about post"
                            onChange={(e) => setCaption(e.target.value)}
                          />
                        </FormControl>
                        <FormControl>
                          <FormLabel htmlFor="postpic">
                            Upload post photo
                          </FormLabel>
                          <Input
                            id="postpic"
                            name="postpic"
                            type="file"
                            variant="unstyled"
                            onChange={handleFileChange}
                          />
                        </FormControl>
                        <Button
                          type="create"
                          bgColor={"lightgreen"}
                          width="full"
                        >
                          create
                        </Button>
                      </VStack>
                    </form>
                  </ModalBody>

                  <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onClose}>
                      Close
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
              <Button onClick={toggleColorMode}>
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>

              <Menu zIndex={2}>
                <MenuButton
                  as={Button}
                  rounded={"full"}
                  variant={"link"}
                  cursor={"pointer"}
                  minW={0}
                >
                  <Avatar size={"sm"} src={userData.profilePic} />
                </MenuButton>
                <MenuList alignItems={"center"} zIndex={2}>
                  <br />
                  <Center>
                    <Avatar size={"2xl"} src={userData.profilePic} />
                  </Center>
                  <br />
                  <Center>
                    <p>{userData.username}</p>
                  </Center>
                  <Center>
                    <p>{userData.email}</p>
                  </Center>
                  <br />
                  <MenuDivider />
                  <Link to={"/profile"}>
                    <MenuItem>Your profile</MenuItem>
                  </Link>
                  <Link to={"/receive-post"}>
                    <MenuItem>Shared posts</MenuItem>
                  </Link>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
