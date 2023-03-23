import {
  Card,
  CardBody,
  CardFooter,
  Heading,
  Image,
  Stack,
} from "@chakra-ui/react";
import React from "react";

const NormalPostCard = ({ post }) => {
  return (
    <Card m={2} key={post.id}>
      {post.image !== "" && (
        <CardBody>
          <Image src={post.image} borderRadius="lg" />
        </CardBody>
      )}

      <CardFooter
        justify="space-between"
        flexWrap="wrap"
        sx={{
          "& > button": {
            minW: "136px",
          },
        }}
      >
        <Stack mt="6" spacing="3">
          <Heading size="md">{post.caption}</Heading>
        </Stack>
      </CardFooter>
    </Card>
  );
};

export default NormalPostCard;
