import { AddIcon, CloseIcon } from '@chakra-ui/icons'
import { Button, Flex, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, useColorModeValue, useDisclosure } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import profileImageChange from '../../hooks/profileImageChange'
import { useToast } from '@chakra-ui/react'
import { useRecoilValue } from 'recoil'
import userAtom from '../atoms/userAtom'

function CreatePost() {
    const toast = useToast()
    const currentUser = useRecoilValue(userAtom)
    const fileRef = useRef(null)
    const [postText , setPostText] = useState("")
    const { isOpen, onOpen, onClose } = useDisclosure()
    const {handleImageChange , imgUrl , setImgUrl} = profileImageChange()

    const handleTextChange = (e) => {
        setPostText(e.target.value)
    }

    const handlePost = async () => {
        if (!isValidInput()) {
          return;
        }
      
        try {
          const data = await createPost();
      
          if (data.error) {
            handlePostError(data.error);
            return;
          }
      
          handlePostSuccess();
        } catch (err) {
          console.log(err);
        }
      };
      
      const isValidInput = () => {
        if (!postText && !imgUrl) {
          handlePostError("You must fill one of the fields");
          return false;
        }
      
        if (postText.length > 400) {
          handlePostError("Post text must be less than 400 characters");
          return false;
        }
      
        return true;
      };
      
      const createPost = async () => {
        const res = await fetch("/api/posts/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postedBy: currentUser?._id,
            text: postText,
            img: imgUrl,
          }),
        });
      
        return res.json();
      };
      
      const handlePostError = (errorMessage) => {
        toast({
          title: "An error occurred.",
          description: errorMessage,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      };
      
      const handlePostSuccess = () => {
        setPostText("");
        setImgUrl(null);
        onClose();
        toast({
          title: "Success",
          description: "Post created successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      };

    return (
        <>
            <Button
            position={"fixed"}
            bottom={"25px"}
            right={"25px"}
            bg={useColorModeValue("gray.800" , "blue.600")}
            color={"white"}
            rightIcon={<AddIcon />}
            _hover={{bg: useColorModeValue("gray.700" , "gray.dark")}}
            onClick={onOpen}
            >Post</Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Create Post</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl >
                        <Textarea placeholder="Here is a sample placeholder" onChange={handleTextChange} value={postText} />
                        <Text fontSize={"xs"} fontWeight={"bold"} textAlign={"right"} m={1} color={"gray.400"}>{postText.length}/400</Text>
                        <Input type="file" hidden  ref={fileRef}  onChange={handleImageChange} />
                        <Button onClick={()=>{
                            fileRef.current.click()
                        }}>Upload Image</Button>

                        {imgUrl && (
                            <Flex justifyContent={"center"} alignItems={"center"} mt={5} position={"relative"}>
                                <Image src={imgUrl} size={"sm"}  height={300} />
                                <CloseIcon cursor={"pointer"} position={"absolute"} top={"10px"} right={"10px"} onClick={()=>{
                                    setImgUrl(null)
                                }} />
                            </Flex>
                        )}

                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button mx={5} variant='outline' onClick={handlePost}>Post</Button>
                    <Button colorScheme='red' mr={3} onClick={onClose}>
                    Close
                    </Button>
                </ModalFooter>
                </ModalContent>
        </Modal>
        </>
    )
}

export default CreatePost