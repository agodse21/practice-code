import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTweets } from "../Redux/action";
import {
  Box,
  Card,
  CardHeader,
  Flex,
  Avatar,
  Heading,
  Text,
  CardBody,
  Image,
  SimpleGrid,
  Button,
  CardFooter,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  Textarea,
} from "@chakra-ui/react";
import axios from "axios";

export default function ViewTweet() {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const tweets = useSelector((store) => store.posts);
  const cUser = useSelector((store) => store.current);
  const [editedTweet, setEditedTweet] = useState("");
  useEffect(() => {
    dispatch(getTweets());
  }, [dispatch]);

  async function handleDelete(id) {
    await axios.delete(`http://localhost:3004/posts/${id}`);
    dispatch(getTweets());
  }

  async function handleEdit(el) {
    await axios.put(`http://localhost:3004/posts/${el.id}`, {
      username: el.username,
      tweet: editedTweet,
      gif: el.gif,
    });
    dispatch(getTweets());
  }
  return (
    <SimpleGrid columns={3}>
      {tweets.map((el, index) => {
        return (
          <Card maxW="md">
            <CardHeader>
              <Flex spacing="4">
                <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                  <Avatar
                    name="Segun Adebayo"
                    src="https://bit.ly/sage-adebayo"
                  />

                  <Box>
                    <Heading size="sm">{el.username}</Heading>
                  </Box>
                </Flex>
              </Flex>
            </CardHeader>
            <CardBody>
              <Text>{el.tweet}</Text>
            </CardBody>
            <CardFooter>
              {cUser.user === el.username ? (
                <>
                  <Button onClick={onOpen}>Edit</Button>
                  <Button onClick={() => handleDelete(el.id)}>Delete</Button>
                  <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                      <ModalHeader>Create your account</ModalHeader>
                      <ModalCloseButton />
                      <ModalBody pb={6}>
                        <Textarea
                          placeholder="Edit Tweet here"
                          defaultValue={el.tweet}
                          onChange={(e) => setEditedTweet(e.target.value)}
                        />
                      </ModalBody>

                      <ModalFooter>
                        <Button
                          colorScheme="blue"
                          mr={3}
                          onClick={() => handleEdit(el)}
                        >
                          Save
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                      </ModalFooter>
                    </ModalContent>
                  </Modal>
                </>
              ) : (
                ""
              )}
            </CardFooter>
            <Image objectFit="cover" src={el.gif} alt="Chakra UI" />
          </Card>
        );
      })}
    </SimpleGrid>
  );
}
