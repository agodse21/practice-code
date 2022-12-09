import {
  Textarea,
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  Image,
  SimpleGrid,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTweets } from "../Redux/action";

export const PostTweet = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const userLoggedIn = useSelector((store) => store.current);
  const [tweet, setTweet] = useState("");
  const [searchGif, setSearchGif] = useState("");
  const [gifItems, setGifItems] = useState([]);
  const [selectedGif, setSelectedGif] = useState("");

  async function searchForGif() {
    let { data } = await axios.get(
      `https://api.giphy.com/v1/gifs/search?api_key=sdUwHa4YZ4BYUgweGmrrIEXRyRxMCN1T&q=${searchGif}&limit=5&offset=0&rating=g&lang=en`
    );
    setGifItems(data.data);
  }

  async function postTweet() {
    console.log(userLoggedIn);
    await axios.post("http://localhost:3004/posts", {
      username: userLoggedIn.user || "Corey",
      tweet: tweet,
      gif: selectedGif,
    });
    dispatch(getTweets());
  }
  return (
    <Box>
      <Textarea
        placeholder="Tweet here....."
        onChange={(e) => setTweet(e.target.value)}
      />
      <Box>
        <Button onClick={onOpen}>GIF</Button>
        <Button onClick={postTweet}>POST</Button>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Select Gif</ModalHeader>
            <ModalCloseButton />
            <ModalBody display={"flex"} flexDirection={"row"} flexWrap={"wrap"}>
              <Box>
                <Input
                  type={"text"}
                  onChange={(e) => setSearchGif(e.target.value)}
                />
                <Button onClick={searchForGif}>Search</Button>
              </Box>
              <SimpleGrid columns={3}>
                {gifItems.map((el, index) => {
                  return (
                    <Image
                      src={el.images.original.url}
                      width="200px"
                      height="200px"
                      onClick={(e) => setSelectedGif(e.target.src)}
                    />
                  );
                })}
              </SimpleGrid>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
};
