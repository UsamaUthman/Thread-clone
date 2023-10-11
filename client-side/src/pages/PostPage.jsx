import { Avatar, Box, Button, Divider, Flex, Image, Text } from "@chakra-ui/react"
import { BsThreeDots } from "react-icons/bs"
import {AiOutlineDownload} from "react-icons/ai"
import Actions from "../components/Actions"
import { useEffect, useState } from "react"
import Comment from "../components/Comment"
import { useToast } from "@chakra-ui/react"
import { useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"

function PostPage() {
  const [postSuser , setPostUser] = useState({})
  const [liked , setLiked] = useState(false)
  const [likes , setLikes] = useState(0)
  const [post , setPost] = useState({})
  const [reply , setReplies] = useState([])
  const postId = window.location.pathname.split("/")[3]
  const toast = useToast()
  const currentUser = useRecoilValue(userAtom)

  useEffect(() => {
    const getPost = async ()=>{
      try {
        const res = await fetch(`/api/posts/${postId}`, {
          method: "GET",
        });
        const data = await res.json();
        if (data.error) {
          console.log(data.error)
          return;
        }
        setPost(data.post)
        setLiked(data.post.likes.includes(currentUser?._id))
        setReplies(data.post.replies)
        setLikes(data.post.likes.length)
        const resUser = await fetch(`/api/users/${data.post.postedBy}`, {
          method: "GET",
        });
        const dataUser = await resUser.json();
        if(dataUser.error){
          toast({
            title: "An error occurred.",
            description: dataUser.error,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return
        }

        setPostUser(dataUser.user)
      } catch (error) {
        console.log(error)
      }
    }

    getPost()
  }, [])

  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar size="md" name="Usama" src={postSuser.profilePic} />
          <Flex>
              <Text fontSize={"sm"} fontWeight={"bold"}> {postSuser.username} </Text>
              <Image src={"/verified.png"} w={4} h={4} ml={1} />
          </Flex>
        </Flex>
        <Flex gap={1} alignItems={"center"}>
          <Text textAlign={"center"} width={150} fontSize={"sm"}>{new Date(post?.createdAt).toDateString()}</Text>
          <BsThreeDots size={20} cursor={"pointer"} />
        </Flex>
      </Flex>
      <Text fontSize={"lg"} my={5}>
        {post.text}
      </Text>
      <Flex justifyContent={"center"} alignItems={"center"} mt={5} position={"relative"}>
          <Image src={post.img}   height={400} />
      </Flex>

      <Flex my={3}>
        <Actions liked={liked} setLiked={setLiked} post={post} currentUser={currentUser} setReplies={setReplies} setLikes={setLikes} />
      </Flex>
      <Flex alignItems={"center"} gap={3}> 
        {reply && (
          <Text color={"gray.light"} fontSize={"sm"}> {reply.length} replies</Text>
        )}
        <Box w={"5px"} h={"5px"} bg={"gray.light"} borderRadius={"full"}></Box>
        <Text color={"gray.light"} fontSize={"sm"}> {likes} likes</Text>
      </Flex>
      <Divider my={3} />
      <Flex justifyContent={"space-between"} alignItems={"center"}>
        <Flex justifyContent={"flex-start"} gap={5}>
          <AiOutlineDownload size={20} cursor={"pointer"} />
          <Text fontSize={"sm"}>Download App</Text>
        </Flex>
        <Button colorScheme={"gray"} onClick={()=>{
          toast({
            title: "An error occurred.",
            description: "This feature is not available yet.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }}>Get App</Button>
      </Flex>
      <Divider my={3} />
        {reply.map((item , index)=>{
          return (
            <Comment key={index} comment={item}
            currentUser={currentUser}
            post={post}
            setReplies={setReplies}
            />
          )})}
     
   
    </>
    )
}

export default PostPage