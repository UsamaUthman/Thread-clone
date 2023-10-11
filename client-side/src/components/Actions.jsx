import { Button, Flex, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@chakra-ui/react'
import React, { useState } from 'react'
import {AiOutlineHeart , AiFillHeart} from 'react-icons/ai'
import {BiComment} from 'react-icons/bi'
import {PiShareFatLight} from 'react-icons/pi'
import { useToast } from '@chakra-ui/react'

function Actions({liked , setLiked , post:post_, currentUser , setReplies , setLikes}) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [post , setPost] = useState(post_)
  const toast = useToast()
  const [text , setText] = useState("")


  const handleLike = async () => {
    if(!currentUser) {
      return
    }
    try{
      const res = await fetch(`/api/posts/like/${post_._id}` , {
        method: "POST",
      },
      )
      const data = await res.json()
      if(data.error){
        toast({
          title: "An error occurred.",
          description: data.error,
          status: "error",
          duration: 3000,
          isClosable: true,
          })
          return;
      }
      setLiked(!liked)
      toast({
        title: "Success",
        description: data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
        })
        console.log(data)
        setLikes(data.likes)
    }catch(err){
      console.log(err)
    }
  }

  const handleReply = async () => {
    console.log(post_)
    if(!text) {
      return
    }
    if(!currentUser) {
      return
    }
    try{
      const res = await fetch(`/api/posts/reply/${post_._id}` , {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text
        })
      },
      )
      const data = await res.json()
      if(data.error){
        toast({
          title: "An error occurred.",
          description: data.error,
          status: "error",
          duration: 3000,
          isClosable: true,
          })
          return;
      }

      toast({
        title: "Success",
        description: data.message,
        status: "success",
        duration: 3000,
        isClosable: true,
        })

        setText("")
        onClose()
        setPost((prevPost) => ({
          ...prevPost,
          replies: Array.isArray(prevPost.replies) ? [...prevPost.replies, data.replies] : [data.replies],
        }));

        console.log(data)
        
        setReplies((prevReplies) => [...prevReplies, data]);
      }catch(err){
      console.log(err)
    }
  }
  return (
    <Flex justifyContent={"space-between"} mt={2} maxW={"640px"} onClick={(e)=>{
        e.preventDefault()
    }}>
        <Flex gap={3} justifyContent={"center"} alignItems={"center"} m={0}>
            {liked ? <AiFillHeart size={25} cursor={"pointer"} color='#ff3333' onClick={()=>{
              handleLike()
            }}/> : <AiOutlineHeart size={25} cursor={"pointer"} onClick={()=>{
              handleLike()
            }}/>
            }
            <BiComment size={25} cursor={"pointer"} onClick={()=>{
              onOpen()
            }}/>
            <Modal isOpen={isOpen} onClose={onClose}>
                 <ModalContent>
                    <ModalHeader>Reply</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                      <Input placeholder="Type your comment here..." onChange={(e)=>{
                        setText(e.target.value)
                      }} />
                    </ModalBody>

                    <ModalFooter>
                      <Button colorScheme='blue' mr={3} onClick={handleReply}>
                        Save
                      </Button>
                      <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <PiShareFatLight size={25} cursor={"pointer"}/>
        </Flex>
    </Flex>
  )
}

export default Actions